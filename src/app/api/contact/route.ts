import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  sanitizeForSubject,
  isValidEmail,
  rateLimit,
  getClientIp,
  verifyTurnstile,
} from "@/lib/form-security";
import {
  buildEmail,
  INTERNAL_ALERT_TO,
  INTERNAL_ALERT_BCC,
} from "@/lib/email/layout";
import {
  buildContactConfirmationHtml,
  buildContactInternalHtml,
} from "@/lib/email/templates/contact-emails";

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  interest: string;
  message: string;
  "bot-field"?: string;
  turnstileToken?: string;
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = getClientIp(request.headers);
  if (!rateLimit(`contact:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot: if the hidden field has a value, it's a bot
  if (data["bot-field"]) {
    // Return success to avoid tipping off the bot
    return NextResponse.json({ success: true });
  }

  // Turnstile verification
  const turnstileOk = await verifyTurnstile(data.turnstileToken);
  if (!turnstileOk) {
    return NextResponse.json({ error: "Bot verification failed" }, { status: 403 });
  }

  if (!data.email || !data.firstName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!isValidEmail(data.email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Persist lead to Supabase before sending emails
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from("contact_leads").insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      company: data.company || null,
      interest: data.interest || null,
      message: data.message || null,
    });
  } catch (err) {
    console.error("Supabase insert failed (non-blocking):", err);
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send(
      buildEmail({
        from: "ENVRT <info@envrt.com>",
        to: data.email,
        subject: "Thanks for contacting ENVRT",
        html: buildContactConfirmationHtml(data.firstName),
      })
    );

    const safeName = sanitizeForSubject(`${data.firstName} ${data.lastName}`);
    const safeCompany = data.company ? sanitizeForSubject(data.company) : "";

    await resend.emails.send(
      buildEmail({
        from: "ENVRT System <info@envrt.com>",
        to: INTERNAL_ALERT_TO,
        bcc: INTERNAL_ALERT_BCC,
        subject: `Contact: ${safeName}${safeCompany ? ` @ ${safeCompany}` : ""}`,
        html: buildContactInternalHtml(data),
        replyTo: data.email,
      })
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

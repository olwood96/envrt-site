import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  escapeHtml,
  sanitizeForSubject,
  isValidEmail,
  rateLimit,
  getClientIp,
  verifyTurnstile,
} from "@/lib/form-security";

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  message: string;
  "bot-field"?: string;
  turnstileToken?: string;
}

const INTERNAL_EMAIL = "info@envrt.com";
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function buildConfirmationHtml(firstName: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="padding:0 0 32px;">
          <img src="https://envrt.com/brand/envrt-logo.png" alt="ENVRT" height="32" style="height:32px;width:auto;">
        </td></tr>
        <tr><td style="background:#ffffff;border-radius:16px;padding:32px;">
          <h2 style="margin:0 0 16px;color:#1b3a2d;font-size:20px;">Thanks for getting in touch, ${escapeHtml(firstName)}!</h2>
          <p style="margin:0 0 16px;font-size:14px;color:#555;line-height:1.7;">We've received your message and will get back to you shortly. In the meantime, feel free to explore our platform.</p>
          <a href="https://envrt.com" style="display:inline-block;background:#1a7a6d;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:12px;">Visit envrt.com</a>
        </td></tr>
        <tr><td style="padding:32px 0 0;" align="center">
          <p style="margin:0;font-size:12px;color:#999;">
            <a href="https://envrt.com" style="color:#1a7a6d;text-decoration:none;">envrt.com</a>
            &nbsp;&middot;&nbsp;
            <a href="https://envrt.com/privacy" style="color:#1a7a6d;text-decoration:none;">Privacy</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildInternalNotifyHtml(data: ContactPayload): string {
  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;">
  <h2 style="color:#1b3a2d;margin:0 0 16px;">New Contact Form Submission</h2>
  <table style="border-collapse:collapse;width:100%;margin-bottom:20px;">
    <tr><td style="padding:6px 12px;color:#666;">Name</td><td style="padding:6px 12px;font-weight:600;">${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</td></tr>
    <tr><td style="padding:6px 12px;color:#666;">Email</td><td style="padding:6px 12px;font-weight:600;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
    <tr><td style="padding:6px 12px;color:#666;">Company</td><td style="padding:6px 12px;font-weight:600;">${escapeHtml(data.company || "—")}</td></tr>
  </table>
  <h3 style="color:#1b3a2d;margin:0 0 8px;">Message</h3>
  <p style="font-size:14px;color:#333;line-height:1.7;white-space:pre-wrap;">${escapeHtml(data.message || "—")}</p>
  <p style="font-size:13px;color:#888;margin-top:24px;">Sent from the contact form at envrt.com/contact</p>
</div>`;
}

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

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "ENVRT <hello@envrt.com>",
      to: data.email,
      subject: "Thanks for contacting ENVRT",
      html: buildConfirmationHtml(data.firstName),
    });

    const safeName = sanitizeForSubject(`${data.firstName} ${data.lastName}`);
    const safeCompany = data.company ? sanitizeForSubject(data.company) : "";

    await resend.emails.send({
      from: "ENVRT Contact <hello@envrt.com>",
      to: INTERNAL_EMAIL,
      bcc: ["charlie@envrt.com", "oliver@envrt.com"],
      subject: `Contact: ${safeName}${safeCompany ? ` @ ${safeCompany}` : ""}`,
      html: buildInternalNotifyHtml(data),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

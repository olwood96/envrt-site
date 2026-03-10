import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { buildConfirmationEmail } from "@/lib/collective/email-templates";
import { verifyTurnstile, rateLimit, getClientIp } from "@/lib/form-security";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM_ADDRESS = "ENVRT Collective <collective@envrt.com>";

export async function POST(request: NextRequest) {
  // Rate limit: 5 subscribe attempts per IP per 10 minutes
  const ip = getClientIp(request.headers);
  if (!rateLimit(`collective-subscribe:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  let body: { email?: string; turnstileToken?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Verify Turnstile token
  const turnstileValid = await verifyTurnstile(body.turnstileToken);
  if (!turnstileValid) {
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 400 }
    );
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  // Check for existing active subscription
  const { data: existing } = await supabaseAdmin
    .from("collective_subscribers")
    .select("id, confirmed_at")
    .eq("email", email)
    .is("unsubscribed_at", null)
    .maybeSingle();

  if (existing?.confirmed_at) {
    // Already confirmed — return success to avoid enumeration
    return NextResponse.json({ success: true, message: "Check your email to confirm your subscription." });
  }

  let token: string;

  if (existing) {
    // Pending (not yet confirmed) — resend confirmation
    token = existing.id;
    // Fetch the token
    const { data: row } = await supabaseAdmin
      .from("collective_subscribers")
      .select("token")
      .eq("id", existing.id)
      .single();
    token = row?.token;
  } else {
    // Insert new subscriber
    const { data: inserted, error } = await supabaseAdmin
      .from("collective_subscribers")
      .insert({ email })
      .select("token")
      .single();

    if (error || !inserted) {
      console.error("Subscribe insert error:", error);
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }
    token = inserted.token;
  }

  // Send confirmation email
  const confirmUrl = `${getBaseUrl(request)}/api/collective/confirm?token=${token}`;
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: "Confirm your Collective subscription",
      html: buildConfirmationEmail(confirmUrl),
    });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Failed to send confirmation email" }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Check your email to confirm your subscription." });
}

function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get("host") ?? "envrt.com";
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

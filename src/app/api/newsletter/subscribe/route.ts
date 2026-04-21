import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyTurnstile, rateLimit, getClientIp, isValidEmail } from "@/lib/form-security";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per IP per 15 minutes
  const ip = getClientIp(request.headers);
  if (!rateLimit(`newsletter-subscribe:${ip}`, 5, 15 * 60 * 1000)) {
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

  // Verify Turnstile
  const turnstileValid = await verifyTurnstile(body.turnstileToken);
  if (!turnstileValid) {
    return NextResponse.json(
      { error: "Verification failed. Please refresh and try again." },
      { status: 403 }
    );
  }

  // Validate email
  const email = body.email?.trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    // Add contact to Resend with "newsletter" tag
    // This uses Resend's Contacts API — no separate audience setup needed.
    // The contact is tagged so you can filter/segment later.
    await resend.contacts.create({
      email,
      unsubscribed: false,
      audienceId: process.env.RESEND_NEWSLETTER_AUDIENCE_ID ?? "",
    });

    return NextResponse.json({
      message: "You're subscribed. Look out for our monthly insights.",
    });
  } catch (err: unknown) {
    // If the contact already exists, Resend returns a 409 or similar.
    // Treat as success to avoid leaking subscriber information.
    const errorMessage = err instanceof Error ? err.message : "";
    if (errorMessage.includes("already exists")) {
      return NextResponse.json({
        message: "You're subscribed. Look out for our monthly insights.",
      });
    }

    console.error("Newsletter subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

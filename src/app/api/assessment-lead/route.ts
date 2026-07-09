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
  buildAssessmentResultHtml,
  buildAssessmentInternalHtml,
} from "@/lib/email/templates/assessment-emails";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

interface DimensionScore {
  label: string;
  score: number;
}

interface AssessmentPayload {
  firstName: string;
  brandName: string;
  email: string;
  overall: number;
  band: string;
  headline: string;
  summary: string;
  dimensions: DimensionScore[];
  actions: string[];
  timelineRisk: string;
  greenClaimsFlag: boolean;
  marketingConsent: boolean;
  turnstileToken?: string;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  if (!rateLimit(`assessment:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  let data: AssessmentPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

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
    await supabase.from("assessment_leads").insert({
      first_name: data.firstName,
      brand_name: data.brandName,
      email: data.email,
      marketing_consent: data.marketingConsent,
      overall_score: data.overall,
      band: data.band,
      headline: data.headline,
      summary: data.summary,
      dimensions: data.dimensions,
      actions: data.actions,
      timeline_risk: data.timelineRisk,
      green_claims_flag: data.greenClaimsFlag,
    });
  } catch (err) {
    console.error("Supabase insert failed (non-blocking):", err);
  }

  const resend = new Resend(apiKey);

  try {
    const safeBand = sanitizeForSubject(String(data.band));
    const safeOverall = Math.max(0, Math.min(100, Math.round(Number(data.overall) || 0)));

    await resend.emails.send(
      buildEmail({
        from: "ENVRT <results@envrt.com>",
        to: data.email,
        subject: `Your DPP Readiness Score: ${safeOverall}/100 - ${safeBand}`,
        html: buildAssessmentResultHtml(data),
      })
    );

    const safeName = sanitizeForSubject(data.firstName);
    const safeBrand = sanitizeForSubject(data.brandName);

    await resend.emails.send(
      buildEmail({
        from: "ENVRT System <results@envrt.com>",
        to: INTERNAL_ALERT_TO,
        bcc: INTERNAL_ALERT_BCC,
        subject: `Assessment Lead: ${safeName} @ ${safeBrand} (${safeOverall}/100)`,
        html: buildAssessmentInternalHtml(data),
        replyTo: data.email,
      })
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

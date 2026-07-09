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
  formatRoiCurrency,
  buildRoiResultHtml,
  buildRoiInternalHtml,
} from "@/lib/email/templates/roi-emails";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

interface ROIPayload {
  firstName: string;
  brandName: string;
  email: string;
  marketingConsent: boolean;
  skuCount: number;
  dataMaturity: string;
  hoursPerProduct: number;
  market: string;
  approach: string;
  envrtCost: number;
  envrtPlan: string;
  envrtPlanPrice: string;
  consultantCost: number;
  inhouseCost: number;
  maxSaving: number;
  savingVsConsultant: number;
  savingVsInhouse: number;
  hoursSaved: number;
  daysSaved: number;
  turnstileToken?: string;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  if (!rateLimit(`roi:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  let data: ROIPayload;
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
    await supabase.from("roi_leads").insert({
      first_name: data.firstName,
      brand_name: data.brandName,
      email: data.email,
      marketing_consent: data.marketingConsent,
      sku_count: data.skuCount,
      data_maturity: data.dataMaturity,
      hours_per_product: data.hoursPerProduct,
      market: data.market,
      approach: data.approach,
      envrt_cost: data.envrtCost,
      envrt_plan: data.envrtPlan,
      consultant_cost: data.consultantCost,
      inhouse_cost: data.inhouseCost,
      max_saving: data.maxSaving,
      hours_saved: data.hoursSaved,
      days_saved: data.daysSaved,
    });
  } catch (err) {
    console.error("Supabase insert failed (non-blocking):", err);
  }

  const resend = new Resend(apiKey);

  try {
    const safeSaving = formatRoiCurrency(Math.max(0, Math.round(Number(data.maxSaving) || 0)));

    await resend.emails.send(
      buildEmail({
        from: "ENVRT <results@envrt.com>",
        to: data.email,
        subject: `Your DPP Compliance Savings: ${safeSaving}/yr with ENVRT`,
        html: buildRoiResultHtml(data),
      })
    );

    const safeName = sanitizeForSubject(data.firstName);
    const safeBrand = sanitizeForSubject(data.brandName);

    await resend.emails.send(
      buildEmail({
        from: "ENVRT System <results@envrt.com>",
        to: INTERNAL_ALERT_TO,
        bcc: INTERNAL_ALERT_BCC,
        subject: `ROI Lead: ${safeName} @ ${safeBrand} (${safeSaving} saving)`,
        html: buildRoiInternalHtml(data),
        replyTo: data.email,
      })
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

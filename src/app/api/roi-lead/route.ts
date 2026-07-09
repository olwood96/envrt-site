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
  renderEmail,
  subheading,
  mutedParagraph,
  primaryButton,
  internalAlertHtml,
  buildEmail,
  INTERNAL_ALERT_TO,
  INTERNAL_ALERT_BCC,
  escapeHtml as esc,
  EMAIL_COLORS,
} from "@/lib/email/layout";

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

function formatCurrency(n: number): string {
  return `£${n.toLocaleString("en-GB")}`;
}

function buildEmailHtml(data: ROIPayload): string {
  const maxCost = Math.max(data.envrtCost, data.consultantCost, data.inhouseCost);
  const pct = (cost: number) => (maxCost > 0 ? Math.max(5, (cost / maxCost) * 100) : 5);

  const costRow = (label: string, cost: number, barColor: string) => `
    <tr>
      <td style="padding:8px 0;font-size:14px;color:${EMAIL_COLORS.black};width:100px;">${esc(label)}</td>
      <td style="padding:8px 0;">
        <div style="background:${EMAIL_COLORS.vista};border-radius:8px;height:12px;width:100%;">
          <div style="background:${barColor};border-radius:8px;height:12px;width:${pct(cost)}%;"></div>
        </div>
      </td>
      <td style="padding:8px 0 8px 12px;font-size:14px;font-weight:700;color:${EMAIL_COLORS.black};text-align:right;white-space:nowrap;">${formatCurrency(cost)}/yr</td>
    </tr>`;

  const savingHeader = `
    <div style="background:${EMAIL_COLORS.black};border-radius:12px;padding:30px 24px;text-align:center;margin:0 0 24px;">
      <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#B9A6FF;font-weight:700;">Your Estimated Annual Saving</p>
      <p style="margin:0;font-size:54px;font-weight:700;color:#ffffff;line-height:1.1;">${formatCurrency(data.maxSaving)}</p>
      <p style="margin:12px 0 0;font-size:14px;color:#8A8A8A;">by switching to ENVRT</p>
    </div>`;

  const statCards = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;">
      <tr>
        <td style="background:${EMAIL_COLORS.vista};border-radius:12px;padding:20px;width:50%;" align="center">
          <p style="margin:0;font-size:26px;font-weight:700;color:${EMAIL_COLORS.ultramarine};">${data.hoursSaved.toLocaleString("en-GB")}h</p>
          <p style="margin:4px 0 0;font-size:13px;color:${EMAIL_COLORS.muted};">saved per year</p>
        </td>
        <td style="width:12px;"></td>
        <td style="background:${EMAIL_COLORS.vista};border-radius:12px;padding:20px;width:50%;" align="center">
          <p style="margin:0;font-size:26px;font-weight:700;color:${EMAIL_COLORS.ultramarine};">${esc(data.envrtPlan)}</p>
          <p style="margin:4px 0 0;font-size:13px;color:${EMAIL_COLORS.muted};">${esc(data.envrtPlanPrice)}</p>
        </td>
      </tr>
    </table>`;

  return renderEmail({
    preheader: `Estimated annual saving: ${formatCurrency(data.maxSaving)} with ENVRT`,
    contentHtml: [
      savingHeader,
      subheading("Annual cost comparison"),
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${costRow("ENVRT", data.envrtCost, EMAIL_COLORS.ultramarine)}${costRow("Consultant", data.consultantCost, "#9A9891")}${costRow("In-house", data.inhouseCost, "#63635E")}</table>`,
      statCards,
      `<div style="text-align:center;">${primaryButton("https://envrt.com/contact", "Get in touch")}</div>`,
      mutedParagraph("We can walk you through your results and discuss next steps."),
    ].join(""),
    footerNote: "This email was sent because you completed the ENVRT ROI Calculator.",
  });
}

function buildInternalNotifyHtml(data: ROIPayload): string {
  return internalAlertHtml({
    title: "New ROI calculator lead",
    rows: [
      ["Name", data.firstName],
      ["Brand", data.brandName],
      ["Email", data.email],
      ["Marketing consent", data.marketingConsent ? "Yes" : "No"],
      ["Products", data.skuCount],
      ["Data maturity", `${data.dataMaturity} (~${data.hoursPerProduct}h/product)`],
      ["Markets", data.market],
      ["Current approach", data.approach],
      ["ENVRT cost", `${formatCurrency(data.envrtCost)}/yr (${data.envrtPlan})`],
      ["Consultant cost", `${formatCurrency(data.consultantCost)}/yr`],
      ["In-house cost", `${formatCurrency(data.inhouseCost)}/yr`],
      ["Max saving", `${formatCurrency(data.maxSaving)}/yr`],
      ["Time saved", `${data.hoursSaved}h (${data.daysSaved} days)`],
    ],
  });
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
    const safeSaving = formatCurrency(Math.max(0, Math.round(Number(data.maxSaving) || 0)));

    await resend.emails.send(
      buildEmail({
        from: "ENVRT <results@envrt.com>",
        to: data.email,
        subject: `Your DPP Compliance Savings: ${safeSaving}/yr with ENVRT`,
        html: buildEmailHtml(data),
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
        html: buildInternalNotifyHtml(data),
        replyTo: data.email,
      })
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

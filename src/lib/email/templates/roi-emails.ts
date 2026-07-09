// src/lib/email/templates/roi-emails.ts
// ROI calculator emails. Registered in src/lib/email/previews.ts.

import {
  renderEmail,
  subheading,
  mutedParagraph,
  primaryButton,
  internalAlertHtml,
  escapeHtml as esc,
  EMAIL_COLORS,
} from "@/lib/email/layout";

export interface RoiEmailData {
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
  hoursSaved: number;
  daysSaved: number;
}

export function formatRoiCurrency(n: number): string {
  return `£${n.toLocaleString("en-GB")}`;
}

export function buildRoiResultHtml(data: RoiEmailData): string {
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
      <td style="padding:8px 0 8px 12px;font-size:14px;font-weight:700;color:${EMAIL_COLORS.black};text-align:right;white-space:nowrap;">${formatRoiCurrency(cost)}/yr</td>
    </tr>`;

  const savingHeader = `
    <div style="background:${EMAIL_COLORS.black};border-radius:12px;padding:30px 24px;text-align:center;margin:0 0 24px;">
      <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#B9A6FF;font-weight:700;">Your Estimated Annual Saving</p>
      <p style="margin:0;font-size:54px;font-weight:700;color:#ffffff;line-height:1.1;">${formatRoiCurrency(data.maxSaving)}</p>
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
    preheader: `Estimated annual saving: ${formatRoiCurrency(data.maxSaving)} with ENVRT`,
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

export function buildRoiInternalHtml(data: RoiEmailData): string {
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
      ["ENVRT cost", `${formatRoiCurrency(data.envrtCost)}/yr (${data.envrtPlan})`],
      ["Consultant cost", `${formatRoiCurrency(data.consultantCost)}/yr`],
      ["In-house cost", `${formatRoiCurrency(data.inhouseCost)}/yr`],
      ["Max saving", `${formatRoiCurrency(data.maxSaving)}/yr`],
      ["Time saved", `${data.hoursSaved}h (${data.daysSaved} days)`],
    ],
  });
}


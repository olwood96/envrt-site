// src/lib/email/templates/assessment-emails.ts
// DPP Readiness Assessment emails. Registered in src/lib/email/previews.ts.

import {
  renderEmail,
  subheading,
  paragraph,
  mutedParagraph,
  primaryButton,
  warningCallout,
  internalAlertHtml,
  escapeHtml,
  EMAIL_COLORS,
} from "@/lib/email/layout";

export interface AssessmentEmailData {
  firstName: string;
  brandName: string;
  email: string;
  overall: number;
  band: string;
  headline: string;
  summary: string;
  dimensions: { label: string; score: number }[];
  actions: string[];
  timelineRisk: string;
  greenClaimsFlag: boolean;
  marketingConsent: boolean;
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
}

export function buildAssessmentResultHtml(data: AssessmentEmailData): string {
  const overall = clampScore(data.overall);

  const dimensionRows = data.dimensions
    .map((d) => {
      const score = clampScore(d.score);
      return `
      <tr>
        <td style="padding:12px 16px 12px 0;font-size:14px;color:${EMAIL_COLORS.black};border-bottom:1px solid ${EMAIL_COLORS.border};">${escapeHtml(d.label)}</td>
        <td style="padding:12px 0;border-bottom:1px solid ${EMAIL_COLORS.border};width:45%;">
          <div style="background:${EMAIL_COLORS.vista};border-radius:8px;height:8px;width:100%;">
            <div style="background:${EMAIL_COLORS.ultramarine};border-radius:8px;height:8px;width:${score}%;"></div>
          </div>
        </td>
        <td style="padding:12px 0 12px 16px;font-size:14px;font-weight:700;color:${EMAIL_COLORS.black};text-align:right;white-space:nowrap;border-bottom:1px solid ${EMAIL_COLORS.border};">${score}/100</td>
      </tr>`;
    })
    .join("");

  const actionItems = data.actions
    .map(
      (a, i) => `
      <tr>
        <td style="padding:10px 14px 10px 0;vertical-align:top;width:28px;">
          <span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:${EMAIL_COLORS.ultramarine};color:#ffffff;font-size:12px;font-weight:700;text-align:center;line-height:22px;">${i + 1}</span>
        </td>
        <td style="padding:10px 0;font-size:14px;color:${EMAIL_COLORS.black};line-height:1.6;">${escapeHtml(a)}</td>
      </tr>`
    )
    .join("");

  const scoreHeader = `
    <div style="background:${EMAIL_COLORS.black};border-radius:12px;padding:30px 24px;text-align:center;margin:0 0 24px;">
      <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#B9A6FF;font-weight:700;">Your DPP Readiness Score</p>
      <p style="margin:0;font-size:54px;font-weight:700;color:#ffffff;line-height:1.1;">${overall}<span style="font-size:24px;color:#8A8A8A">/100</span></p>
      <p style="margin:12px 0 0;display:inline-block;padding:4px 14px;border-radius:99px;font-size:12px;font-weight:700;letter-spacing:0.5px;background:rgba(62,0,255,0.25);color:#CBB8FF;">${escapeHtml(data.band)}</p>
    </div>`;

  return renderEmail({
    preheader: `Your DPP readiness score: ${overall}/100`,
    contentHtml: [
      scoreHeader,
      paragraph(`<strong>${escapeHtml(data.headline)}</strong>`),
      mutedParagraph(escapeHtml(data.summary)),
      subheading("Dimension scores"),
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 0 20px;">${dimensionRows}</table>`,
      data.greenClaimsFlag
        ? warningCallout(
            "Green Claims Risk Flag &mdash; you indicated that your brand makes sustainability claims publicly but may lack the verified data to substantiate them. Under the EU Green Claims Directive, unsubstantiated claims carry real legal risk from 2026."
          )
        : "",
      subheading("Your timeline context"),
      mutedParagraph(escapeHtml(data.timelineRisk)),
      subheading("Recommended actions"),
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 0 8px;">${actionItems}</table>`,
      `<div style="text-align:center;">${primaryButton("https://envrt.com/contact", "Get in touch")}</div>`,
      mutedParagraph("We can walk you through your results and discuss next steps."),
    ].join(""),
    footerNote: "This email was sent because you completed the ENVRT DPP Readiness Assessment.",
  });
}

export function buildAssessmentInternalHtml(data: AssessmentEmailData): string {
  const overall = clampScore(data.overall);
  return internalAlertHtml({
    title: "New assessment lead",
    rows: [
      ["Name", data.firstName],
      ["Brand", data.brandName],
      ["Email", data.email],
      ["Score", `${overall}/100 (${data.band})`],
      ["Marketing consent", data.marketingConsent ? "Yes" : "No"],
      ["Green claims flag", data.greenClaimsFlag ? "Triggered" : ""],
      ...data.dimensions.map((d): [string, string] => [d.label, `${clampScore(d.score)}/100`]),
    ],
  });
}


import type { Handler } from "@netlify/functions";
import { Resend } from "resend";

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
}

function buildEmailHtml(data: AssessmentPayload): string {
  const dimensionRows = data.dimensions
    .map(
      (d) => `
      <tr>
        <td style="padding:12px 16px;font-size:14px;color:#1b3a2d;border-bottom:1px solid #e8e8e8;">${d.label}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #e8e8e8;">
          <div style="background:#f0f0f0;border-radius:8px;height:8px;width:100%;">
            <div style="background:#1a7a6d;border-radius:8px;height:8px;width:${d.score}%;"></div>
          </div>
        </td>
        <td style="padding:12px 16px;font-size:14px;font-weight:600;color:#1b3a2d;border-bottom:1px solid #e8e8e8;text-align:right;">${d.score}/100</td>
      </tr>`
    )
    .join("");

  const actionItems = data.actions
    .map(
      (a, i) => `
      <tr>
        <td style="padding:10px 16px;vertical-align:top;width:28px;">
          <span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:#1a7a6d;color:#fff;font-size:12px;font-weight:600;text-align:center;line-height:22px;">${i + 1}</span>
        </td>
        <td style="padding:10px 16px;font-size:14px;color:#1b3a2d;line-height:1.6;">${a}</td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Logo -->
        <tr><td style="padding:0 0 32px;">
          <img src="https://envrt.com/brand/envrt-logo.png" alt="ENVRT" height="32" style="height:32px;width:auto;">
        </td></tr>

        <!-- Score card -->
        <tr><td style="background:#ffffff;border-radius:16px;overflow:hidden;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <!-- Header -->
            <tr><td style="background:#1b3a2d;padding:32px 32px 28px;" align="center">
              <p style="margin:0 0 4px;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;color:#1a7a6d;font-weight:600;">Your DPP Readiness Score</p>
              <p style="margin:0;font-size:56px;font-weight:700;color:#ffffff;line-height:1.1;">${data.overall}<span style="font-size:24px;color:#a0a0a0">/100</span></p>
              <p style="margin:12px 0 0;display:inline-block;padding:4px 14px;border-radius:99px;font-size:12px;font-weight:600;letter-spacing:0.5px;background:rgba(26,122,109,0.15);color:#1a7a6d;">${data.band}</p>
            </td></tr>

            <!-- Headline and summary -->
            <tr><td style="padding:28px 32px 0;">
              <p style="margin:0;font-size:18px;font-weight:600;color:#1b3a2d;line-height:1.4;">${data.headline}</p>
              <p style="margin:12px 0 0;font-size:14px;color:#555;line-height:1.7;">${data.summary}</p>
            </td></tr>

            <!-- Dimension scores -->
            <tr><td style="padding:28px 32px 0;">
              <p style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#1a7a6d;font-weight:600;">Dimension Scores</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${dimensionRows}
              </table>
            </td></tr>

            ${
              data.greenClaimsFlag
                ? `<!-- Green claims flag -->
            <tr><td style="padding:24px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="background:#fef3c7;border-left:4px solid #f59e0b;border-radius:8px;padding:16px 20px;">
                  <p style="margin:0;font-size:13px;font-weight:600;color:#92400e;">Green Claims Risk Flag</p>
                  <p style="margin:6px 0 0;font-size:13px;color:#92400e;line-height:1.6;">You indicated that your brand makes sustainability claims publicly but may lack the verified data to substantiate them. Under the EU Green Claims Directive, unsubstantiated claims carry real legal risk from 2026.</p>
                </td></tr>
              </table>
            </td></tr>`
                : ""
            }

            <!-- Timeline context -->
            <tr><td style="padding:24px 32px 0;">
              <p style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#1a7a6d;font-weight:600;">Your Timeline Context</p>
              <p style="margin:0;font-size:14px;color:#555;line-height:1.7;">${data.timelineRisk}</p>
            </td></tr>

            <!-- Recommended actions -->
            <tr><td style="padding:28px 32px 0;">
              <p style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#1a7a6d;font-weight:600;">Recommended Actions</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${actionItems}
              </table>
            </td></tr>

            <!-- CTA -->
            <tr><td style="padding:32px 32px 36px;" align="center">
              <a href="https://envrt.com/contact" style="display:inline-block;background:#1a7a6d;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:12px;">Get in touch</a>
              <p style="margin:16px 0 0;font-size:13px;color:#888;">We can walk you through your results and discuss next steps.</p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:32px 0 0;" align="center">
          <p style="margin:0;font-size:12px;color:#999;">
            <a href="https://envrt.com" style="color:#1a7a6d;text-decoration:none;">envrt.com</a>
            &nbsp;&middot;&nbsp;
            <a href="https://envrt.com/insights" style="color:#1a7a6d;text-decoration:none;">Insights</a>
            &nbsp;&middot;&nbsp;
            <a href="https://envrt.com/privacy" style="color:#1a7a6d;text-decoration:none;">Privacy</a>
          </p>
          <p style="margin:8px 0 0;font-size:11px;color:#bbb;">This email was sent because you completed the ENVRT DPP Readiness Assessment.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Email service not configured" }),
    };
  }

  let data: AssessmentPayload;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body" }),
    };
  }

  if (!data.email || !data.firstName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields" }),
    };
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "ENVRT Assessment <results@envrt.com>",
      to: data.email,
      subject: `Your DPP Readiness Score: ${data.overall}/100 - ${data.band}`,
      html: buildEmailHtml(data),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Resend error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email" }),
    };
  }
};

export { handler };

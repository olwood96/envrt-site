import type { Handler } from "@netlify/functions";
import { Resend } from "resend";

interface ROIPayload {
  firstName: string;
  brandName: string;
  email: string;
  marketingConsent: boolean;
  skuCount: number;
  hoursPerProduct: number;
  market: string;
  approach: string;
  teamSize: string;
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
}

function formatCurrency(n: number): string {
  return `£${n.toLocaleString("en-GB")}`;
}

function buildEmailHtml(data: ROIPayload): string {
  const maxCost = Math.max(data.envrtCost, data.consultantCost, data.inhouseCost);
  const envrtPct = maxCost > 0 ? Math.max(5, (data.envrtCost / maxCost) * 100) : 5;
  const consultPct = maxCost > 0 ? Math.max(5, (data.consultantCost / maxCost) * 100) : 5;
  const inhousePct = maxCost > 0 ? Math.max(5, (data.inhouseCost / maxCost) * 100) : 5;

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

        <!-- Main card -->
        <tr><td style="background:#ffffff;border-radius:16px;overflow:hidden;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <!-- Header -->
            <tr><td style="background:#1b3a2d;padding:32px 32px 28px;" align="center">
              <p style="margin:0 0 4px;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;color:#1a7a6d;font-weight:600;">Your Estimated Annual Saving</p>
              <p style="margin:0;font-size:56px;font-weight:700;color:#ffffff;line-height:1.1;">${formatCurrency(data.maxSaving)}</p>
              <p style="margin:12px 0 0;font-size:14px;color:#a0a0a0;">by switching to ENVRT</p>
            </td></tr>

            <!-- Cost comparison -->
            <tr><td style="padding:28px 32px 0;">
              <p style="margin:0 0 16px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#1a7a6d;font-weight:600;">Annual Cost Comparison</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#1b3a2d;width:100px;">ENVRT</td>
                  <td style="padding:8px 0;">
                    <div style="background:#f0f0f0;border-radius:8px;height:12px;width:100%;">
                      <div style="background:#1a7a6d;border-radius:8px;height:12px;width:${envrtPct}%;"></div>
                    </div>
                  </td>
                  <td style="padding:8px 0 8px 12px;font-size:14px;font-weight:600;color:#1b3a2d;text-align:right;white-space:nowrap;">${formatCurrency(data.envrtCost)}/yr</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#1b3a2d;width:100px;">Consultant</td>
                  <td style="padding:8px 0;">
                    <div style="background:#f0f0f0;border-radius:8px;height:12px;width:100%;">
                      <div style="background:#999;border-radius:8px;height:12px;width:${consultPct}%;"></div>
                    </div>
                  </td>
                  <td style="padding:8px 0 8px 12px;font-size:14px;font-weight:600;color:#1b3a2d;text-align:right;white-space:nowrap;">${formatCurrency(data.consultantCost)}/yr</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:14px;color:#1b3a2d;width:100px;">In-house</td>
                  <td style="padding:8px 0;">
                    <div style="background:#f0f0f0;border-radius:8px;height:12px;width:100%;">
                      <div style="background:#555;border-radius:8px;height:12px;width:${inhousePct}%;"></div>
                    </div>
                  </td>
                  <td style="padding:8px 0 8px 12px;font-size:14px;font-weight:600;color:#1b3a2d;text-align:right;white-space:nowrap;">${formatCurrency(data.inhouseCost)}/yr</td>
                </tr>
              </table>
            </td></tr>

            <!-- Time savings -->
            <tr><td style="padding:24px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f5f5f0;border-radius:12px;padding:20px;width:50%;" align="center">
                    <p style="margin:0;font-size:28px;font-weight:700;color:#1a7a6d;">${data.hoursSaved.toLocaleString("en-GB")}h</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#666;">saved per year</p>
                  </td>
                  <td style="width:12px;"></td>
                  <td style="background:#f5f5f0;border-radius:12px;padding:20px;width:50%;" align="center">
                    <p style="margin:0;font-size:28px;font-weight:700;color:#1a7a6d;">${data.envrtPlan}</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#666;">${data.envrtPlanPrice}</p>
                  </td>
                </tr>
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
            <a href="https://envrt.com/pricing" style="color:#1a7a6d;text-decoration:none;">Pricing</a>
            &nbsp;&middot;&nbsp;
            <a href="https://envrt.com/privacy" style="color:#1a7a6d;text-decoration:none;">Privacy</a>
          </p>
          <p style="margin:8px 0 0;font-size:11px;color:#bbb;">This email was sent because you completed the ENVRT ROI Calculator.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const INTERNAL_NOTIFY_EMAIL = "info@envrt.com";

function buildInternalNotifyHtml(data: ROIPayload): string {
  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;">
  <h2 style="color:#1b3a2d;margin:0 0 16px;">New ROI Calculator Lead</h2>
  <table style="border-collapse:collapse;width:100%;margin-bottom:20px;">
    <tr><td style="padding:6px 12px;color:#666;">Name</td><td style="padding:6px 12px;font-weight:600;">${data.firstName}</td></tr>
    <tr><td style="padding:6px 12px;color:#666;">Brand</td><td style="padding:6px 12px;font-weight:600;">${data.brandName}</td></tr>
    <tr><td style="padding:6px 12px;color:#666;">Email</td><td style="padding:6px 12px;font-weight:600;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
    <tr><td style="padding:6px 12px;color:#666;">Marketing consent</td><td style="padding:6px 12px;font-weight:600;">${data.marketingConsent ? "Yes" : "No"}</td></tr>
  </table>
  <h3 style="color:#1b3a2d;margin:0 0 8px;">Calculator Inputs</h3>
  <table style="border-collapse:collapse;width:100%;margin-bottom:16px;">
    <tr><td style="padding:6px 12px;color:#666;">Products</td><td style="padding:6px 12px;font-weight:600;">${data.skuCount}</td></tr>
    <tr><td style="padding:6px 12px;color:#666;">Hours/product</td><td style="padding:6px 12px;font-weight:600;">${data.hoursPerProduct}h</td></tr>
    <tr><td style="padding:6px 12px;color:#666;">Markets</td><td style="padding:6px 12px;font-weight:600;">${data.market}</td></tr>
    <tr><td style="padding:6px 12px;color:#666;">Current approach</td><td style="padding:6px 12px;font-weight:600;">${data.approach}</td></tr>
    <tr><td style="padding:6px 12px;color:#666;">Team size</td><td style="padding:6px 12px;font-weight:600;">${data.teamSize}</td></tr>
  </table>
  <h3 style="color:#1b3a2d;margin:0 0 8px;">Results</h3>
  <table style="border-collapse:collapse;width:100%;margin-bottom:16px;">
    <tr><td style="padding:6px 12px;color:#666;">ENVRT cost</td><td style="padding:6px 12px;font-weight:600;">${formatCurrency(data.envrtCost)}/yr (${data.envrtPlan})</td></tr>
    <tr><td style="padding:6px 12px;color:#666;">Consultant cost</td><td style="padding:6px 12px;font-weight:600;">${formatCurrency(data.consultantCost)}/yr</td></tr>
    <tr><td style="padding:6px 12px;color:#666;">In-house cost</td><td style="padding:6px 12px;font-weight:600;">${formatCurrency(data.inhouseCost)}/yr</td></tr>
    <tr><td style="padding:6px 12px;color:#666;">Max saving</td><td style="padding:6px 12px;font-weight:600;color:#1a7a6d;">${formatCurrency(data.maxSaving)}/yr</td></tr>
    <tr><td style="padding:6px 12px;color:#666;">Time saved</td><td style="padding:6px 12px;font-weight:600;">${data.hoursSaved}h (${data.daysSaved} days)</td></tr>
  </table>
  <p style="font-size:13px;color:#888;margin-top:24px;">Sent from the ROI Calculator at envrt.com/roi</p>
</div>`;
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

  let data: ROIPayload;
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
    // Send results to the user
    await resend.emails.send({
      from: "ENVRT Calculator <results@envrt.com>",
      to: data.email,
      subject: `Your DPP Compliance Savings: ${formatCurrency(data.maxSaving)}/yr with ENVRT`,
      html: buildEmailHtml(data),
    });

    // Send internal lead notification
    await resend.emails.send({
      from: "ENVRT Calculator <results@envrt.com>",
      to: INTERNAL_NOTIFY_EMAIL,
      subject: `ROI Lead: ${data.firstName} @ ${data.brandName} (${formatCurrency(data.maxSaving)} saving)`,
      html: buildInternalNotifyHtml(data),
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

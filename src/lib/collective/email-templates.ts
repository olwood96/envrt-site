const BRAND_COLOR = "#1a7a6d";
const DARK_BG = "#1b3a2d";
const LIGHT_BG = "#f5f5f0";

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:${LIGHT_BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${LIGHT_BG};">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="padding:0 0 32px;">
          <img src="https://envrt.com/brand/envrt-logo.png" alt="ENVRT" height="32" style="height:32px;width:auto;">
        </td></tr>
        <tr><td style="background:#ffffff;border-radius:16px;overflow:hidden;">
          ${content}
        </td></tr>
        <tr><td style="padding:32px 0 0;" align="center">
          <p style="margin:0;font-size:12px;color:#999;">
            <a href="https://envrt.com" style="color:${BRAND_COLOR};text-decoration:none;">envrt.com</a>
            &nbsp;&middot;&nbsp;
            <a href="https://envrt.com/collective" style="color:${BRAND_COLOR};text-decoration:none;">The Collective</a>
            &nbsp;&middot;&nbsp;
            <a href="https://envrt.com/privacy" style="color:${BRAND_COLOR};text-decoration:none;">Privacy</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildConfirmationEmail(confirmUrl: string): string {
  return emailWrapper(`
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="background:${DARK_BG};padding:32px 32px 28px;" align="center">
        <p style="margin:0;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;color:${BRAND_COLOR};font-weight:600;">The Collective</p>
        <p style="margin:8px 0 0;font-size:28px;font-weight:700;color:#ffffff;line-height:1.2;">Confirm your subscription</p>
      </td></tr>
      <tr><td style="padding:32px;">
        <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
          Thanks for subscribing to The Collective weekly digest. You'll receive a short email each Monday when new products are featured.
        </p>
        <p style="margin:0 0 24px;font-size:15px;color:#333;line-height:1.6;">
          Please confirm your email address by clicking the button below:
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
          <tr><td align="center" style="border-radius:12px;background:${BRAND_COLOR};">
            <a href="${confirmUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;">Confirm subscription</a>
          </td></tr>
        </table>
        <p style="margin:24px 0 0;font-size:13px;color:#888;line-height:1.5;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </td></tr>
    </table>`);
}

export interface DigestProduct {
  name: string;
  brand: string;
  imageUrl: string | null;
  detailUrl: string;
  emissions: number | null;
  water: number | null;
}

export function buildDigestEmail(
  products: DigestProduct[],
  unsubscribeUrl: string
): string {
  const productRows = products
    .map(
      (p) => `
      <tr><td style="padding:16px 0;border-bottom:1px solid #f0f0f0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            ${
              p.imageUrl
                ? `<td style="width:80px;vertical-align:top;padding-right:16px;">
                    <img src="${p.imageUrl}" alt="${p.name}" width="80" height="80" style="width:80px;height:80px;object-fit:cover;border-radius:8px;display:block;">
                  </td>`
                : ""
            }
            <td style="vertical-align:top;">
              <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${BRAND_COLOR};font-weight:600;">${p.brand}</p>
              <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#1b3a2d;">
                <a href="https://envrt.com${p.detailUrl}" style="color:#1b3a2d;text-decoration:none;">${p.name}</a>
              </p>
              <p style="margin:6px 0 0;font-size:12px;color:#666;">
                ${p.emissions != null ? `${p.emissions.toFixed(1)} kg CO\u2082e` : ""}
                ${p.emissions != null && p.water != null ? " &middot; " : ""}
                ${p.water != null ? `${p.water.toFixed(1)} L H\u2082O` : ""}
              </p>
            </td>
            <td style="width:80px;vertical-align:middle;text-align:right;">
              <a href="https://envrt.com${p.detailUrl}" style="display:inline-block;padding:8px 14px;font-size:12px;font-weight:600;color:${BRAND_COLOR};text-decoration:none;border:1px solid ${BRAND_COLOR};border-radius:8px;">View</a>
            </td>
          </tr>
        </table>
      </td></tr>`
    )
    .join("");

  return emailWrapper(`
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="background:${DARK_BG};padding:32px 32px 28px;" align="center">
        <p style="margin:0;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;color:${BRAND_COLOR};font-weight:600;">The Collective</p>
        <p style="margin:8px 0 0;font-size:28px;font-weight:700;color:#ffffff;line-height:1.2;">New this week</p>
        <p style="margin:8px 0 0;font-size:14px;color:#a0a0a0;">${products.length} new product${products.length === 1 ? "" : "s"} featured</p>
      </td></tr>
      <tr><td style="padding:24px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${productRows}
        </table>
      </td></tr>
      <tr><td style="padding:16px 32px 32px;" align="center">
        <a href="https://envrt.com/collective" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;background:${BRAND_COLOR};">Browse all products</a>
      </td></tr>
      <tr><td style="padding:0 32px 24px;" align="center">
        <p style="margin:0;font-size:11px;color:#bbb;">
          You're receiving this because you subscribed to The Collective digest.
          <a href="${unsubscribeUrl}" style="color:#999;text-decoration:underline;">Unsubscribe</a>
        </p>
      </td></tr>
    </table>`);
}

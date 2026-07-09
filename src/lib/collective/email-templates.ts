// Collective subscriber emails, composed on the shared v3 email shell
// (src/lib/email/layout.ts). Escape all product/brand strings — they are
// brand-supplied content.

import {
  renderEmail,
  subheading,
  paragraph,
  mutedParagraph,
  primaryButton,
  textLink,
  escapeHtml,
  EMAIL_COLORS,
} from "@/lib/email/layout";

function darkBanner(eyebrow: string, title: string, sub?: string): string {
  return `
    <div style="background:${EMAIL_COLORS.black};border-radius:12px;padding:28px 24px;text-align:center;margin:0 0 24px;">
      <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#CBB8FF;font-weight:700;">${escapeHtml(eyebrow)}</p>
      <p style="margin:8px 0 0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.2;">${escapeHtml(title)}</p>
      ${sub ? `<p style="margin:8px 0 0;font-size:14px;color:#8A8A8A;">${escapeHtml(sub)}</p>` : ""}
    </div>`;
}

export function buildConfirmationEmail(confirmUrl: string): string {
  return renderEmail({
    preheader: "Confirm your subscription to The Collective weekly digest.",
    contentHtml: [
      darkBanner("The Collective", "Confirm your subscription"),
      paragraph(
        "Thanks for subscribing to The Collective weekly digest. You&rsquo;ll receive a short email each Monday when new products are featured.",
      ),
      paragraph("Please confirm your email address by clicking the button below:"),
      `<div style="text-align:center;">${primaryButton(confirmUrl, "Confirm subscription")}</div>`,
      mutedParagraph("If you didn&rsquo;t request this, you can safely ignore this email."),
    ].join(""),
    footerNote: "You're receiving this because you subscribed to The Collective at envrt.com/collective.",
  });
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
  unsubscribeUrl: string,
): string {
  const productRows = products
    .map(
      (p) => `
      <tr><td style="padding:16px 0;border-bottom:1px solid ${EMAIL_COLORS.border};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            ${
              p.imageUrl
                ? `<td style="width:80px;vertical-align:top;padding-right:16px;">
                    <img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.name)}" width="80" height="80" style="width:80px;height:80px;object-fit:cover;border-radius:8px;display:block;">
                  </td>`
                : ""
            }
            <td style="vertical-align:top;">
              <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${EMAIL_COLORS.ultramarine};font-weight:700;">${escapeHtml(p.brand)}</p>
              <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:${EMAIL_COLORS.black};">
                <a href="https://envrt.com${escapeHtml(p.detailUrl)}" style="color:${EMAIL_COLORS.black};text-decoration:none;">${escapeHtml(p.name)}</a>
              </p>
              <p style="margin:6px 0 0;font-size:12px;color:${EMAIL_COLORS.muted};">
                ${p.emissions != null ? `${p.emissions.toFixed(1)} kg CO₂e` : ""}
                ${p.emissions != null && p.water != null ? " &middot; " : ""}
                ${p.water != null ? `${p.water.toFixed(1)} L H₂O` : ""}
              </p>
            </td>
            <td style="width:80px;vertical-align:middle;text-align:right;">
              <a href="https://envrt.com${escapeHtml(p.detailUrl)}" style="display:inline-block;padding:8px 14px;font-size:12px;font-weight:700;color:${EMAIL_COLORS.ultramarine};text-decoration:none;border:1px solid ${EMAIL_COLORS.ultramarine};border-radius:8px;">View</a>
            </td>
          </tr>
        </table>
      </td></tr>`,
    )
    .join("");

  return renderEmail({
    preheader: `${products.length} new product${products.length === 1 ? "" : "s"} featured on The Collective this week.`,
    contentHtml: [
      darkBanner(
        "The Collective",
        "New this week",
        `${products.length} new product${products.length === 1 ? "" : "s"} featured`,
      ),
      subheading("Featured products"),
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${productRows}</table>`,
      `<div style="text-align:center;">${primaryButton("https://envrt.com/collective", "Browse all products")}</div>`,
      mutedParagraph(
        `You're receiving this because you subscribed to The Collective digest. ${textLink(unsubscribeUrl, "Unsubscribe")}.`,
      ),
    ].join(""),
    footerNote: "Sent weekly by ENVRT. Unsubscribe any time with the link above.",
  });
}

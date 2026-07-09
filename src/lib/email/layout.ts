// src/lib/email/layout.ts
// Shared v3 brand email shell for every email the site sends.
//
// Tokens follow the 2022 brand book (see docs/ui-styleguide-v3.md) and must
// stay in sync with tailwind.config.ts here and with
// envrt-dashboard/lib/email/templates/_layout.ts. Emails hardcode hex
// because mail clients cannot read CSS variables — change tokens here only.
//
// Every email: preheader → wordmark → content → footer, plus an automatic
// plain-text part via buildEmail(). Inline styles only (mail clients strip
// <style> blocks).

export const EMAIL_COLORS = {
  vista: "#FCF9F0", // page background (Vista White)
  card: "#FFFFFF",
  black: "#1A1A1A", // headings + body
  muted: "#63635E", // secondary text (solid stand-in for black/60 on vista)
  faint: "#9A9891", // meta text, footer
  border: "#E8E4DA", // solid stand-in for black/12 over vista
  ultramarine: "#3E00FF", // primary CTA (Vista + Ultramarine pairing)
  golden: "#FFBF00", // warning bg (Golden + Black pairing)
  crimson: "#B50003", // alert (Vista + Crimson pairing)
  vibrant: "#20E036", // success / live accent
  successBg: "#EDFBEF",
  alertBg: "#FDF1F0",
} as const;

const FONT_STACK =
  "Karla, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const LOGO_URL = "https://envrt.com/brand/envrt-logo.png";

export const INTERNAL_ALERT_TO = "info@envrt.com";
export const INTERNAL_ALERT_BCC = ["oliver@envrt.com", "charlie@envrt.com"];

export interface EmailLayoutOptions {
  contentHtml: string;
  /** Inbox preview line (hidden in the body). */
  preheader?: string;
  /** Why-you-got-this line. Defaults to a generic transactional note. */
  footerNote?: string;
}

export function renderEmail(opts: EmailLayoutOptions): string {
  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(opts.preheader)}</div>`
    : "";
  const footerNote = opts.footerNote
    ? escapeHtml(opts.footerNote)
    : "You&rsquo;re receiving this email from ENVRT.";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <link href="https://fonts.googleapis.com/css2?family=Karla:wght@400;600;700&display=swap" rel="stylesheet" />
    <title>ENVRT</title>
  </head>
  <body style="margin:0;padding:0;background:${EMAIL_COLORS.vista};font-family:${FONT_STACK};color:${EMAIL_COLORS.black};">
    ${preheader}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${EMAIL_COLORS.vista};padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
            <tr>
              <td style="padding:0 4px 28px;">
                <img src="${LOGO_URL}" alt="ENVRT" height="30" style="height:30px;width:auto;display:block;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="background:${EMAIL_COLORS.card};border:1px solid ${EMAIL_COLORS.border};border-radius:16px;padding:32px;font-size:15px;line-height:1.6;color:${EMAIL_COLORS.black};">
                ${opts.contentHtml}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:28px 8px 0;">
                <p style="margin:0;font-size:12px;color:${EMAIL_COLORS.faint};line-height:1.6;">${footerNote}</p>
                <p style="margin:8px 0 0;font-size:12px;color:${EMAIL_COLORS.faint};">
                  &copy; ENVRT &nbsp;&middot;&nbsp;
                  <a href="https://envrt.com" style="color:${EMAIL_COLORS.faint};text-decoration:underline;">envrt.com</a>
                  &nbsp;&middot;&nbsp;
                  <a href="https://envrt.com/privacy" style="color:${EMAIL_COLORS.faint};text-decoration:underline;">Privacy</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// ── Block helpers (compose inside contentHtml) ────────────────────────

export function heading(text: string): string {
  return `<h1 style="margin:0 0 14px;font-size:22px;font-weight:700;color:${EMAIL_COLORS.black};line-height:1.3;">${escapeHtml(text)}</h1>`;
}

export function subheading(text: string): string {
  return `<p style="margin:0 0 10px;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:${EMAIL_COLORS.ultramarine};font-weight:700;">${escapeHtml(text)}</p>`;
}

export function paragraph(html: string): string {
  return `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${EMAIL_COLORS.black};">${html}</p>`;
}

export function mutedParagraph(html: string): string {
  return `<p style="margin:0 0 14px;font-size:13px;line-height:1.6;color:${EMAIL_COLORS.muted};">${html}</p>`;
}

export function primaryButton(href: string, label: string): string {
  return `<p style="margin:20px 0;"><a href="${escapeHtml(href)}" style="display:inline-block;background:${EMAIL_COLORS.ultramarine};color:#ffffff;padding:13px 26px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">${escapeHtml(label)}</a></p>`;
}

export function textLink(href: string, label: string): string {
  return `<a href="${escapeHtml(href)}" style="color:${EMAIL_COLORS.ultramarine};font-weight:600;text-decoration:none;">${escapeHtml(label)}</a>`;
}

export type DetailRow = [label: string, value: string | number | null | undefined];

/** Key-value context table. Rows with empty values are dropped. */
export function detailTable(rows: DetailRow[]): string {
  const rendered = rows
    .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "")
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:8px 14px 8px 0;font-size:13px;color:${EMAIL_COLORS.muted};white-space:nowrap;vertical-align:top;border-bottom:1px solid ${EMAIL_COLORS.border};">${escapeHtml(label)}</td>
          <td style="padding:8px 0;font-size:13px;font-weight:600;color:${EMAIL_COLORS.black};border-bottom:1px solid ${EMAIL_COLORS.border};word-break:break-word;">${escapeHtml(String(value))}</td>
        </tr>`,
    )
    .join("");
  if (!rendered) return "";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0;border-collapse:collapse;">${rendered}</table>`;
}

/** Golden + Black book pairing. */
export function warningCallout(html: string): string {
  return `<div style="background:${EMAIL_COLORS.golden};border-radius:10px;padding:14px 18px;margin:16px 0;font-size:13px;line-height:1.6;color:${EMAIL_COLORS.black};font-weight:600;">${html}</div>`;
}

/** Vista + Crimson book pairing. */
export function alertCallout(html: string): string {
  return `<div style="background:${EMAIL_COLORS.alertBg};border:1px solid ${EMAIL_COLORS.crimson};border-radius:10px;padding:14px 18px;margin:16px 0;font-size:13px;line-height:1.6;color:${EMAIL_COLORS.crimson};">${html}</div>`;
}

/** Vibrant green success pairing. */
export function successCallout(html: string): string {
  return `<div style="background:${EMAIL_COLORS.successBg};border:1px solid ${EMAIL_COLORS.vibrant};border-radius:10px;padding:14px 18px;margin:16px 0;font-size:13px;line-height:1.6;color:${EMAIL_COLORS.black};">${html}</div>`;
}

export function divider(): string {
  return `<hr style="border:none;border-top:1px solid ${EMAIL_COLORS.border};margin:22px 0;" />`;
}

// ── Internal alerts (team-facing, same shell) ─────────────────────────

export interface InternalAlertOptions {
  title: string;
  rows: DetailRow[];
  /** Free-form extra html (e.g. a quoted message block). */
  bodyHtml?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function internalAlertHtml(opts: InternalAlertOptions): string {
  return renderEmail({
    preheader: opts.title,
    contentHtml: [
      heading(opts.title),
      detailTable(opts.rows),
      opts.bodyHtml ?? "",
      opts.ctaHref ? primaryButton(opts.ctaHref, opts.ctaLabel ?? "Open dashboard") : "",
    ].join(""),
    footerNote: "Internal ENVRT alert. No customer received this email.",
  });
}

// ── Payload builder ───────────────────────────────────────────────────

export interface BuildEmailInput {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  bcc?: string[];
  headers?: Record<string, string>;
}

/**
 * Standard Resend payload: adds an auto-generated plain-text part and a
 * default reply-to so no send dead-ends in a noreply mailbox.
 */
export function buildEmail(input: BuildEmailInput) {
  return {
    ...input,
    replyTo: input.replyTo ?? "info@envrt.com",
    text: toPlainText(input.html),
  };
}

// ── Escapes + plain text ──────────────────────────────────────────────

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function toPlainText(html: string): string {
  return html
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<(?:br|\/p|\/h[1-6]|\/tr|\/div)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&middot;/g, "·")
    .replace(/&rsquo;/g, "'")
    .replace(/&copy;/g, "©")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

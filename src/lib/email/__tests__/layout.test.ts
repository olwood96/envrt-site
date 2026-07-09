// Tests for the shared v3 email shell. Pins the brand tokens, escaping,
// plain-text generation and the standard payload builder so every email
// the site sends stays on one design system.

import { describe, it, expect } from "vitest";
import {
  renderEmail,
  heading,
  paragraph,
  primaryButton,
  detailTable,
  warningCallout,
  alertCallout,
  escapeHtml,
  toPlainText,
  buildEmail,
  internalAlertHtml,
  INTERNAL_ALERT_TO,
  INTERNAL_ALERT_BCC,
  EMAIL_COLORS,
} from "../layout";

describe("renderEmail", () => {
  it("wraps content in the v3 shell (vista bg, card, wordmark, footer)", () => {
    const html = renderEmail({ contentHtml: heading("Hello") });
    expect(html).toContain(EMAIL_COLORS.vista);
    expect(html).toContain("envrt-logo");
    expect(html).toContain("Hello");
    expect(html).toContain("envrt.com/privacy");
    expect(html).toContain('name="color-scheme"');
  });

  it("renders a hidden preheader when given", () => {
    const html = renderEmail({ contentHtml: "<p>x</p>", preheader: "Preview line" });
    expect(html).toContain("Preview line");
    expect(html).toContain("display:none");
  });

  it("uses the ultramarine accent for primary buttons", () => {
    const html = primaryButton("https://envrt.com", "Go");
    expect(html).toContain(EMAIL_COLORS.ultramarine);
    expect(html).toContain("https://envrt.com");
  });
});

describe("detailTable", () => {
  it("renders label/value rows and escapes values", () => {
    const html = detailTable([
      ["Brand", "Acme <script>"],
      ["SKU", "TEE-001"],
    ]);
    expect(html).toContain("Brand");
    expect(html).toContain("TEE-001");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("skips rows with empty values", () => {
    const html = detailTable([
      ["Brand", "Acme"],
      ["Notes", ""],
      ["Missing", null],
    ]);
    expect(html).toContain("Acme");
    expect(html).not.toContain("Notes");
    expect(html).not.toContain("Missing");
  });
});

describe("callouts", () => {
  it("warning uses the golden + black book pairing", () => {
    const html = warningCallout("Careful");
    expect(html).toContain(EMAIL_COLORS.golden);
    expect(html).toContain("Careful");
  });

  it("alert uses the crimson pairing", () => {
    const html = alertCallout("Bad news");
    expect(html).toContain(EMAIL_COLORS.crimson);
  });
});

describe("escapeHtml / toPlainText", () => {
  it("escapes the usual suspects", () => {
    expect(escapeHtml(`<a href="x">&'`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&#39;");
  });

  it("converts html to readable plain text", () => {
    const text = toPlainText(
      "<h1>Title</h1><p>First line</p><p>Second &amp; third</p>",
    );
    expect(text).toContain("Title");
    expect(text).toContain("First line");
    expect(text).toContain("Second & third");
    expect(text).not.toContain("<p>");
  });
});

describe("buildEmail", () => {
  it("returns a Resend payload with an auto plain-text part", () => {
    const payload = buildEmail({
      from: "ENVRT <results@envrt.com>",
      to: "someone@example.com",
      subject: "Hi",
      html: renderEmail({ contentHtml: paragraph("Body text here") }),
    });
    expect(payload.text).toContain("Body text here");
    expect(payload.replyTo).toBe("info@envrt.com");
  });

  it("respects an explicit replyTo", () => {
    const payload = buildEmail({
      from: "ENVRT <info@envrt.com>",
      to: "x@example.com",
      subject: "Hi",
      html: "<p>hello</p>",
      replyTo: "results@envrt.com",
    });
    expect(payload.replyTo).toBe("results@envrt.com");
  });
});

describe("internalAlertHtml", () => {
  it("renders title, detail rows and CTA in the shell", () => {
    const html = internalAlertHtml({
      title: "New Contact Form Submission",
      rows: [["Email", "jane@acme.com"]],
      ctaHref: "https://dashboard.envrt.com/admin",
      ctaLabel: "Open dashboard",
    });
    expect(html).toContain("New Contact Form Submission");
    expect(html).toContain("jane@acme.com");
    expect(html).toContain("Open dashboard");
    expect(html).toContain(EMAIL_COLORS.vista);
  });
});

describe("internal recipients", () => {
  it("pins the internal alert routing", () => {
    expect(INTERNAL_ALERT_TO).toBe("info@envrt.com");
    expect(INTERNAL_ALERT_BCC).toEqual(["oliver@envrt.com", "charlie@envrt.com"]);
  });
});

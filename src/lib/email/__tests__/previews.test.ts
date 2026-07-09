// Tests for the email preview catalogue. Two jobs:
//   1. Every preview renders on the shared v3 shell (styleguide compliance).
//   2. Drift guard: any route that sends email must be registered in
//      REGISTERED_EMAIL_SOURCES so new emails always join the catalogue.

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { getSiteEmailPreviews, REGISTERED_EMAIL_SOURCES } from "../previews";
import { EMAIL_COLORS } from "../layout";

const LOGO_URL = "https://envrt.com/brand/envrt-logo.png";
const PROJECT_ROOT = join(__dirname, "..", "..", "..", "..");

describe("getSiteEmailPreviews", () => {
  const previews = getSiteEmailPreviews();

  it("covers every outbound email (13 sends today)", () => {
    expect(previews.length).toBeGreaterThanOrEqual(13);
  });

  it("uses unique keys", () => {
    const keys = previews.map((p) => p.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("renders every preview on the v3 shell", () => {
    for (const p of previews) {
      expect(p.html, `${p.key} missing vista background`).toContain(EMAIL_COLORS.vista);
      expect(p.html, `${p.key} missing wordmark`).toContain(LOGO_URL);
    }
  });

  it("labels every preview with audience, from and subject", () => {
    for (const p of previews) {
      expect(["customer", "internal"]).toContain(p.audience);
      expect(p.from, `${p.key} from`).toContain("@envrt.com");
      expect(p.subject.length, `${p.key} subject`).toBeGreaterThan(0);
      expect(p.name.length, `${p.key} name`).toBeGreaterThan(0);
    }
  });
});

describe("email source drift guard", () => {
  it("every file calling resend send is registered in the catalogue", () => {
    const files: string[] = [];
    (function walk(dir: string) {
      for (const entry of readdirSync(dir)) {
        if (entry === "node_modules" || entry === ".next" || entry === "__tests__") continue;
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) walk(full);
        else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) files.push(full);
      }
    })(join(PROJECT_ROOT, "src"));

    const senders: string[] = [];
    for (const file of files) {
      const content = readFileSync(file, "utf-8");
      if (/resend\.(emails|batch)\.send/.test(content)) {
        senders.push(relative(PROJECT_ROOT, file));
      }
    }

    for (const sender of senders) {
      expect(
        REGISTERED_EMAIL_SOURCES,
        `${sender} sends email but is not registered in src/lib/email/previews.ts, add its templates to the catalogue`,
      ).toContain(sender);
    }
  });
});

// __tests__/content/insights-pricing-drift.test.ts
//
// Guards published editorial content (content/**) against stale ENVRT
// entry-price claims. Insight articles quote our published entry tier in
// prose; when the canonical price changes those quotes drift silently and
// undercut the whole "published, honest pricing" positioning.
//
// Two checks:
//   1. RETIRED signatures (old prices, verbatim) must never reappear.
//   2. The current EUR entry figure, derived from the canonical plans source
//      of truth, must appear at least once, so the guard fails loudly if a
//      future price bump edits the plans file but forgets the articles.
//
// When you change the entry price: add the just-retired "€N per month" and its
// annual sticker to RETIRED below, and the new figures flow in automatically.
// The full procedure lives in envrt-dashboard/docs/pricing-change-runbook.md.

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { PLAN_PRICES } from "@/lib/plans.generated";

const CONTENT_DIR = join(process.cwd(), "content", "insights");

// Retired price signatures. Each is a substring that must not appear anywhere
// in published content. Add to this list whenever a price is superseded.
const RETIRED: string[] = [
  "£149 per month",
  "£1,790 per year",
  "£1,790 a year",
  "£149 entry",
  "from £149",
];

// Current EUR entry figures, derived from the canonical source. Content is
// EUR-anchored, so we assert the euro price, not the GBP one.
const ENTRY_EUR = Math.round(PLAN_PRICES.starter.monthly.eur / 100); // 249
const ENTRY_EUR_ANNUAL_STICKER = Math.round((ENTRY_EUR * 12) / 10) * 10; // 2990

function readAllContent(): { file: string; text: string }[] {
  return readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => ({ file: f, text: readFileSync(join(CONTENT_DIR, f), "utf8") }));
}

describe("insights pricing drift guard", () => {
  const docs = readAllContent();

  it("finds insight articles to scan", () => {
    expect(docs.length).toBeGreaterThan(0);
  });

  it("contains no retired ENVRT entry-price signatures", () => {
    const hits: string[] = [];
    for (const { file, text } of docs) {
      for (const sig of RETIRED) {
        if (text.includes(sig)) hits.push(`${file}: "${sig}"`);
      }
    }
    expect(hits, `Stale price mentions found:\n${hits.join("\n")}`).toEqual([]);
  });

  it("quotes the current EUR entry price at least once", () => {
    const label = `€${ENTRY_EUR} per month`;
    const present = docs.some((d) => d.text.includes(label));
    expect(present, `Expected at least one mention of "${label}"`).toBe(true);
  });

  it("annual sticker parenthetical matches the current entry price", () => {
    // Every article that states a per-year figure alongside the entry price
    // must use the current sticker (monthly x 12, rounded to nearest 10).
    const expected = `€${ENTRY_EUR_ANNUAL_STICKER.toLocaleString("en-US")} per year`;
    const offenders: string[] = [];
    for (const { file, text } of docs) {
      // Any "around €X,XXX per year" that sits next to our entry price line.
      const matches = text.match(/around €[\d,]+ per year/g) ?? [];
      for (const m of matches) {
        if (!m.includes(`€${ENTRY_EUR_ANNUAL_STICKER.toLocaleString("en-US")}`)) {
          offenders.push(`${file}: "${m}" (expected ${expected})`);
        }
      }
    }
    expect(offenders, `Stale annual figures:\n${offenders.join("\n")}`).toEqual([]);
  });
});

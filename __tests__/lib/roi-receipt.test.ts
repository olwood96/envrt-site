import { describe, it, expect } from "vitest";
import { formatReceiptDate, generateReference } from "@/lib/roi-receipt";

describe("formatReceiptDate", () => {
  it("formats a date as '28 May 2026' in en-GB", () => {
    expect(formatReceiptDate(new Date("2026-05-28T12:00:00Z"))).toBe("28 May 2026");
  });

  it("uses the UTC date so the output is timezone-stable", () => {
    // Midnight UTC on Jan 1 must still report "1 January 2026" everywhere.
    expect(formatReceiptDate(new Date("2026-01-01T00:00:00Z"))).toBe("1 January 2026");
  });
});

describe("generateReference", () => {
  const date = new Date("2026-05-28T12:00:00Z");

  it("returns ROI-{year}-{4 char hash}", () => {
    expect(generateReference(date, 100, 200, 300)).toMatch(/^ROI-2026-[A-Z0-9]{4}$/);
  });

  it("is deterministic for the same inputs", () => {
    expect(generateReference(date, 100, 200, 300)).toBe(
      generateReference(date, 100, 200, 300),
    );
  });

  it("differs when any input changes", () => {
    const base = generateReference(date, 100, 200, 300);
    expect(generateReference(date, 999, 200, 300)).not.toBe(base);
    expect(generateReference(date, 100, 999, 300)).not.toBe(base);
    expect(generateReference(date, 100, 200, 999)).not.toBe(base);
  });

  it("uses the UTC year so the reference is timezone-stable", () => {
    expect(generateReference(new Date("2026-01-01T00:00:00Z"), 1, 2, 3)).toMatch(/^ROI-2026-/);
  });
});

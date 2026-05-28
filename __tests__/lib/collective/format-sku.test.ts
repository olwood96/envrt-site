import { describe, it, expect } from "vitest";
import { formatSkuForDisplay } from "@/lib/collective/format-sku";

describe("formatSkuForDisplay", () => {
  it("returns empty string for empty input", () => {
    expect(formatSkuForDisplay("")).toBe("");
  });

  it("upper-cases lowercase input", () => {
    expect(formatSkuForDisplay("tee-001")).toBe("TEE-001");
  });

  it("preserves already-uppercase SKUs unchanged", () => {
    expect(formatSkuForDisplay("TS-OC-M-022")).toBe("TS-OC-M-022");
  });

  it("trims leading and trailing whitespace", () => {
    expect(formatSkuForDisplay("  abc-1  ")).toBe("ABC-1");
  });

  it("collapses internal whitespace to a single hyphen", () => {
    expect(formatSkuForDisplay("abc 001")).toBe("ABC-001");
    expect(formatSkuForDisplay("abc  001")).toBe("ABC-001");
  });

  it("handles mixed case with whitespace", () => {
    expect(formatSkuForDisplay("  Tee Oc M 022  ")).toBe("TEE-OC-M-022");
  });

  it("preserves SKUs up to 14 characters unchanged", () => {
    expect(formatSkuForDisplay("ABCDEFGHIJKLMN")).toBe("ABCDEFGHIJKLMN"); // 14 chars
    expect(formatSkuForDisplay("ABCDEFGHIJKLM")).toBe("ABCDEFGHIJKLM");   // 13 chars
  });

  it("cleanly cuts SKUs longer than 14 characters (no ellipsis)", () => {
    expect(formatSkuForDisplay("VADA-BOTTOMS-TERRY-CHARCOAL-L")).toBe("VADA-BOTTOMS-T");
  });

  it("truncates after normalising case and whitespace", () => {
    expect(formatSkuForDisplay("vada bottoms terry charcoal l")).toBe("VADA-BOTTOMS-T");
  });
});

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
});

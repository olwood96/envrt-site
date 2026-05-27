import { describe, it, expect } from "vitest";
import {
  bandFromOverall,
  decodeResultsFromUrl,
  encodeResultsToUrl,
  getBandCta,
  getBenchmarkContext,
  getGreenClaimsReading,
  getReadingForWeakestDimension,
} from "@/lib/assessment-helpers";

describe("bandFromOverall", () => {
  it("maps scores to the correct band", () => {
    expect(bandFromOverall(0)).toBe("critical");
    expect(bandFromOverall(25)).toBe("critical");
    expect(bandFromOverall(26)).toBe("early");
    expect(bandFromOverall(45)).toBe("early");
    expect(bandFromOverall(46)).toBe("developing");
    expect(bandFromOverall(65)).toBe("developing");
    expect(bandFromOverall(66)).toBe("compliance-ready");
    expect(bandFromOverall(80)).toBe("compliance-ready");
    expect(bandFromOverall(81)).toBe("advanced");
    expect(bandFromOverall(100)).toBe("advanced");
  });
});

describe("getReadingForWeakestDimension", () => {
  it("returns the weakest dimension and its reading list", () => {
    const result = getReadingForWeakestDimension({
      supplyChain: 80,
      productData: 40,
      regulatory: 70,
      infrastructure: 65,
    });
    expect(result.dimension).toBe("productData");
    expect(result.label).toBe("product data completeness");
    expect(result.links.length).toBeGreaterThan(0);
    expect(result.links[0].href).toMatch(/^\/insights\//);
  });

  it("returns supplyChain when it is the weakest", () => {
    const result = getReadingForWeakestDimension({
      supplyChain: 10,
      productData: 80,
      regulatory: 70,
      infrastructure: 65,
    });
    expect(result.dimension).toBe("supplyChain");
  });

  it("returns infrastructure when it is the weakest", () => {
    const result = getReadingForWeakestDimension({
      supplyChain: 80,
      productData: 80,
      regulatory: 70,
      infrastructure: 5,
    });
    expect(result.dimension).toBe("infrastructure");
  });
});

describe("getGreenClaimsReading", () => {
  it("returns at least one green claims article", () => {
    const links = getGreenClaimsReading();
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].href).toMatch(/greenwashing|green-claims/);
  });
});

describe("getBandCta", () => {
  it("returns a band-specific primary CTA for each band", () => {
    expect(getBandCta("critical").primaryLabel).toMatch(/urgent/i);
    expect(getBandCta("early").primaryLabel).toMatch(/start/i);
    expect(getBandCta("developing").primaryLabel).toMatch(/plan/i);
    expect(getBandCta("compliance-ready").primaryLabel).toMatch(/scal/i);
    expect(getBandCta("advanced").primaryLabel).toMatch(/collective/i);
  });

  it("returns valid hrefs for all bands", () => {
    const bands = [
      "critical",
      "early",
      "developing",
      "compliance-ready",
      "advanced",
    ] as const;
    bands.forEach((b) => {
      const cta = getBandCta(b);
      expect(cta.primaryHref).toMatch(/^\//);
      expect(cta.secondaryHref).toMatch(/^\//);
      expect(cta.framing.length).toBeGreaterThan(20);
    });
  });
});

describe("getBenchmarkContext", () => {
  it("returns text and caveat for every band", () => {
    const bands = [
      "critical",
      "early",
      "developing",
      "compliance-ready",
      "advanced",
    ] as const;
    bands.forEach((b) => {
      const ctx = getBenchmarkContext(b);
      expect(ctx.text.length).toBeGreaterThan(20);
      expect(ctx.caveat.length).toBeGreaterThan(20);
    });
  });
});

describe("URL encoding round-trip", () => {
  it("encodes and decodes results correctly", () => {
    const input = {
      overall: 72,
      supplyChain: 80,
      productData: 65,
      regulatory: 70,
      infrastructure: 73,
      greenClaimsFlag: true,
    };
    const encoded = encodeResultsToUrl(input);
    const decoded = decodeResultsFromUrl(encoded);
    expect(decoded).toEqual(input);
  });

  it("omits the green claims flag when false", () => {
    const input = {
      overall: 50,
      supplyChain: 50,
      productData: 50,
      regulatory: 50,
      infrastructure: 50,
      greenClaimsFlag: false,
    };
    const encoded = encodeResultsToUrl(input);
    expect(encoded).not.toContain("gc=");
    const decoded = decodeResultsFromUrl(encoded);
    expect(decoded?.greenClaimsFlag).toBe(false);
  });

  it("returns null for invalid URL params", () => {
    expect(decodeResultsFromUrl("")).toBeNull();
    expect(decodeResultsFromUrl("?o=abc")).toBeNull();
    expect(decodeResultsFromUrl("?o=72")).toBeNull();
  });

  it("returns null for out-of-range scores", () => {
    expect(decodeResultsFromUrl("?o=150&sc=50&pd=50&ra=50&in=50")).toBeNull();
    expect(decodeResultsFromUrl("?o=50&sc=-10&pd=50&ra=50&in=50")).toBeNull();
  });

  it("handles a leading question mark", () => {
    const input = {
      overall: 42,
      supplyChain: 30,
      productData: 50,
      regulatory: 40,
      infrastructure: 45,
      greenClaimsFlag: false,
    };
    const encoded = "?" + encodeResultsToUrl(input);
    const decoded = decodeResultsFromUrl(encoded);
    expect(decoded).toEqual(input);
  });
});

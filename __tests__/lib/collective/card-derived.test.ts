import { describe, it, expect } from "vitest";
import {
  deriveOrigin,
  derivePrimaryMaterial,
  deriveYear,
} from "@/lib/collective/card-derived";
import type { CollectiveDpp } from "@/lib/collective/types";

function makeDpp(overrides: Partial<CollectiveDpp> = {}): CollectiveDpp {
  return {
    id: "dpp-x",
    brand_id: "brand-x",
    collection_name: "Test Collection",
    product_sku: "test-001",
    garment_name: "Test Garment",
    garment_mass_g: 200,
    garment_type: null,
    transparency_score: null,
    total_emissions: null,
    total_water: null,
    total_emissions_reduction_pct: null,
    total_water_reduction_pct: null,
    constituents: [],
    image_path: null,
    featured_at: null,
    purchase_url: null,
    production_stages: null,
    ...overrides,
  };
}

describe("deriveOrigin", () => {
  it("returns null when production_stages is null", () => {
    expect(deriveOrigin(makeDpp())).toBeNull();
  });

  it("returns null when no stage has a country", () => {
    const dpp = makeDpp({
      production_stages: [
        { key: "fibre", label: "Fibre", country: null, regional: null, verification: null },
        { key: "yarn", label: "Yarn", country: null, regional: null, verification: null },
      ],
    });
    expect(deriveOrigin(dpp)).toBeNull();
  });

  it("prefers the assembly stage country when present", () => {
    const dpp = makeDpp({
      production_stages: [
        { key: "fibre", label: "Fibre", country: "Turkey", regional: null, verification: null },
        { key: "assembly", label: "Assembly", country: "Portugal", regional: null, verification: null },
      ],
    });
    expect(deriveOrigin(dpp)).toBe("Made in Portugal");
  });

  it("falls back to the first stage with a country when assembly has none", () => {
    const dpp = makeDpp({
      production_stages: [
        { key: "fibre", label: "Fibre", country: "Turkey", regional: null, verification: null },
        { key: "yarn", label: "Yarn", country: null, regional: null, verification: null },
        { key: "assembly", label: "Assembly", country: null, regional: null, verification: null },
      ],
    });
    expect(deriveOrigin(dpp)).toBe("Made in Turkey");
  });

  it("title-cases lowercase country names", () => {
    const dpp = makeDpp({
      production_stages: [
        { key: "assembly", label: "Assembly", country: "china", regional: null, verification: null },
      ],
    });
    expect(deriveOrigin(dpp)).toBe("Made in China");
  });

  it("title-cases multi-word country names", () => {
    const dpp = makeDpp({
      production_stages: [
        { key: "assembly", label: "Assembly", country: "united kingdom", regional: null, verification: null },
      ],
    });
    expect(deriveOrigin(dpp)).toBe("Made in United Kingdom");
  });

  it("title-cases hyphenated country names", () => {
    const dpp = makeDpp({
      production_stages: [
        { key: "assembly", label: "Assembly", country: "guinea-bissau", regional: null, verification: null },
      ],
    });
    expect(deriveOrigin(dpp)).toBe("Made in Guinea-Bissau");
  });

  it("leaves correctly-cased country names unchanged", () => {
    const dpp = makeDpp({
      production_stages: [
        { key: "assembly", label: "Assembly", country: "Portugal", regional: null, verification: null },
      ],
    });
    expect(deriveOrigin(dpp)).toBe("Made in Portugal");
  });
});

describe("derivePrimaryMaterial", () => {
  it("returns a placeholder when constituents is empty", () => {
    expect(derivePrimaryMaterial(makeDpp())).toBe("Composition pending");
  });

  it("returns the single material at 100% when only one constituent", () => {
    const dpp = makeDpp({ constituents: [{ material: "Cotton", pct: 100 }] });
    expect(derivePrimaryMaterial(dpp)).toBe("100% Cotton");
  });

  it("returns the dominant material when one is above 95%", () => {
    const dpp = makeDpp({
      constituents: [
        { material: "Cotton", pct: 96 },
        { material: "Elastane", pct: 4 },
      ],
    });
    expect(derivePrimaryMaterial(dpp)).toBe("96% Cotton");
  });

  it("returns the top two materials joined when the split is more even", () => {
    const dpp = makeDpp({
      constituents: [
        { material: "Cotton", pct: 60 },
        { material: "Polyester", pct: 40 },
      ],
    });
    expect(derivePrimaryMaterial(dpp)).toBe("60% Cotton · 40% Polyester");
  });

  it("sorts by percentage descending before picking the top two", () => {
    const dpp = makeDpp({
      constituents: [
        { material: "Linen", pct: 30 },
        { material: "Cotton", pct: 50 },
        { material: "Silk", pct: 20 },
      ],
    });
    expect(derivePrimaryMaterial(dpp)).toBe("50% Cotton · 30% Linen");
  });
});

describe("deriveYear", () => {
  it("returns null when featured_at is null", () => {
    expect(deriveYear(makeDpp())).toBeNull();
  });

  it("returns the year for a valid ISO timestamp", () => {
    expect(deriveYear(makeDpp({ featured_at: "2026-05-27T12:00:00Z" }))).toBe(2026);
  });

  it("returns null when featured_at is an invalid string", () => {
    expect(deriveYear(makeDpp({ featured_at: "not-a-date" }))).toBeNull();
  });

  it("returns the UTC year for timestamps near year boundaries", () => {
    // Midnight UTC on Jan 1 must report 2025, not 2024, regardless of the
    // viewer's local timezone.
    expect(deriveYear(makeDpp({ featured_at: "2025-01-01T00:00:00Z" }))).toBe(2025);
  });
});

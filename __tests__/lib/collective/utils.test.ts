import { describe, it, expect } from "vitest";
import { deduplicateConstituents } from "@/lib/collective/utils";

describe("deduplicateConstituents", () => {
  it("returns empty array for empty input", () => {
    expect(deduplicateConstituents([])).toEqual([]);
  });

  it("passes through unique materials unchanged", () => {
    const input = [
      { material: "Cotton", pct: 60 },
      { material: "Polyester", pct: 40 },
    ];
    expect(deduplicateConstituents(input)).toEqual([
      { material: "Cotton", pct: 60 },
      { material: "Polyester", pct: 40 },
    ]);
  });

  it("merges duplicate materials and sums percentages", () => {
    const input = [
      { material: "Elastane", pct: 11 },
      { material: "ECONYL", pct: 39 },
      { material: "Elastane", pct: 7.5 },
    ];
    const result = deduplicateConstituents(input);
    expect(result).toEqual([
      { material: "ECONYL", pct: 39 },
      { material: "Elastane", pct: 18.5 },
    ]);
  });

  it("sorts result by percentage descending", () => {
    const input = [
      { material: "Silk", pct: 10 },
      { material: "Cotton", pct: 50 },
      { material: "Linen", pct: 40 },
    ];
    const result = deduplicateConstituents(input);
    expect(result.map((c) => c.material)).toEqual(["Cotton", "Linen", "Silk"]);
  });

  it("handles single material", () => {
    expect(deduplicateConstituents([{ material: "Cotton", pct: 100 }])).toEqual(
      [{ material: "Cotton", pct: 100 }]
    );
  });

  it("merges three instances of the same material", () => {
    const input = [
      { material: "Nylon", pct: 20 },
      { material: "Nylon", pct: 15 },
      { material: "Nylon", pct: 10 },
      { material: "Cotton", pct: 55 },
    ];
    const result = deduplicateConstituents(input);
    expect(result).toEqual([
      { material: "Cotton", pct: 55 },
      { material: "Nylon", pct: 45 },
    ]);
  });
});

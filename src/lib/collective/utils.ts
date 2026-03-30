import type { CollectiveConstituent } from "./types";

/**
 * Merge constituents that share the same material name,
 * summing their percentages. Returns sorted by pct descending.
 */
export function deduplicateConstituents(
  constituents: CollectiveConstituent[],
): CollectiveConstituent[] {
  const merged = new Map<string, number>();
  for (const c of constituents) {
    merged.set(c.material, (merged.get(c.material) ?? 0) + c.pct);
  }
  return Array.from(merged, ([material, pct]) => ({ material, pct })).sort(
    (a, b) => b.pct - a.pct,
  );
}

import type { CollectiveConstituent, CollectiveDpp } from "./types";

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

/**
 * Whether the DPP's snapshot permits showing reduction-vs-average figures.
 * Mirrors the live DPP renderer (envrt-dashboard DppPage): only "total+reduction"
 * and "full" granularities expose reduction percentages. Missing display_options
 * defaults to "total" so we err on the side of hiding.
 */
export function showReductionFor(
  dpp: Pick<CollectiveDpp, "display_options">,
): boolean {
  const granularity = dpp.display_options?.granularity ?? "total";
  return granularity === "total+reduction" || granularity === "full";
}

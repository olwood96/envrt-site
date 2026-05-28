import type { CollectiveDpp } from "./types";
import { deduplicateConstituents } from "./utils";

/**
 * Capitalises the first letter of each word in a country name without
 * disturbing letters that are already correctly cased.
 *
 * Handles: "china" → "China", "united kingdom" → "United Kingdom",
 * "guinea-bissau" → "Guinea-Bissau", "USA" → "USA" (left alone).
 */
function capitaliseCountry(country: string): string {
  return country.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Returns a "Made in {country}" string for the composition tag.
 * Prefers the assembly stage country since that is where the final
 * garment was made. Falls back to the earliest stage with a country
 * if assembly has none, or null when no stage has a country.
 *
 * Country names are title-cased so eg "china" reads as "China".
 */
export function deriveOrigin(dpp: CollectiveDpp): string | null {
  const stages = dpp.production_stages;
  if (!stages || stages.length === 0) return null;

  const assembly = stages.find((s) => s.key === "assembly" && s.country);
  if (assembly?.country) return `Made in ${capitaliseCountry(assembly.country)}`;

  const firstWithCountry = stages.find((s) => s.country);
  if (!firstWithCountry?.country) return null;
  return `Made in ${capitaliseCountry(firstWithCountry.country)}`;
}

/**
 * Returns a short material composition string for the tag's first line.
 * One material → "100% Cotton". Dominant material (≥95%) → "96% Cotton".
 * Otherwise the top two materials → "60% Cotton · 40% Polyester".
 *
 * Reads directly from {@link CollectiveDpp.constituents} (the DPP source
 * of truth) and merges duplicate material rows via deduplicateConstituents.
 * Without dedup, a DPP with two ECONYL entries would render as
 * "42.5% ECONYL · 39% ECONYL" rather than the combined "81.5% ECONYL".
 */
export function derivePrimaryMaterial(dpp: CollectiveDpp): string {
  const constituents = dpp.constituents;
  if (!constituents || constituents.length === 0) return "Composition pending";

  const merged = deduplicateConstituents(constituents);
  if (merged.length === 0) return "Composition pending";

  const top = merged[0];
  if (merged.length === 1 || top.pct >= 95) {
    return `${top.pct}% ${top.material}`;
  }
  return merged.slice(0, 2).map((c) => `${c.pct}% ${c.material}`).join(" · ");
}

/**
 * Returns the year a DPP was featured on the collective, or null if
 * the timestamp is missing or invalid.
 */
export function deriveYear(dpp: CollectiveDpp): number | null {
  if (!dpp.featured_at) return null;
  const date = new Date(dpp.featured_at);
  if (Number.isNaN(date.getTime())) return null;
  // Use UTC year so the displayed value matches the stored ISO timestamp
  // regardless of the viewer's local timezone.
  return date.getUTCFullYear();
}

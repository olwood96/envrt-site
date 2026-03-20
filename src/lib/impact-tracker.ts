import { getSupabaseAdmin } from "./supabase-admin";

/**
 * Estimated average units produced per garment design.
 * Applied to per-garment LCA values to approximate total production impact.
 */
export const ESTIMATED_UNITS_MULTIPLIER = 500;

export interface CountryScanData {
  countryCode: string;
  count: number;
}

export interface ImpactData {
  totalCo2Kg: number;
  totalWaterL: number;
  totalScans: number;
  scansByCountry: CountryScanData[];
}

/**
 * Fallback demo data shown when Supabase is unavailable or has no data yet.
 * Replace with real minimums once brands are onboarded.
 */
const FALLBACK: ImpactData = {
  totalCo2Kg: 42_500,
  totalWaterL: 6_225_000,
  totalScans: 1_247,
  scansByCountry: [
    { countryCode: "GB", count: 420 },
    { countryCode: "DE", count: 185 },
    { countryCode: "US", count: 160 },
    { countryCode: "FR", count: 112 },
    { countryCode: "NL", count: 88 },
    { countryCode: "ES", count: 64 },
    { countryCode: "IT", count: 52 },
    { countryCode: "SE", count: 41 },
    { countryCode: "AU", count: 38 },
    { countryCode: "PT", count: 29 },
    { countryCode: "JP", count: 22 },
    { countryCode: "IN", count: 18 },
    { countryCode: "BR", count: 12 },
    { countryCode: "KR", count: 6 },
  ],
};

export async function getImpactData(): Promise<ImpactData> {
  try {
    const supabase = getSupabaseAdmin();

    // Fetch emissions and water from all active DPPs
    const { data: dpps, error: dppError } = await supabase
      .from("dpp_generated")
      .select("total_emissions, total_water")
      .is("deleted_at", null);

    if (dppError) {
      console.error("[impact-tracker] dpp_generated query failed:", dppError.message);
      return FALLBACK;
    }

    // Sum per-garment values and apply multiplier
    let rawCo2 = 0;
    let rawWater = 0;
    for (const row of dpps ?? []) {
      rawCo2 += row.total_emissions ?? 0;
      rawWater += row.total_water ?? 0;
    }

    const totalCo2Kg = Math.round(rawCo2 * ESTIMATED_UNITS_MULTIPLIER);
    const totalWaterL = Math.round(rawWater * ESTIMATED_UNITS_MULTIPLIER);

    // Count total DPP scans
    const { count, error: countError } = await supabase
      .from("dpp_views")
      .select("id", { count: "exact", head: true });

    if (countError) {
      console.error("[impact-tracker] dpp_views count failed:", countError.message);
      return FALLBACK;
    }

    const totalScans = count ?? 0;

    // Aggregate scans by country for the map
    const { data: views, error: viewsError } = await supabase
      .from("dpp_views")
      .select("country");

    if (viewsError) {
      console.error("[impact-tracker] dpp_views country query failed:", viewsError.message);
      return { totalCo2Kg, totalWaterL, totalScans, scansByCountry: [] };
    }

    const countryMap = new Map<string, number>();
    for (const row of views ?? []) {
      const code = row.country;
      if (!code) continue;
      countryMap.set(code, (countryMap.get(code) ?? 0) + 1);
    }

    const scansByCountry: CountryScanData[] = Array.from(countryMap.entries())
      .map(([countryCode, count]) => ({ countryCode, count }))
      .sort((a, b) => b.count - a.count);

    return { totalCo2Kg, totalWaterL, totalScans, scansByCountry };
  } catch (err) {
    console.error("[impact-tracker] unexpected error:", err);
    return FALLBACK;
  }
}

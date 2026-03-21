import { getSupabaseAdmin } from "./supabase-admin";

export interface ImpactStats {
  co2Kg: number;
  waterLitres: number;
  dppScans: number;
  /** DPP ID → emissions/water values for realtime increments */
  dppLookup: Record<string, { co2: number; water: number }>;
}

const EMPTY: ImpactStats = {
  co2Kg: 0,
  waterLitres: 0,
  dppScans: 0,
  dppLookup: {},
};

export async function fetchImpactStats(): Promise<ImpactStats> {
  try {
    const supabase = getSupabaseAdmin();

    // 1. Get all DPPs with their emissions/water
    const { data: dpps, error: dppsError } = await supabase
      .from("dpp_generated")
      .select("id, total_emissions, total_water")
      .is("deleted_at", null);

    if (dppsError || !dpps?.length) return EMPTY;

    // Build lookup: DPP ID → { co2, water }
    const dppLookup: Record<string, { co2: number; water: number }> = {};
    for (const dpp of dpps) {
      dppLookup[dpp.id] = {
        co2: dpp.total_emissions ?? 0,
        water: dpp.total_water ?? 0,
      };
    }

    // 2. Get all views with their linked DPP ID
    const { data: views, error: viewsError } = await supabase
      .from("dpp_views")
      .select("dpp_generated_id");

    if (viewsError) return EMPTY;

    const dppScans = views?.length ?? 0;

    // 3. Sum emissions/water across all scans
    let co2Kg = 0;
    let waterLitres = 0;
    for (const view of views ?? []) {
      const dpp = dppLookup[view.dpp_generated_id];
      if (dpp) {
        co2Kg += dpp.co2;
        waterLitres += dpp.water;
      }
    }

    return {
      co2Kg: Math.round(co2Kg),
      waterLitres: Math.round(waterLitres),
      dppScans,
      dppLookup,
    };
  } catch (err) {
    console.error("[impact-stats] unexpected error:", err);
    return EMPTY;
  }
}

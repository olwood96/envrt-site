import { getSupabaseAdmin } from "./supabase-admin";

export interface ImpactStats {
  co2Kg: number;
  waterLitres: number;
  dppScans: number;
}

const EMPTY: ImpactStats = {
  co2Kg: 0,
  waterLitres: 0,
  dppScans: 0,
};

export async function fetchImpactStats(): Promise<ImpactStats> {
  try {
    const supabase = getSupabaseAdmin();

    // 1. Sum emissions/water across ALL DPPs created on the platform
    const { data: dpps, error: dppsError } = await supabase
      .from("dpp_generated")
      .select("total_emissions, total_water")
      .is("deleted_at", null);

    if (dppsError || !dpps?.length) return EMPTY;

    let co2Kg = 0;
    let waterLitres = 0;
    for (const dpp of dpps) {
      co2Kg += dpp.total_emissions ?? 0;
      waterLitres += dpp.total_water ?? 0;
    }

    // 2. Count all DPP views (QR scans + embed views)
    const { count: dppScans } = await supabase
      .from("dpp_views")
      .select("id", { count: "exact", head: true });

    return {
      co2Kg: Math.round(co2Kg),
      waterLitres: Math.round(waterLitres),
      dppScans: dppScans ?? 0,
    };
  } catch (err) {
    console.error("[impact-stats] unexpected error:", err);
    return EMPTY;
  }
}

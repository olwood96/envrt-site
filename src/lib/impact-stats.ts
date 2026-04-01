import { getSupabaseAdmin } from "./supabase-admin";

export interface ImpactStats {
  co2Kg: number;
  waterLitres: number;
  dppScans: number;
}

interface ImpactStatsRow {
  total_scans: number;
  total_co2: number;
  total_water: number;
}

const EMPTY: ImpactStats = {
  co2Kg: 0,
  waterLitres: 0,
  dppScans: 0,
};

export async function fetchImpactStats(): Promise<ImpactStats> {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.rpc("get_impact_stats").single<ImpactStatsRow>();

    if (error || !data) return EMPTY;

    return {
      co2Kg: Math.round(data.total_co2 ?? 0),
      waterLitres: Math.round(data.total_water ?? 0),
      dppScans: Number(data.total_scans ?? 0),
    };
  } catch (err) {
    console.error("[impact-stats] unexpected error:", err);
    return EMPTY;
  }
}

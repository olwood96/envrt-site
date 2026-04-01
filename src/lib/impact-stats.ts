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

const PAGE_SIZE = 1000;

export async function fetchImpactStats(): Promise<ImpactStats> {
  try {
    const supabase = getSupabaseAdmin();

    // 1. Total scan count — exact count via header, no row limit
    const { count: dppScans } = await supabase
      .from("dpp_views")
      .select("id", { count: "exact", head: true });

    // 2. All non-deleted DPPs with their impact metrics
    const { data: dpps, error: dppsError } = await supabase
      .from("dpp_generated")
      .select("id, total_emissions, total_water")
      .is("deleted_at", null);

    if (dppsError || !dpps?.length) {
      return { co2Kg: 0, waterLitres: 0, dppScans: dppScans ?? 0 };
    }

    const dppLookup: Record<string, { co2: number; water: number }> = {};
    for (const dpp of dpps) {
      dppLookup[dpp.id] = {
        co2: dpp.total_emissions ?? 0,
        water: dpp.total_water ?? 0,
      };
    }

    // 3. Paginate through ALL views to sum metrics (bypasses 1000-row cap)
    let co2Kg = 0;
    let waterLitres = 0;
    let offset = 0;

    while (true) {
      const { data: page, error: pageError } = await supabase
        .from("dpp_views")
        .select("dpp_generated_id")
        .range(offset, offset + PAGE_SIZE - 1);

      if (pageError || !page || page.length === 0) break;

      for (const view of page) {
        const dpp = dppLookup[view.dpp_generated_id];
        if (dpp) {
          co2Kg += dpp.co2;
          waterLitres += dpp.water;
        }
      }

      if (page.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }

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

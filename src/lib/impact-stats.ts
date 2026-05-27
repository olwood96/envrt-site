/**
 * Each garment LCA in the envrt_lab pipeline references the full database
 * of 68,431 reference cells (materials, processes, dyeing, energy grids,
 * transport, AWARE country + subnational water scarcity, trims, etc.).
 *
 * Every DPP view delivers that same depth of analysis to a consumer, so
 * cumulative data points served = dppScans × REFERENCES_PER_LCA.
 */
export const REFERENCES_PER_LCA = 68431;

export interface ImpactStats {
  co2Kg: number;
  waterLitres: number;
  dppScans: number;
  /** dppScans × REFERENCES_PER_LCA. Live cumulative count of reference data points served via DPPs. */
  dataPointsServed: number;
}

export interface PlatformStats extends ImpactStats {
  totalDurationSeconds: number;
  countryCount: number;
  byCountry: { country: string; views: number; durationSeconds: number }[];
}

const EMPTY: PlatformStats = {
  co2Kg: 0,
  waterLitres: 0,
  dppScans: 0,
  dataPointsServed: 0,
  totalDurationSeconds: 0,
  countryCount: 0,
  byCountry: [],
};

const API_URL = "https://dashboard.envrt.com/api/public/platform-stats";

export async function fetchPlatformStats(): Promise<PlatformStats> {
  try {
    const res = await fetch(API_URL, { next: { revalidate: 30 } });
    if (!res.ok) return EMPTY;
    const data = await res.json();

    const dppScans = data.totalScans ?? 0;

    return {
      co2Kg: data.co2Kg ?? 0,
      waterLitres: data.waterLitres ?? 0,
      dppScans,
      dataPointsServed: dppScans * REFERENCES_PER_LCA,
      totalDurationSeconds: data.totalDurationSeconds ?? 0,
      countryCount: data.countryCount ?? 0,
      byCountry: data.byCountry ?? [],
    };
  } catch {
    return EMPTY;
  }
}

/** @deprecated Use fetchPlatformStats instead */
export async function fetchImpactStats(): Promise<ImpactStats> {
  const stats = await fetchPlatformStats();
  return {
    co2Kg: stats.co2Kg,
    waterLitres: stats.waterLitres,
    dppScans: stats.dppScans,
    dataPointsServed: stats.dataPointsServed,
  };
}

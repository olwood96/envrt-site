export interface ImpactStats {
  co2Kg: number;
  waterLitres: number;
  dppScans: number;
}

export interface PlatformStats extends ImpactStats {
  totalDurationSeconds: number;
  countryCount: number;
  byCountry: { country: string; views: number }[];
}

const EMPTY: PlatformStats = {
  co2Kg: 0,
  waterLitres: 0,
  dppScans: 0,
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

    return {
      co2Kg: data.co2Kg ?? 0,
      waterLitres: data.waterLitres ?? 0,
      dppScans: data.totalScans ?? 0,
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
  };
}

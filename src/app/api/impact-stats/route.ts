import { NextResponse } from "next/server";
import { fetchPlatformStats } from "@/lib/impact-stats";

export const dynamic = "force-static";
export const revalidate = 30;

export async function GET() {
  const stats = await fetchPlatformStats();
  // Return the full stats shape - ImpactStatsSection only uses co2Kg, waterLitres, dppScans
  // but other components can use totalDurationSeconds, countryCount, byCountry
  return NextResponse.json(stats);
}

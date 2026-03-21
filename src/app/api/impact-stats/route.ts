import { NextResponse } from "next/server";
import { fetchImpactStats } from "@/lib/impact-stats";

export const dynamic = "force-static";
export const revalidate = 30;

export async function GET() {
  const stats = await fetchImpactStats();
  return NextResponse.json(stats);
}

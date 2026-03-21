import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const { dppId } = await request.json();

    if (!dppId || typeof dppId !== "string") {
      return NextResponse.json({ error: "Missing dppId" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    await supabase.from("dpp_views").insert({ dpp_generated_id: dppId });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

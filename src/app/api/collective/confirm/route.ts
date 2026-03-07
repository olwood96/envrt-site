import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/collective?subscribe_error=missing_token", request.url));
  }

  const supabaseAdmin = getSupabaseAdmin();

  const { data: subscriber } = await supabaseAdmin
    .from("collective_subscribers")
    .select("id, confirmed_at")
    .eq("token", token)
    .is("unsubscribed_at", null)
    .maybeSingle();

  if (!subscriber) {
    return NextResponse.redirect(new URL("/collective?subscribe_error=invalid_token", request.url));
  }

  // Already confirmed — idempotent
  if (!subscriber.confirmed_at) {
    await supabaseAdmin
      .from("collective_subscribers")
      .update({ confirmed_at: new Date().toISOString() })
      .eq("id", subscriber.id);
  }

  return NextResponse.redirect(new URL("/collective?subscribed=true", request.url));
}

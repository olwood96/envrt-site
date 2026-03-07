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
    .select("id")
    .eq("token", token)
    .is("unsubscribed_at", null)
    .maybeSingle();

  if (!subscriber) {
    return NextResponse.redirect(new URL("/collective?subscribe_error=invalid_token", request.url));
  }

  await supabaseAdmin
    .from("collective_subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("id", subscriber.id);

  return NextResponse.redirect(new URL("/collective?unsubscribed=true", request.url));
}

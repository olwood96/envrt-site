import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  isValidEmail,
  rateLimit,
  getClientIp,
  verifyTurnstile,
} from "@/lib/form-security";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface FreeDppPayload {
  garment_name: string;
  garment_type: string;
  materials: { name: string; share: number }[];
  weight_g: number;
  country_assembly: string;
  fabric_process: string;
  number_of_references: number | null;
  price_eur: number | null;
  business_type: string | null;
  dead_stock_pct: number | null;
  making_waste_pct: number | null;
  contact_name: string;
  brand_name: string;
  contact_email: string;
  product_url: string | null;
  turnstile_token: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: FreeDppPayload = await req.json();

    // Validate required fields (only garment type, materials, weight and contact)
    if (
      !body.garment_type ||
      !body.materials?.length ||
      !body.weight_g ||
      !body.contact_name ||
      !body.brand_name ||
      !body.contact_email
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email
    if (!isValidEmail(body.contact_email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate weight
    if (body.weight_g < 10 || body.weight_g > 5000) {
      return NextResponse.json(
        { error: "Weight must be between 10g and 5000g" },
        { status: 400 }
      );
    }

    // Rate limiting
    const ip = getClientIp(req.headers);
    const key = `free-dpp:${ip}`;
    if (!rateLimit(key, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Also rate limit by email
    const emailKey = `free-dpp:${body.contact_email.toLowerCase()}`;
    if (!rateLimit(emailKey, 3, RATE_LIMIT_WINDOW_MS)) {
      return NextResponse.json(
        { error: "Too many requests for this email. Please try again later." },
        { status: 429 }
      );
    }

    // Verify Turnstile token
    if (body.turnstile_token) {
      const valid = await verifyTurnstile(body.turnstile_token);
      if (!valid) {
        return NextResponse.json(
          { error: "Verification failed. Please refresh and try again." },
          { status: 403 }
        );
      }
    }

    // Validate materials sum to ~100%
    const totalShare = body.materials.reduce((sum, m) => sum + m.share, 0);
    if (totalShare < 95 || totalShare > 105) {
      return NextResponse.json(
        { error: "Material percentages must add up to 100%" },
        { status: 400 }
      );
    }

    // Insert into trial_dpp_requests
    const supabase = getSupabaseAdmin();
    const { error: insertError } = await supabase
      .from("trial_dpp_requests")
      .insert({
        contact_name: body.contact_name.trim(),
        brand_name: body.brand_name.trim(),
        contact_email: body.contact_email.trim().toLowerCase(),
        product_url: body.product_url?.trim() || null,
        garment_name: body.garment_name?.trim() || null,
        garment_type: body.garment_type,
        materials: body.materials,
        weight_g: body.weight_g,
        country_assembly: body.country_assembly || "Unknown",
        fabric_process: body.fabric_process || "unknown",
        number_of_references: body.number_of_references,
        price_eur: body.price_eur,
        business_type: body.business_type,
        dead_stock_pct: body.dead_stock_pct,
        making_waste_pct: body.making_waste_pct,
        source: "site_form",
        status: "pending",
      });

    if (insertError) {
      console.error("Failed to insert trial request:", insertError);
      return NextResponse.json(
        { error: "Failed to submit request. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Free DPP API error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

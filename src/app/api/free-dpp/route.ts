import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  escapeHtml,
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

    // Check for duplicate submission (same email with pending/processing request)
    const supabase = getSupabaseAdmin();
    const { data: existing } = await supabase
      .from("trial_dpp_requests")
      .select("id")
      .eq("contact_email", body.contact_email.trim().toLowerCase())
      .in("status", ["pending", "processing"])
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "You already have a request being processed. We will be in touch soon." },
        { status: 409 }
      );
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
        country_assembly: body.country_assembly || null,
        fabric_process: body.fabric_process || null,
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

    // Send internal notification email (non-blocking)
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const resend = new Resend(resendKey);
        const materialsSummary = body.materials
          .map((m) => `${escapeHtml(m.name)} (${m.share}%)`)
          .join(", ");

        await resend.emails.send({
          from: "ENVRT System <noreply@envrt.com>",
          to: ["oliver@envrt.com", "charlie@envrt.com"],
          subject: `New trial DPP request: ${body.brand_name}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px 16px;">
              <p style="font-size: 14px; color: #374151;"><strong>${escapeHtml(body.contact_name)}</strong> from <strong>${escapeHtml(body.brand_name)}</strong> has submitted a free DPP request.</p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
                <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0;">${escapeHtml(body.contact_email)}</td></tr>
                ${body.garment_name ? `<tr><td style="padding: 6px 0; color: #6b7280;">Product</td><td style="padding: 6px 0;">${escapeHtml(body.garment_name)}</td></tr>` : ""}
                <tr><td style="padding: 6px 0; color: #6b7280;">Type</td><td style="padding: 6px 0;">${escapeHtml(body.garment_type)}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">Materials</td><td style="padding: 6px 0;">${materialsSummary}</td></tr>
                <tr><td style="padding: 6px 0; color: #6b7280;">Weight</td><td style="padding: 6px 0;">${body.weight_g}g</td></tr>
                ${body.country_assembly ? `<tr><td style="padding: 6px 0; color: #6b7280;">Assembly</td><td style="padding: 6px 0;">${escapeHtml(body.country_assembly)}</td></tr>` : ""}
                ${body.product_url ? `<tr><td style="padding: 6px 0; color: #6b7280;">URL</td><td style="padding: 6px 0;"><a href="${escapeHtml(body.product_url)}" style="color: #0d9488;">${escapeHtml(body.product_url.slice(0, 60))}</a></td></tr>` : ""}
              </table>
              <p style="font-size: 13px; color: #9ca3af;">Process this in the <a href="https://dashboard.envrt.com/admin/trial-requests" style="color: #0d9488;">dashboard</a>.</p>
            </div>
          `,
        });
      }
    } catch (e) {
      console.error("Failed to send internal notification (non-fatal):", e);
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

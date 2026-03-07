import { NextRequest, NextResponse } from "next/server";
import { getFeaturedDpp } from "@/lib/collective/fetch";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const brandSlug = searchParams.get("brand");
  const productSku = searchParams.get("sku");

  if (!brandSlug || !productSku) {
    return NextResponse.json(
      { error: "Missing brand or sku parameter" },
      { status: 400 }
    );
  }

  const card = await getFeaturedDpp(brandSlug, productSku);

  if (!card) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const { dpp, brand, productImageUrl, brandLogoUrl } = card;

  const response = NextResponse.json({
    product: {
      name: dpp.garment_name,
      sku: dpp.product_sku,
      collection: dpp.collection_name,
      garmentType: dpp.garment_type,
      imageUrl: productImageUrl,
    },
    brand: {
      name: brand.name,
      logoUrl: brandLogoUrl,
      verified: !!brand.verified_at,
    },
    metrics: {
      totalEmissions: dpp.total_emissions,
      totalWater: dpp.total_water,
      traceabilityScore: dpp.traceability_score,
      emissionsReductionPct: dpp.total_emissions_reduction_pct,
      waterReductionPct: dpp.total_water_reduction_pct,
    },
    materials: dpp.constituents,
    links: {
      detail: `https://envrt.com/collective/${brandSlug}/${productSku}`,
      widget: `https://envrt.com/collective/${brandSlug}/${productSku}/widget`,
    },
  });

  // Allow cross-origin embedding
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET");

  return response;
}

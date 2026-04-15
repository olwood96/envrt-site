import { supabase } from "@/lib/supabase";
import type {
  CollectiveDpp,
  CollectiveBrand,
  CollectiveCardData,
  CollectivePageData,
  CollectiveFilters,
  CollectiveProductionStage,
  CollectiveVerification,
  CollectiveEcoscore,
  BrandEngagement,
} from "./types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const STAGE_CONFIG = [
  { key: "fibre", label: "Fibre Production" },
  { key: "yarn", label: "Yarn Production" },
  { key: "fabric", label: "Fabric Production" },
  { key: "dyeing", label: "Bleaching & Dyeing" },
  { key: "assembly", label: "Assembly" },
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function storageUrl(bucket: string, path: string | null): string | null {
  if (!path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

const DPP_LIST_FIELDS =
  "id, brand_id, collection_name, product_sku, garment_name, garment_mass_g, garment_type, transparency_score, total_emissions, total_water, total_emissions_reduction_pct, total_water_reduction_pct, constituents, image_path, featured_at, purchase_url, version";

const DPP_DETAIL_FIELDS =
  "id, brand_id, collection_name, product_sku, garment_name, garment_mass_g, garment_type, transparency_score, total_emissions, total_water, total_emissions_reduction_pct, total_water_reduction_pct, constituents, image_path, featured_at, purchase_url";

const BRAND_FIELDS = "id, name, slug, logo_path, website_url, description, verified_at, tier";

function parseConstituents(raw: unknown): { material: string; pct: number }[] {
  const arr = raw as { material: string; pct: number }[];
  return arr?.map((c) => ({ material: c.material, pct: c.pct })) ?? [];
}

/** Verification priority: higher index wins */
const VERIFICATION_RANK: Record<string, number> = {
  declared: 0,
  modelled: 1,
  validated: 2,
  verified: 3,
};

/** Extract production stages from ALL constituents' raw JSONB */
function extractProductionStages(
  rawConstituents: unknown
): CollectiveProductionStage[] | null {
  const arr = rawConstituents as {
    material: string;
    pct: number;
    locations?: Record<string, string | null>;
    regional_locations?: Record<string, string | null>;
    verification?: Record<string, string | null>;
  }[];
  if (!arr?.length) return null;

  // For each stage, collect unique locations across ALL constituents
  const stageLocations = new Map<
    string,
    { country: string; regional: string | null; verification: CollectiveVerification | null }[]
  >();

  for (const constituent of arr) {
    if (!constituent.locations) continue;
    for (const { key } of STAGE_CONFIG) {
      const country = constituent.locations[key];
      if (!country) continue;
      const regional = constituent.regional_locations?.[key] ?? null;
      const rawVerif = constituent.verification?.[key] ?? null;
      const verification = (rawVerif && rawVerif in VERIFICATION_RANK
        ? rawVerif
        : null) as CollectiveVerification | null;

      const existing = stageLocations.get(key) ?? [];
      const dupeIdx = existing.findIndex(
        (e) => e.country === country && e.regional === regional
      );
      if (dupeIdx >= 0) {
        // Keep highest verification level
        const prev = existing[dupeIdx].verification;
        const prevRank = prev ? VERIFICATION_RANK[prev] ?? -1 : -1;
        const newRank = verification ? VERIFICATION_RANK[verification] ?? -1 : -1;
        if (newRank > prevRank) existing[dupeIdx].verification = verification;
      } else {
        existing.push({ country, regional, verification });
      }
      stageLocations.set(key, existing);
    }
  }

  // Flatten: one stage entry per unique location
  const stages: CollectiveProductionStage[] = [];
  for (const { key, label } of STAGE_CONFIG) {
    const locs = stageLocations.get(key);
    if (!locs?.length) {
      stages.push({ key, label, country: null, regional: null, verification: null });
    } else {
      for (const loc of locs) {
        stages.push({
          key,
          label,
          country: loc.country,
          regional: loc.regional,
          verification: loc.verification,
        });
      }
    }
  }

  if (stages.every((s) => !s.country)) return null;
  return stages;
}

function parseBrand(b: Record<string, unknown>): CollectiveBrand {
  return {
    id: b.id as string,
    name: b.name as string,
    slug: (b.slug as string) ?? null,
    logo_path: (b.logo_path as string) ?? null,
    website_url: (b.website_url as string) ?? null,
    description: (b.description as string) ?? null,
    verified_at: (b.verified_at as string) ?? null,
    tier: ((b.tier as string) ?? "free") as "free" | "verified" | "premium",
  };
}

/**
 * Fetch all featured DPPs with brand data, deduplicated by latest version.
 */
export async function getFeaturedDpps(): Promise<CollectivePageData> {
  const { data: dpps, error: dppError } = await supabase
    .from("dpp_generated")
    .select(DPP_LIST_FIELDS)
    .eq("featured_on_site", true)
    .is("deleted_at", null)
    .order("version", { ascending: false });

  if (dppError || !dpps?.length) {
    return { cards: [], filters: { brands: [], collections: [], materialTypes: [] } };
  }

  // Deduplicate: keep only latest version per brand+collection+sku
  const seen = new Set<string>();
  const uniqueDpps: (CollectiveDpp & { version: number })[] = [];
  for (const dpp of dpps) {
    const key = `${dpp.brand_id}::${dpp.collection_name}::${dpp.product_sku}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueDpps.push({
      ...dpp,
      constituents: parseConstituents(dpp.constituents),
      production_stages: extractProductionStages(dpp.constituents),
    });
  }

  // Fetch all brands referenced
  const brandIds = Array.from(new Set(uniqueDpps.map((d) => d.brand_id)));
  const { data: brands } = await supabase
    .from("brands")
    .select(BRAND_FIELDS)
    .in("id", brandIds);

  const brandMap = new Map<string, CollectiveBrand>();
  for (const b of brands ?? []) {
    brandMap.set(b.id, parseBrand(b));
  }

  // Build card data
  const cards: CollectiveCardData[] = uniqueDpps.map((dpp) => {
    const brand = brandMap.get(dpp.brand_id) ?? {
      id: dpp.brand_id,
      name: "Unknown",
      slug: null,
      logo_path: null,
      website_url: null,
      description: null,
      verified_at: null,
      tier: "free" as const,
    };
    const brandSlug = brand.slug || slugify(brand.name);

    return {
      dpp,
      brand,
      productImageUrl: storageUrl("dpp-images", dpp.image_path),
      brandLogoUrl: storageUrl("brand-assets", brand.logo_path),
      embedUrl: `https://dpp.envrt.com/${brandSlug}/${slugify(dpp.collection_name)}/${slugify(dpp.product_sku)}/embed`,
      detailUrl: `/collective/${brandSlug}/${dpp.product_sku}`,
    };
  });

  const filters = deriveFilters(cards);
  return { cards, filters };
}

/**
 * Fetch a single featured DPP by brand slug and product SKU.
 */
export async function getFeaturedDpp(
  brandSlug: string,
  productSku: string
): Promise<CollectiveCardData | null> {
  const { data: brands } = await supabase
    .from("brands")
    .select(BRAND_FIELDS);

  if (!brands?.length) return null;

  const brandRaw =
    brands.find((b) => b.slug === brandSlug) ??
    brands.find((b) => slugify(b.name) === brandSlug);

  if (!brandRaw) return null;
  const brand = parseBrand(brandRaw);

  const { data: dpp } = await supabase
    .from("dpp_generated")
    .select(DPP_DETAIL_FIELDS)
    .eq("brand_id", brand.id)
    .eq("product_sku", productSku)
    .eq("featured_on_site", true)
    .is("deleted_at", null)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!dpp) return null;

  const resolvedSlug = brand.slug || slugify(brand.name);

  // Fetch ecoscore if available (via garment_id from garments table)
  let ecoscore: CollectiveEcoscore | null = null;
  try {
    // Find the garment record for this brand + sku
    const { data: garment } = await supabase
      .from("garments")
      .select("id, garment_mass_g")
      .eq("brand_id", brand.id)
      .eq("product_sku", productSku)
      .maybeSingle();

    if (garment) {
      // Get latest ecoscore result
      const { data: ecoscoreRow } = await supabase
        .from("ecoscore_results")
        .select("ecoscore_pts")
        .eq("garment_id", garment.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (ecoscoreRow) {
        const massKg = Number(garment.garment_mass_g ?? 0) / 1000;
        const pts = Number(ecoscoreRow.ecoscore_pts);

        // Fetch official label SVG from the portal (public, no auth)
        let labelSvg: string | null = null;
        try {
          const labelRes = await fetch(
            `https://affichage-environnemental.ecobalyse.beta.gouv.fr/api/image?type=score&score=${Math.round(pts)}&masse=${massKg}`,
            { next: { revalidate: 86400 } } // cache for 24h
          );
          if (labelRes.ok) labelSvg = await labelRes.text();
        } catch { /* non-critical */ }

        ecoscore = { ecoscore_pts: pts, mass_kg: massKg, label_svg: labelSvg };
      }
    }
  } catch { /* non-critical, ecoscore is optional */ }

  return {
    dpp: {
      ...dpp,
      constituents: parseConstituents(dpp.constituents),
      production_stages: extractProductionStages(dpp.constituents),
    },
    brand,
    productImageUrl: storageUrl("dpp-images", dpp.image_path),
    brandLogoUrl: storageUrl("brand-assets", brand.logo_path),
    embedUrl: `https://dpp.envrt.com/${resolvedSlug}/${slugify(dpp.collection_name)}/${slugify(dpp.product_sku)}/embed`,
    detailUrl: `/collective/${resolvedSlug}/${dpp.product_sku}`,
    ecoscore,
  };
}

/**
 * Fetch all featured DPPs for a single brand by slug.
 */
export async function getFeaturedDppsByBrand(
  brandSlug: string
): Promise<{ cards: CollectiveCardData[]; brand: CollectiveBrand } | null> {
  const { data: brands } = await supabase
    .from("brands")
    .select(BRAND_FIELDS);

  if (!brands?.length) return null;

  const brandRaw =
    brands.find((b) => b.slug === brandSlug) ??
    brands.find((b) => slugify(b.name) === brandSlug);

  if (!brandRaw) return null;
  const brand = parseBrand(brandRaw);

  const { data: dpps } = await supabase
    .from("dpp_generated")
    .select(DPP_LIST_FIELDS)
    .eq("brand_id", brand.id)
    .eq("featured_on_site", true)
    .is("deleted_at", null)
    .order("version", { ascending: false });

  if (!dpps?.length) return null;

  const seen = new Set<string>();
  const uniqueDpps: (CollectiveDpp & { version: number })[] = [];
  for (const dpp of dpps) {
    const key = `${dpp.brand_id}::${dpp.collection_name}::${dpp.product_sku}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueDpps.push({
      ...dpp,
      constituents: parseConstituents(dpp.constituents),
      production_stages: extractProductionStages(dpp.constituents),
    });
  }

  const resolvedSlug = brand.slug || slugify(brand.name);

  const cards: CollectiveCardData[] = uniqueDpps.map((dpp) => ({
    dpp,
    brand,
    productImageUrl: storageUrl("dpp-images", dpp.image_path),
    brandLogoUrl: storageUrl("brand-assets", brand.logo_path),
    embedUrl: `https://dpp.envrt.com/${resolvedSlug}/${slugify(dpp.collection_name)}/${slugify(dpp.product_sku)}/embed`,
    detailUrl: `/collective/${resolvedSlug}/${dpp.product_sku}`,
  }));

  return { cards, brand };
}

/**
 * Fetch aggregate engagement data for a brand's featured DPPs.
 */
export async function getBrandEngagement(
  brandId: string
): Promise<BrandEngagement> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // Get all DPP IDs for this brand
  const { data: dpps } = await supabase
    .from("dpp_generated")
    .select("id")
    .eq("brand_id", brandId)
    .eq("featured_on_site", true)
    .is("deleted_at", null);

  if (!dpps?.length) return { totalViews: 0, monthlyViews: 0 };

  const dppIds = dpps.map((d) => d.id);

  // Total views
  const { count: totalViews } = await supabase
    .from("dpp_views")
    .select("id", { count: "exact", head: true })
    .in("dpp_id", dppIds);

  // Monthly views
  const { count: monthlyViews } = await supabase
    .from("dpp_views")
    .select("id", { count: "exact", head: true })
    .in("dpp_id", dppIds)
    .gte("viewed_at", monthStart);

  return {
    totalViews: totalViews ?? 0,
    monthlyViews: monthlyViews ?? 0,
  };
}

function deriveFilters(cards: CollectiveCardData[]): CollectiveFilters {
  const brandMap = new Map<string, { name: string; count: number }>();
  const collections = new Set<string>();
  const materials = new Set<string>();

  for (const card of cards) {
    const existing = brandMap.get(card.brand.id);
    if (existing) {
      existing.count++;
    } else {
      brandMap.set(card.brand.id, { name: card.brand.name, count: 1 });
    }
    collections.add(card.dpp.collection_name);
    for (const c of card.dpp.constituents) {
      materials.add(c.material);
    }
  }

  return {
    brands: Array.from(brandMap.entries())
      .map(([id, { name, count }]) => ({ id, name, count }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    collections: Array.from(collections).sort(),
    materialTypes: Array.from(materials).sort(),
  };
}

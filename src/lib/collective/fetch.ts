import { supabase } from "@/lib/supabase";
import type {
  CollectiveDpp,
  CollectiveBrand,
  CollectiveCardData,
  CollectivePageData,
  CollectiveFilters,
} from "./types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function storageUrl(bucket: string, path: string | null): string | null {
  if (!path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Fetch all featured DPPs with brand data, deduplicated by latest version.
 */
export async function getFeaturedDpps(): Promise<CollectivePageData> {
  // Fetch featured DPPs (non-deleted)
  const { data: dpps, error: dppError } = await supabase
    .from("dpp_generated")
    .select(
      "id, brand_id, collection_name, product_sku, garment_name, garment_mass_g, garment_type, traceability_score, total_emissions, total_water, constituents, image_path, featured_at, version"
    )
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
      constituents: (dpp.constituents as { material: string; pct: number }[])?.map((c) => ({
        material: c.material,
        pct: c.pct,
      })) ?? [],
    });
  }

  // Fetch all brands referenced
  const brandIds = Array.from(new Set(uniqueDpps.map((d) => d.brand_id)));
  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug, logo_path")
    .in("id", brandIds);

  const brandMap = new Map<string, CollectiveBrand>();
  for (const b of brands ?? []) {
    brandMap.set(b.id, b);
  }

  // Build card data
  const cards: CollectiveCardData[] = uniqueDpps.map((dpp) => {
    const brand = brandMap.get(dpp.brand_id) ?? {
      id: dpp.brand_id,
      name: "Unknown",
      slug: null,
      logo_path: null,
    };
    const brandSlug = brand.slug || slugify(brand.name);

    return {
      dpp,
      brand,
      productImageUrl: storageUrl("dpp-images", dpp.image_path),
      brandLogoUrl: storageUrl("brand-assets", brand.logo_path),
      embedUrl: `https://dashboard.envrt.com/dpp/${brandSlug}/${encodeURIComponent(dpp.collection_name)}/${dpp.product_sku}/embed`,
      detailUrl: `/collective/${brandSlug}/${dpp.product_sku}`,
    };
  });

  // Build filters
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
  // Look up brand by slug, then fallback to slugified name
  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, slug, logo_path");

  if (!brands?.length) return null;

  const brand =
    brands.find((b) => b.slug === brandSlug) ??
    brands.find((b) => slugify(b.name) === brandSlug);

  if (!brand) return null;

  const { data: dpp } = await supabase
    .from("dpp_generated")
    .select(
      "id, brand_id, collection_name, product_sku, garment_name, garment_mass_g, garment_type, traceability_score, total_emissions, total_water, constituents, image_path, featured_at"
    )
    .eq("brand_id", brand.id)
    .eq("product_sku", productSku)
    .eq("featured_on_site", true)
    .is("deleted_at", null)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!dpp) return null;

  const resolvedSlug = brand.slug || slugify(brand.name);

  return {
    dpp: {
      ...dpp,
      constituents: (dpp.constituents as { material: string; pct: number }[])?.map((c) => ({
        material: c.material,
        pct: c.pct,
      })) ?? [],
    },
    brand,
    productImageUrl: storageUrl("dpp-images", dpp.image_path),
    brandLogoUrl: storageUrl("brand-assets", brand.logo_path),
    embedUrl: `https://dashboard.envrt.com/dpp/${resolvedSlug}/${encodeURIComponent(dpp.collection_name)}/${dpp.product_sku}/embed`,
    detailUrl: `/collective/${resolvedSlug}/${dpp.product_sku}`,
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
    .select("id, name, slug, logo_path");

  if (!brands?.length) return null;

  const brand =
    brands.find((b) => b.slug === brandSlug) ??
    brands.find((b) => slugify(b.name) === brandSlug);

  if (!brand) return null;

  const { data: dpps } = await supabase
    .from("dpp_generated")
    .select(
      "id, brand_id, collection_name, product_sku, garment_name, garment_mass_g, garment_type, traceability_score, total_emissions, total_water, constituents, image_path, featured_at, version"
    )
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
      constituents: (dpp.constituents as { material: string; pct: number }[])?.map((c) => ({
        material: c.material,
        pct: c.pct,
      })) ?? [],
    });
  }

  const resolvedSlug = brand.slug || slugify(brand.name);

  const cards: CollectiveCardData[] = uniqueDpps.map((dpp) => ({
    dpp,
    brand,
    productImageUrl: storageUrl("dpp-images", dpp.image_path),
    brandLogoUrl: storageUrl("brand-assets", brand.logo_path),
    embedUrl: `https://dashboard.envrt.com/dpp/${resolvedSlug}/${encodeURIComponent(dpp.collection_name)}/${dpp.product_sku}/embed`,
    detailUrl: `/collective/${resolvedSlug}/${dpp.product_sku}`,
  }));

  return { cards, brand };
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

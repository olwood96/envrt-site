/** Lightweight DPP record for the collective listing */
export interface CollectiveDpp {
  id: string;
  brand_id: string;
  collection_name: string;
  product_sku: string;
  garment_name: string;
  garment_mass_g: number;
  garment_type: string | null;
  transparency_score: number | null;
  total_emissions: number | null;
  total_water: number | null;
  total_emissions_reduction_pct: number | null;
  total_water_reduction_pct: number | null;
  constituents: CollectiveConstituent[];
  image_path: string | null;
  featured_at: string | null;
  purchase_url: string | null;
  /** Production stages with countries (only populated on detail pages) */
  production_stages: CollectiveProductionStage[] | null;
}

/** Material constituent — just material name and percentage */
export interface CollectiveConstituent {
  material: string;
  pct: number;
}

/** Verification level for a production stage */
export type CollectiveVerification = "declared" | "modelled" | "validated" | "verified";

/** Production stage with location and verification */
export interface CollectiveProductionStage {
  key: string;
  label: string;
  country: string | null;
  regional: string | null;
  verification: CollectiveVerification | null;
}

/** Brand data joined to a DPP */
export interface CollectiveBrand {
  id: string;
  name: string;
  slug: string | null;
  logo_path: string | null;
  website_url: string | null;
  description: string | null;
  verified_at: string | null;
  tier: "free" | "verified" | "premium";
}

/** Combined card data for the grid */
export interface CollectiveCardData {
  dpp: CollectiveDpp;
  brand: CollectiveBrand;
  productImageUrl: string | null;
  brandLogoUrl: string | null;
  embedUrl: string;
  detailUrl: string;
}

/** Available filter options derived from the featured set */
export interface CollectiveFilters {
  brands: { id: string; name: string; count: number }[];
  collections: string[];
  materialTypes: string[];
}

/** Sort options */
export type CollectiveSortKey =
  | "featured_at"
  | "name"
  | "most_compared";

/** Full data returned from getFeaturedDpps */
export interface CollectivePageData {
  cards: CollectiveCardData[];
  filters: CollectiveFilters;
}

/** Brand engagement stats */
export interface BrandEngagement {
  totalViews: number;
  monthlyViews: number;
}

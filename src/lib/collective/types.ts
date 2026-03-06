/** Lightweight DPP record for the collective listing */
export interface CollectiveDpp {
  id: string;
  brand_id: string;
  collection_name: string;
  product_sku: string;
  garment_name: string;
  garment_mass_g: number;
  garment_type: string | null;
  traceability_score: number | null;
  total_emissions: number | null;
  total_water: number | null;
  constituents: CollectiveConstituent[];
  image_path: string | null;
  featured_at: string | null;
}

/** Material constituent — just material name and percentage */
export interface CollectiveConstituent {
  material: string;
  pct: number;
}

/** Brand data joined to a DPP */
export interface CollectiveBrand {
  id: string;
  name: string;
  slug: string | null;
  logo_path: string | null;
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
  brands: { id: string; name: string }[];
  collections: string[];
  materialTypes: string[];
}

/** Sort options */
export type CollectiveSortKey =
  | "featured_at"
  | "emissions_asc"
  | "emissions_desc"
  | "water_asc"
  | "water_desc"
  | "name";

/** Full data returned from getFeaturedDpps */
export interface CollectivePageData {
  cards: CollectiveCardData[];
  filters: CollectiveFilters;
}

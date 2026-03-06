"use client";

import type {
  CollectiveFilters,
  CollectiveSortKey,
} from "@/lib/collective/types";

interface Props {
  filters: CollectiveFilters;
  selectedBrand: string;
  selectedCollection: string;
  selectedMaterial: string;
  sortKey: CollectiveSortKey;
  resultCount: number;
  onBrandChange: (value: string) => void;
  onCollectionChange: (value: string) => void;
  onMaterialChange: (value: string) => void;
  onSortChange: (value: CollectiveSortKey) => void;
}

const SORT_OPTIONS: { value: CollectiveSortKey; label: string }[] = [
  { value: "featured_at", label: "Recently featured" },
  { value: "name", label: "Name (A-Z)" },
  { value: "emissions_asc", label: "CO₂e (low to high)" },
  { value: "emissions_desc", label: "CO₂e (high to low)" },
  { value: "water_asc", label: "Water (low to high)" },
  { value: "water_desc", label: "Water (high to low)" },
];

const selectClasses =
  "rounded-xl border border-envrt-charcoal/8 bg-envrt-cream/60 px-3 py-2 text-xs text-envrt-charcoal focus:border-envrt-teal/40 focus:outline-none focus:ring-2 focus:ring-envrt-teal/10";

export function CollectiveFiltersBar({
  filters,
  selectedBrand,
  selectedCollection,
  selectedMaterial,
  sortKey,
  resultCount,
  onBrandChange,
  onCollectionChange,
  onMaterialChange,
  onSortChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={selectedBrand}
        onChange={(e) => onBrandChange(e.target.value)}
        className={selectClasses}
      >
        <option value="">All brands</option>
        {filters.brands.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <select
        value={selectedCollection}
        onChange={(e) => onCollectionChange(e.target.value)}
        className={selectClasses}
      >
        <option value="">All collections</option>
        {filters.collections.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={selectedMaterial}
        onChange={(e) => onMaterialChange(e.target.value)}
        className={selectClasses}
      >
        <option value="">All materials</option>
        {filters.materialTypes.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <select
        value={sortKey}
        onChange={(e) => onSortChange(e.target.value as CollectiveSortKey)}
        className={selectClasses}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <span className="ml-auto text-xs text-envrt-muted">
        {resultCount} product{resultCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

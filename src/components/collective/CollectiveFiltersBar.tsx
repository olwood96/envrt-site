"use client";

import type {
  CollectiveFilters,
  CollectiveSortKey,
} from "@/lib/collective/types";

interface Props {
  filters: CollectiveFilters;
  searchQuery: string;
  selectedBrand: string;
  selectedCollection: string;
  selectedMaterial: string;
  sortKey: CollectiveSortKey;
  resultCount: number;
  onSearchChange: (value: string) => void;
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
  { value: "most_compared", label: "Most compared" },
];

const selectClasses =
  "rounded-xl border border-envrt-charcoal/8 bg-envrt-cream/60 px-3 py-2 text-xs text-envrt-charcoal focus:border-envrt-teal/40 focus:outline-none focus:ring-2 focus:ring-envrt-teal/10";

export function CollectiveFiltersBar({
  filters,
  searchQuery,
  selectedBrand,
  selectedCollection,
  selectedMaterial,
  sortKey,
  resultCount,
  onSearchChange,
  onBrandChange,
  onCollectionChange,
  onMaterialChange,
  onSortChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-envrt-muted"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className={`${selectClasses} w-44 pl-8`}
        />
      </div>

      <select
        value={selectedBrand}
        onChange={(e) => onBrandChange(e.target.value)}
        className={selectClasses}
      >
        <option value="">All brands</option>
        {filters.brands.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name} ({b.count})
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

"use client";

import type {
  CollectiveFilters,
  CollectiveSortKey,
} from "@/lib/collective/types";
import { FilterDropdown } from "./FilterDropdown";

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
  { value: "most_compared", label: "Most compared" },
];

const searchInputClasses =
  "h-9 rounded-xl border border-envrt-charcoal/8 bg-white px-3 py-2 text-xs text-envrt-charcoal placeholder:text-envrt-muted focus:border-envrt-charcoal/20 focus:outline-none focus:ring-2 focus:ring-envrt-charcoal/8";

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
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
      <div className="relative w-full sm:w-auto">
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
          className={`${searchInputClasses} w-full pl-8 sm:w-44`}
        />
      </div>

      <FilterDropdown
        label="All brands"
        value={selectedBrand}
        options={[
          { value: "", label: "All brands" },
          ...filters.brands.map((b) => ({
            value: b.id,
            label: `${b.name} (${b.count})`,
          })),
        ]}
        onChange={onBrandChange}
      />

      <FilterDropdown
        label="All collections"
        value={selectedCollection}
        options={[
          { value: "", label: "All collections" },
          ...filters.collections.map((c) => ({ value: c, label: c })),
        ]}
        onChange={onCollectionChange}
      />

      <FilterDropdown
        label="All materials"
        value={selectedMaterial}
        options={[
          { value: "", label: "All materials" },
          ...filters.materialTypes.map((m) => ({ value: m, label: m })),
        ]}
        onChange={onMaterialChange}
      />

      <FilterDropdown
        label="Recently featured"
        value={sortKey}
        options={SORT_OPTIONS}
        onChange={(v) => onSortChange(v as CollectiveSortKey)}
      />

      <span className="text-right text-xs text-envrt-muted sm:ml-auto sm:text-left">
        {resultCount} product{resultCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

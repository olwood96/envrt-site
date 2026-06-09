"use client";

import type {
  CollectiveFilters,
  CollectiveSortKey,
} from "@/lib/collective/types";
import { DropdownV3 } from "../DropdownV3";

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
  onClearAll: () => void;
}

const SORT_OPTIONS: { value: CollectiveSortKey; label: string }[] = [
  { value: "featured_at", label: "Recently featured" },
  { value: "name", label: "Name (A-Z)" },
  { value: "most_compared", label: "Most compared" },
];

export function CollectiveFiltersBarV3({
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
  onClearAll,
}: Props) {
  const hasActiveFilters =
    !!searchQuery ||
    !!selectedBrand ||
    !!selectedCollection ||
    !!selectedMaterial ||
    sortKey !== "featured_at";

  return (
    <div className="rounded-3xl border border-envrt-brand-black/10 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchInput value={searchQuery} onChange={onSearchChange} />

        <DropdownV3
          variant="chip"
          label="Brand"
          placeholder="Any"
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

        <DropdownV3
          variant="chip"
          label="Collection"
          placeholder="Any"
          value={selectedCollection}
          options={[
            { value: "", label: "All collections" },
            ...filters.collections.map((c) => ({ value: c, label: c })),
          ]}
          onChange={onCollectionChange}
        />

        <DropdownV3
          variant="chip"
          label="Material"
          placeholder="Any"
          value={selectedMaterial}
          options={[
            { value: "", label: "All materials" },
            ...filters.materialTypes.map((m) => ({ value: m, label: m })),
          ]}
          onChange={onMaterialChange}
        />

        <DropdownV3
          variant="chip"
          label="Sort"
          placeholder="Any"
          value={sortKey}
          options={SORT_OPTIONS}
          onChange={(v) => onSortChange(v as CollectiveSortKey)}
        />

        <div className="ml-auto flex items-center gap-3">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearAll}
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 transition-colors duration-200 hover:text-envrt-brand-ultramarine sm:text-[11px]"
            >
              Clear filters
            </button>
          )}
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/60 sm:text-[11px]">
            {resultCount} {resultCount === 1 ? "result" : "results"}
          </span>
        </div>
      </div>
    </div>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative w-full sm:w-56">
      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-envrt-brand-black/45"
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products"
        className="h-10 w-full rounded-full border border-envrt-brand-black/12 bg-envrt-brand-vista/40 pl-10 pr-4 text-sm text-envrt-brand-black placeholder:text-envrt-brand-black/45 focus:border-envrt-brand-ultramarine/40 focus:outline-none focus:ring-2 focus:ring-envrt-brand-ultramarine/15"
      />
    </div>
  );
}


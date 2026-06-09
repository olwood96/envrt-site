"use client";

import { useEffect, useRef, useState } from "react";
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

        <FilterChip
          label="Brand"
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

        <FilterChip
          label="Collection"
          value={selectedCollection}
          options={[
            { value: "", label: "All collections" },
            ...filters.collections.map((c) => ({ value: c, label: c })),
          ]}
          onChange={onCollectionChange}
        />

        <FilterChip
          label="Material"
          value={selectedMaterial}
          options={[
            { value: "", label: "All materials" },
            ...filters.materialTypes.map((m) => ({ value: m, label: m })),
          ]}
          onChange={onMaterialChange}
        />

        <FilterChip
          label="Sort"
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

interface Option {
  value: string;
  label: string;
}

function FilterChip({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);
  const isActive = !!value;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-10 w-full items-center gap-2 rounded-full border px-4 transition-colors duration-200 sm:w-auto ${
          isActive
            ? "border-envrt-brand-ultramarine/40 bg-envrt-brand-ultramarine/8 text-envrt-brand-ultramarine"
            : "border-envrt-brand-black/12 bg-white text-envrt-brand-black/70 hover:border-envrt-brand-ultramarine/30 hover:text-envrt-brand-ultramarine"
        }`}
        aria-expanded={open}
      >
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px]">
          {label}
        </span>
        <span className="truncate text-xs font-medium tracking-tight">
          {isActive ? selected?.label : "Any"}
        </span>
        <svg
          aria-hidden
          className={`h-3 w-3 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 max-h-72 w-full min-w-[220px] overflow-y-auto rounded-2xl border border-envrt-brand-black/12 bg-white p-1 shadow-[0_24px_50px_-22px_rgba(14,14,14,0.18)] sm:w-auto">
          <p className="px-3 pb-1.5 pt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/45 sm:text-[11px]">
            {label}
          </p>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value || "__any"}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150 ${
                  isSelected
                    ? "bg-envrt-brand-ultramarine/10 text-envrt-brand-ultramarine"
                    : "text-envrt-brand-black/80 hover:bg-envrt-brand-black/4"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <svg
                    aria-hidden
                    className="h-3.5 w-3.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type {
  CollectiveCardData,
  CollectiveFilters,
  CollectiveSortKey,
} from "@/lib/collective/types";
import { FadeUp } from "@/components/ui/Motion";
import { CollectiveCardV3 } from "./CollectiveCardV3";
import { CollectiveFiltersBarV3 } from "./CollectiveFiltersBarV3";
import { CollectiveCompareBarV3 } from "./CollectiveCompareBarV3";

const MAX_COMPARE = 3;
const PAGE_SIZE = 12;
const COMPARE_COUNTS_KEY = "envrt_compare_counts";

function getCompareCounts(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(COMPARE_COUNTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function incrementCompareCount(dppId: string): void {
  const counts = getCompareCounts();
  counts[dppId] = (counts[dppId] || 0) + 1;
  try {
    localStorage.setItem(COMPARE_COUNTS_KEY, JSON.stringify(counts));
  } catch {
    // localStorage full or unavailable
  }
}

interface Props {
  cards: CollectiveCardData[];
  filters: CollectiveFilters;
}

export function CollectiveGridV3({ cards, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [sortKey, setSortKey] = useState<CollectiveSortKey>("featured_at");
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [compareCounts, setCompareCounts] = useState<Record<string, number>>({});
  const [openMapIds, setOpenMapIds] = useState<Set<string>>(new Set());
  const [columns, setColumns] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCompareCounts(getCompareCounts());
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof ResizeObserver === "undefined"
    )
      return;
    const grid = gridRef.current;
    if (!grid) return;

    const measure = () => {
      const children = grid.children;
      if (children.length === 0) return;
      const firstTop = (children[0] as HTMLElement).offsetTop;
      let count = 0;
      for (let i = 0; i < children.length; i++) {
        if ((children[i] as HTMLElement).offsetTop === firstTop) count++;
        else break;
      }
      setColumns(Math.max(1, count));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  const filteredCards = useMemo(() => {
    let result = cards;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.dpp.garment_name.toLowerCase().includes(q) ||
          c.dpp.product_sku.toLowerCase().includes(q) ||
          c.brand.name.toLowerCase().includes(q) ||
          c.dpp.collection_name.toLowerCase().includes(q),
      );
    }
    if (selectedBrand) {
      result = result.filter((c) => c.brand.id === selectedBrand);
    }
    if (selectedCollection) {
      result = result.filter(
        (c) => c.dpp.collection_name === selectedCollection,
      );
    }
    if (selectedMaterial) {
      result = result.filter((c) =>
        c.dpp.constituents.some((m) => m.material === selectedMaterial),
      );
    }

    result = [...result].sort((a, b) => {
      switch (sortKey) {
        case "featured_at":
          return (
            new Date(b.dpp.featured_at ?? 0).getTime() -
            new Date(a.dpp.featured_at ?? 0).getTime()
          );
        case "name":
          return a.dpp.garment_name.localeCompare(b.dpp.garment_name);
        case "most_compared":
          return (
            (compareCounts[b.dpp.id] ?? 0) - (compareCounts[a.dpp.id] ?? 0)
          );
        default:
          return 0;
      }
    });

    return result;
  }, [
    cards,
    searchQuery,
    selectedBrand,
    selectedCollection,
    selectedMaterial,
    sortKey,
    compareCounts,
  ]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [
    searchQuery,
    selectedBrand,
    selectedCollection,
    selectedMaterial,
    sortKey,
  ]);

  const visibleCards = filteredCards.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCards.length;

  const selectedCards = useMemo(
    () => cards.filter((c) => compareIds.has(c.dpp.id)),
    [cards, compareIds],
  );

  const compareBrandId =
    selectedCards.length > 0 ? selectedCards[0].brand.id : null;

  const toggleCompare = useCallback(
    (id: string) => {
      let wasAdded = false;
      setCompareIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          const card = cards.find((c) => c.dpp.id === id);
          if (!card) return prev;
          if (compareBrandId && card.brand.id !== compareBrandId) return prev;
          if (next.size >= MAX_COMPARE) return prev;
          next.add(id);
          wasAdded = true;
        }
        return next;
      });
      if (wasAdded) {
        incrementCompareCount(id);
        setCompareCounts(getCompareCounts());
      }
    },
    [cards, compareBrandId],
  );

  const isCompareDisabled = useCallback(
    (card: CollectiveCardData) => {
      if (compareIds.size >= MAX_COMPARE) return true;
      if (compareBrandId && card.brand.id !== compareBrandId) return true;
      return false;
    },
    [compareIds.size, compareBrandId],
  );

  const toggleRowMaps = useCallback(
    (cardIdx: number) => {
      const rowStart = Math.floor(cardIdx / columns) * columns;
      const rowIds = visibleCards
        .slice(rowStart, rowStart + columns)
        .map((c) => c.dpp.id);
      setOpenMapIds((prev) => {
        const next = new Set(prev);
        const anyOpen = rowIds.some((id) => next.has(id));
        if (anyOpen) rowIds.forEach((id) => next.delete(id));
        else rowIds.forEach((id) => next.add(id));
        return next;
      });
    },
    [columns, visibleCards],
  );

  const handleClearAll = useCallback(() => {
    setSearchQuery("");
    setSelectedBrand("");
    setSelectedCollection("");
    setSelectedMaterial("");
    setSortKey("featured_at");
  }, []);

  return (
    <div>
      <FadeUp>
        <CollectiveFiltersBarV3
          filters={filters}
          searchQuery={searchQuery}
          selectedBrand={selectedBrand}
          selectedCollection={selectedCollection}
          selectedMaterial={selectedMaterial}
          sortKey={sortKey}
          resultCount={filteredCards.length}
          onSearchChange={setSearchQuery}
          onBrandChange={setSelectedBrand}
          onCollectionChange={setSelectedCollection}
          onMaterialChange={setSelectedMaterial}
          onSortChange={setSortKey}
          onClearAll={handleClearAll}
        />
      </FadeUp>

      {filteredCards.length === 0 ? (
        <div className="mt-14 rounded-3xl border border-dashed border-envrt-brand-black/12 bg-white py-16 text-center">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[11px]">
            No matches
          </p>
          <p className="mt-3 max-w-md mx-auto px-6 text-base text-envrt-brand-black/65">
            No products match your filters. Try clearing them and starting over.
          </p>
          <button
            type="button"
            onClick={handleClearAll}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-envrt-brand-black/15 bg-white px-5 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/75 transition-colors duration-200 hover:border-envrt-brand-ultramarine/40 hover:text-envrt-brand-ultramarine"
          >
            Clear filters<span aria-hidden>→</span>
          </button>
        </div>
      ) : (
        <>
          <div
            ref={gridRef}
            className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          >
            {visibleCards.map((card, idx) => (
              <FadeUp key={card.dpp.id}>
                <CollectiveCardV3
                  card={card}
                  isSelected={compareIds.has(card.dpp.id)}
                  onToggleCompare={toggleCompare}
                  compareDisabled={isCompareDisabled(card)}
                  crossBrandDisabled={
                    !!compareBrandId && card.brand.id !== compareBrandId
                  }
                  mapOpen={openMapIds.has(card.dpp.id)}
                  onToggleMap={() => toggleRowMaps(idx)}
                />
              </FadeUp>
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="inline-flex items-center gap-2 rounded-full border border-envrt-brand-black/15 bg-white px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/75 transition-colors duration-200 hover:border-envrt-brand-ultramarine/40 hover:text-envrt-brand-ultramarine"
              >
                Show {Math.min(PAGE_SIZE, filteredCards.length - visibleCount)}{" "}
                more <span aria-hidden>→</span>
              </button>
              <p className="mt-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/45 sm:text-[11px]">
                {filteredCards.length - visibleCount} remaining
              </p>
            </div>
          )}
        </>
      )}

      <CollectiveCompareBarV3
        selectedCards={selectedCards}
        onRemove={toggleCompare}
        onClear={() => setCompareIds(new Set())}
      />
    </div>
  );
}

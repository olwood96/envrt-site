"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type {
  CollectiveCardData,
  CollectiveFilters,
  CollectiveSortKey,
} from "@/lib/collective/types";
import { CollectiveFiltersBar } from "./CollectiveFiltersBar";
import { CollectiveCard } from "./CollectiveCard";
import { CollectiveCompareBar } from "./CollectiveCompareBar";
import { FadeUp } from "@/components/ui/Motion";

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

export function CollectiveGrid({ cards, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [sortKey, setSortKey] = useState<CollectiveSortKey>("featured_at");
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mapsOpen, setMapsOpen] = useState(false);
  const [compareCounts, setCompareCounts] = useState<Record<string, number>>(
    {}
  );

  // Load compare counts from localStorage on mount
  useEffect(() => {
    setCompareCounts(getCompareCounts());
  }, []);

  // Filter + sort
  const filteredCards = useMemo(() => {
    let result = cards;

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.dpp.garment_name.toLowerCase().includes(q) ||
          c.dpp.product_sku.toLowerCase().includes(q) ||
          c.brand.name.toLowerCase().includes(q) ||
          c.dpp.collection_name.toLowerCase().includes(q)
      );
    }

    if (selectedBrand) {
      result = result.filter((c) => c.brand.id === selectedBrand);
    }
    if (selectedCollection) {
      result = result.filter(
        (c) => c.dpp.collection_name === selectedCollection
      );
    }
    if (selectedMaterial) {
      result = result.filter((c) =>
        c.dpp.constituents.some((m) => m.material === selectedMaterial)
      );
    }

    // Sort
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

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedBrand, selectedCollection, selectedMaterial, sortKey]);

  const visibleCards = filteredCards.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCards.length;

  // Compare logic — same-brand only, max 4
  const selectedCards = useMemo(
    () => cards.filter((c) => compareIds.has(c.dpp.id)),
    [cards, compareIds]
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
    [cards, compareBrandId]
  );

  const isCompareDisabled = useCallback(
    (card: CollectiveCardData) => {
      if (compareIds.size >= MAX_COMPARE) return true;
      if (compareBrandId && card.brand.id !== compareBrandId) return true;
      return false;
    },
    [compareIds.size, compareBrandId]
  );

  return (
    <div>
      <FadeUp>
        <CollectiveFiltersBar
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
        />
      </FadeUp>

      {filteredCards.length === 0 ? (
        <p className="mt-16 text-center text-envrt-muted">
          No products match your filters.
        </p>
      ) : (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCards.map((card) => (
              <FadeUp key={card.dpp.id}>
                <CollectiveCard
                  card={card}
                  isSelected={compareIds.has(card.dpp.id)}
                  onToggleCompare={toggleCompare}
                  compareDisabled={isCompareDisabled(card)}
                  crossBrandDisabled={!!compareBrandId && card.brand.id !== compareBrandId}
                  mapOpen={mapsOpen}
                  onToggleMap={() => setMapsOpen((prev) => !prev)}
                />
              </FadeUp>
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="inline-flex items-center justify-center rounded-xl border border-envrt-charcoal/8 px-6 py-2.5 text-sm font-medium text-envrt-charcoal transition-colors hover:border-envrt-teal/20 hover:text-envrt-teal"
              >
                Show more ({filteredCards.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}

      <CollectiveCompareBar
        selectedCards={selectedCards}
        onRemove={toggleCompare}
        onClear={() => setCompareIds(new Set())}
      />
    </div>
  );
}

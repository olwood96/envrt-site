"use client";

import { useState, useMemo, useCallback } from "react";
import type {
  CollectiveCardData,
  CollectiveFilters,
  CollectiveSortKey,
} from "@/lib/collective/types";
import { CollectiveFiltersBar } from "./CollectiveFiltersBar";
import { CollectiveCard } from "./CollectiveCard";
import { CollectiveCompareBar } from "./CollectiveCompareBar";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/Motion";

const MAX_COMPARE = 4;

interface Props {
  cards: CollectiveCardData[];
  filters: CollectiveFilters;
}

export function CollectiveGrid({ cards, filters }: Props) {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [sortKey, setSortKey] = useState<CollectiveSortKey>("featured_at");
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());

  // Filter + sort
  const filteredCards = useMemo(() => {
    let result = cards;

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
        case "emissions_asc":
          return (a.dpp.total_emissions ?? Infinity) - (b.dpp.total_emissions ?? Infinity);
        case "emissions_desc":
          return (b.dpp.total_emissions ?? -Infinity) - (a.dpp.total_emissions ?? -Infinity);
        case "water_asc":
          return (a.dpp.total_water ?? Infinity) - (b.dpp.total_water ?? Infinity);
        case "water_desc":
          return (b.dpp.total_water ?? -Infinity) - (a.dpp.total_water ?? -Infinity);
        default:
          return 0;
      }
    });

    return result;
  }, [cards, selectedBrand, selectedCollection, selectedMaterial, sortKey]);

  // Compare logic — enforce same brand
  const selectedCards = useMemo(
    () => cards.filter((c) => compareIds.has(c.dpp.id)),
    [cards, compareIds]
  );

  const compareBrandId =
    selectedCards.length > 0 ? selectedCards[0].brand.id : null;

  const toggleCompare = useCallback(
    (id: string) => {
      setCompareIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          // Enforce same brand
          const card = cards.find((c) => c.dpp.id === id);
          if (!card) return prev;
          if (compareBrandId && card.brand.id !== compareBrandId) return prev;
          if (next.size >= MAX_COMPARE) return prev;
          next.add(id);
        }
        return next;
      });
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
          selectedBrand={selectedBrand}
          selectedCollection={selectedCollection}
          selectedMaterial={selectedMaterial}
          sortKey={sortKey}
          resultCount={filteredCards.length}
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
        <StaggerChildren className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((card) => (
            <StaggerItem key={card.dpp.id}>
              <CollectiveCard
                card={card}
                isSelected={compareIds.has(card.dpp.id)}
                onToggleCompare={toggleCompare}
                compareDisabled={isCompareDisabled(card)}
              />
            </StaggerItem>
          ))}
        </StaggerChildren>
      )}

      <CollectiveCompareBar
        selectedCards={selectedCards}
        onRemove={toggleCompare}
        onClear={() => setCompareIds(new Set())}
      />
    </div>
  );
}

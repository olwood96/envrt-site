"use client";

import { useState, useCallback, useMemo } from "react";
import type { CollectiveCardData } from "@/lib/collective/types";
import { CollectiveCard } from "./CollectiveCard";
import { CollectiveCompareBar } from "./CollectiveCompareBar";

const MAX_COMPARE = 4;

interface Props {
  cards: CollectiveCardData[];
}

export function CollectiveBrandGrid({ cards }: Props) {
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [mapsOpen, setMapsOpen] = useState(false);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_COMPARE) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectedCards = useMemo(
    () => cards.filter((c) => compareIds.has(c.dpp.id)),
    [cards, compareIds]
  );

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <CollectiveCard
            key={card.dpp.id}
            card={card}
            isSelected={compareIds.has(card.dpp.id)}
            onToggleCompare={toggleCompare}
            compareDisabled={compareIds.size >= MAX_COMPARE}
            mapOpen={mapsOpen}
            onToggleMap={() => setMapsOpen((prev) => !prev)}
          />
        ))}
      </div>

      <CollectiveCompareBar
        selectedCards={selectedCards}
        onRemove={toggleCompare}
        onClear={() => setCompareIds(new Set())}
      />
    </>
  );
}

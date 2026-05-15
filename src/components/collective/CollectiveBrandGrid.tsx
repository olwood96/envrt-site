"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { CollectiveCardData } from "@/lib/collective/types";
import { CollectiveCard } from "./CollectiveCard";
import { CollectiveCompareBar } from "./CollectiveCompareBar";

const MAX_COMPARE = 3;

interface Props {
  cards: CollectiveCardData[];
}

export function CollectiveBrandGrid({ cards }: Props) {
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [openMapIds, setOpenMapIds] = useState<Set<string>>(new Set());
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const update = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setColumns(3);
      else if (window.matchMedia("(min-width: 640px)").matches) setColumns(2);
      else setColumns(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const toggleRowMaps = useCallback(
    (cardIdx: number) => {
      const rowStart = Math.floor(cardIdx / columns) * columns;
      const rowIds = cards
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
    [columns, cards]
  );

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
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {cards.map((card, idx) => (
          <CollectiveCard
            key={card.dpp.id}
            card={card}
            isSelected={compareIds.has(card.dpp.id)}
            onToggleCompare={toggleCompare}
            compareDisabled={compareIds.size >= MAX_COMPARE}
            mapOpen={openMapIds.has(card.dpp.id)}
            onToggleMap={() => toggleRowMaps(idx)}
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

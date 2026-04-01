"use client";

import Link from "next/link";
import Image from "next/image";
import type { CollectiveCardData } from "@/lib/collective/types";

interface Props {
  selectedCards: CollectiveCardData[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function CollectiveCompareBar({
  selectedCards,
  onRemove,
  onClear,
}: Props) {
  if (selectedCards.length < 2) return null;

  // Build compare URL
  const products = selectedCards
    .map(
      (c) =>
        `${c.brand.slug || c.brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/${encodeURIComponent(c.dpp.collection_name)}/${c.dpp.product_sku}`
    )
    .join(",");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-envrt-teal/20 bg-white/95 shadow-xl backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-2">
          {selectedCards.map((card) => (
            <div
              key={card.dpp.id}
              className="relative h-10 w-10 rounded-lg border border-envrt-charcoal/10 bg-envrt-cream/40"
            >
              <div className="h-full w-full overflow-hidden rounded-lg">
                {card.productImageUrl ? (
                  <Image
                    src={card.productImageUrl}
                    alt={card.dpp.garment_name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[8px] text-envrt-muted">
                    DPP
                  </div>
                )}
              </div>
              <button
                onClick={() => onRemove(card.dpp.id)}
                className="absolute -right-1.5 -top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-envrt-charcoal text-[10px] font-bold text-white shadow-sm"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <span className="text-xs text-envrt-muted">
          {selectedCards.length} selected
        </span>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={onClear}
            className="text-xs text-envrt-muted hover:text-envrt-charcoal"
          >
            Clear
          </button>
          <Link
            href={`/collective/compare?products=${products}`}
            className="inline-flex items-center justify-center rounded-xl bg-envrt-green px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-envrt-green/90"
          >
            Compare
            <span className="ml-1.5">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

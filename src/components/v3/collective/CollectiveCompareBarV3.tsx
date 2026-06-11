"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { CollectiveCardData } from "@/lib/collective/types";
import { EASE_BRAND } from "@/components/sections/v3/_shared";

interface Props {
  selectedCards: CollectiveCardData[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const MAX_SLOTS = 3;

export function CollectiveCompareBarV3({
  selectedCards,
  onRemove,
  onClear,
}: Props) {
  const ready = selectedCards.length >= 2;
  const visible = selectedCards.length > 0;

  if (!visible) return null;

  const products = selectedCards
    .map(
      (c) =>
        `${
          c.brand.slug ||
          c.brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
        }/${encodeURIComponent(c.dpp.collection_name)}/${c.dpp.product_sku}`,
    )
    .join(",");

  const slots = Array.from({ length: MAX_SLOTS }, (_, i) => selectedCards[i] ?? null);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:pb-6">
      <AnimatePresence>
        <motion.div
          key="compare-bar"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_BRAND }}
          className="pointer-events-auto flex w-full max-w-[920px] items-center gap-3 rounded-3xl border border-white/15 bg-envrt-brand-black/90 p-3 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:gap-4 sm:p-4"
        >
          <span
            aria-hidden
            className="hidden font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-neon sm:inline sm:text-[11px]"
          >
            Compare
          </span>

          <ul className="flex flex-1 items-center gap-2 sm:gap-3">
            {slots.map((card, i) => (
              <li key={i} className="relative">
                {card ? (
                  <FilledSlot card={card} onRemove={onRemove} />
                ) : (
                  <EmptySlot index={i + 1} />
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClear}
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 transition-colors duration-200 hover:text-white sm:text-[11px]"
            >
              Clear
            </button>
            <Link
              href={
                ready
                  ? `/collective/compare?products=${products}`
                  : "#"
              }
              aria-disabled={!ready}
              tabIndex={ready ? 0 : -1}
              onClick={(e) => {
                if (!ready) e.preventDefault();
              }}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] transition-all duration-200 sm:px-5 sm:text-[11px] ${
                ready
                  ? "bg-envrt-brand-neon text-envrt-brand-black hover:translate-y-[-1px] hover:shadow-[0_18px_30px_-18px_rgba(237,255,0,0.55)]"
                  : "bg-white/10 text-white/40"
              }`}
            >
              {ready ? "Compare" : "Pick at least 2"}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FilledSlot({
  card,
  onRemove,
}: {
  card: CollectiveCardData;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="relative">
      <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/15 bg-white/10 sm:h-14 sm:w-14">
        {card.productImageUrl ? (
          <Image
            src={card.productImageUrl}
            alt={card.dpp.garment_name}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[8px] font-semibold uppercase tracking-[0.18em] text-white/55">
            DPP
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onRemove(card.dpp.id)}
        aria-label={`Remove ${card.dpp.garment_name}`}
        className="absolute -right-1.5 -top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] text-envrt-brand-black shadow-sm transition-colors hover:bg-envrt-brand-neon"
      >
        ×
      </button>
    </div>
  );
}

function EmptySlot({ index }: { index: number }) {
  return (
    <div
      aria-hidden
      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-white/20 bg-transparent font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 sm:h-14 sm:w-14 sm:text-[11px]"
    >
      0{index}
    </div>
  );
}

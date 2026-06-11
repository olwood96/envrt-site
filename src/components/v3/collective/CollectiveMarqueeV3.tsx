"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CollectiveCardData } from "@/lib/collective/types";

// Horizontally-scrolling infinite marquee of live featured DPPs. Powers
// a "wall of real products" visual without committing to fake data. The
// list is duplicated and the wrapper translates from 0% to -50% over 60
// seconds for a seamless loop. Edges fade so the scroll never visually
// stops or starts.

export function CollectiveMarqueeV3({
  cards,
  durationSeconds = 60,
}: {
  cards: CollectiveCardData[];
  durationSeconds?: number;
}) {
  if (cards.length === 0) return null;

  // Render the card list twice so the marquee can wrap seamlessly. The
  // wrapper animates from translateX(0) to translateX(-50%); at -50% the
  // second copy is exactly where the first copy started, so the loop
  // restarts invisibly.
  const doubled = [...cards, ...cards];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Edge fades — vista bg colour at both ends so the strip blends. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-envrt-brand-vista to-transparent sm:w-32"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-envrt-brand-vista to-transparent sm:w-32"
      />

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: durationSeconds,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex w-fit gap-4 sm:gap-5"
      >
        {doubled.map((card, i) => (
          <MarqueeCard key={`${card.dpp.id}-${i}`} card={card} />
        ))}
      </motion.div>
    </div>
  );
}

function MarqueeCard({ card }: { card: CollectiveCardData }) {
  return (
    <Link href={card.detailUrl} className="group relative flex-shrink-0">
      <div className="relative h-44 w-44 overflow-hidden rounded-2xl ring-1 ring-envrt-brand-black/8 sm:h-52 sm:w-52 lg:h-60 lg:w-60">
        {card.productImageUrl ? (
          <Image
            src={card.productImageUrl}
            alt={card.dpp.garment_name}
            fill
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 208px, 176px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-envrt-brand-vista">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-envrt-brand-black/35">
              No image
            </span>
          </div>
        )}
        {/* Bottom gradient + caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-envrt-brand-black/75 via-envrt-brand-black/30 to-transparent p-3 sm:p-4">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-[10px]">
            {card.brand.name}
          </p>
          <p className="mt-0.5 truncate text-xs font-semibold text-white sm:text-sm">
            {card.dpp.garment_name}
          </p>
        </div>
      </div>
    </Link>
  );
}

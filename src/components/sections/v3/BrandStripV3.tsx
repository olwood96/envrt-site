"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_BRAND } from "./_shared";

// Trust strip rendered inline at the bottom of HeroV3. Three columns,
// hairline divided. Left column rotates through the brand logos we have
// rights to display. Right two columns carry one supporting stat each.
// Visual treatment matches AlignedWithCarouselV3 (grayscale + 55%
// opacity, mix-blend-multiply to lift backgrounds against the vista
// cream). No section wrapper or SectionCorners — the parent Hero
// already provides those.

type Brand = {
  name: string;
  logo: string;
};

const BRANDS: Brand[] = [
  { name: "FAE House", logo: "/brand/logos/fae-house.png" },
  { name: "Angry Pablo", logo: "/brand/logos/angry-pablo.png" },
  { name: "Rene Bassett", logo: "/brand/logos/rene-bassett.png" },
  { name: "Vaela", logo: "/brand/logos/vaela.png" },
];

const ROTATE_MS = 3200;

function BrandRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % BRANDS.length);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, []);

  const current = BRANDS[index];

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-10 w-full items-center justify-center sm:h-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, ease: EASE_BRAND }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Image
              src={current.logo}
              alt={current.name}
              width={160}
              height={48}
              className="max-h-full w-auto object-contain opacity-55 mix-blend-multiply grayscale transition-opacity duration-300 hover:opacity-90"
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <span className="mt-3 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[10px]">
        {current.name}
      </span>
    </div>
  );
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="font-display text-[2rem] font-medium leading-none tracking-[-0.025em] text-envrt-brand-black sm:text-[2.5rem]">
        {value}
      </p>
      <p className="mt-3 max-w-[14rem] font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[10px]">
        {label}
      </p>
    </div>
  );
}

export function BrandStripV3() {
  return (
    <div className="grid grid-cols-1 items-center gap-y-8 border-t border-envrt-brand-black/10 pt-6 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-0 sm:divide-x sm:divide-envrt-brand-black/10 sm:pt-8">
      <div className="sm:px-6 sm:first:pl-0">
        <BrandRotator />
      </div>
      <div className="sm:px-6">
        <StatCell value="75+" label="Network of apparel brands and partners" />
      </div>
      <div className="sm:px-6 sm:last:pr-0">
        <StatCell value="27" label="EU markets aligned with our methodology" />
      </div>
    </div>
  );
}

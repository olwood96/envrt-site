"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";
import { EASE_BRAND, Eyebrow, SectionCorners } from "./_shared";

// Trust strip directly under the hero. Follows v3 styleguide:
// vista background, section corners, ultramarine eyebrow, Big Shoulders
// supporting numerals (N27 is reserved for NumbersSection), grayscale
// logo treatment matching AlignedWithCarouselV3 with hover-to-colour.

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
      <div className="relative flex h-14 w-full items-center justify-center sm:h-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.55, ease: EASE_BRAND }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Image
              src={current.logo}
              alt={current.name}
              width={200}
              height={64}
              className="max-h-full w-auto object-contain opacity-55 mix-blend-multiply grayscale transition-opacity duration-300 hover:opacity-90"
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <span className="mt-4 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[11px]">
        {current.name}
      </span>
    </div>
  );
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="font-display text-[3rem] font-medium leading-none tracking-[-0.025em] text-envrt-brand-black sm:text-[3.5rem]">
        {value}
      </p>
      <p className="mt-4 max-w-[14rem] font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[11px]">
        {label}
      </p>
    </div>
  );
}

export function BrandStripV3() {
  return (
    <section className="relative bg-envrt-brand-vista py-12 sm:py-16">
      <SectionCorners left="ENVRT/01a" right="In use by" />

      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <Eyebrow className="text-center">In use by</Eyebrow>
        </FadeUp>

        <FadeUp delay={0.08}>
          <div className="mt-10 grid grid-cols-1 items-center gap-y-12 border-t border-envrt-brand-black/12 pt-10 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-0 sm:divide-x sm:divide-envrt-brand-black/12">
            <div className="sm:px-8 sm:first:pl-0">
              <BrandRotator />
            </div>
            <div className="sm:px-8">
              <StatCell
                value="75+"
                label="Network of apparel brands and partners"
              />
            </div>
            <div className="sm:px-8 sm:last:pr-0">
              <StatCell
                value="27"
                label="EU markets aligned with our methodology"
              />
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

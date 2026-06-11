"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";
import { SectionCorners } from "./_shared";

// Three-column trust strip directly under the hero. Left column rotates
// through the brand logos we have rights to display. Right two columns
// carry one supporting stat each. Kept deliberately calm — this surface
// shouldn't compete with the hero or the problem section.

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
    <div className="relative flex h-20 w-full items-center justify-center sm:h-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Image
            src={current.logo}
            alt={current.name}
            width={180}
            height={64}
            className="max-h-12 w-auto object-contain opacity-80 sm:max-h-14"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 gap-1.5">
        {BRANDS.map((b, i) => (
          <span
            key={b.name}
            aria-hidden
            className={`h-1 rounded-full transition-all duration-300 ${
              i === index
                ? "w-4 bg-envrt-brand-ultramarine"
                : "w-1 bg-envrt-brand-black/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-n27 text-[2.5rem] font-bold leading-none tracking-[-0.02em] text-envrt-brand-black sm:text-[3rem]">
        {value}
      </p>
      <p className="mt-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[11px]">
        {label}
      </p>
    </div>
  );
}

export function BrandStripV3() {
  return (
    <section className="relative bg-envrt-brand-vista">
      <SectionCorners left="ENVRT/01a" right="In use by" />

      <div className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 sm:py-14 lg:px-16 lg:py-16">
        <FadeUp>
          <div className="grid grid-cols-1 items-center gap-10 border-t border-envrt-brand-black/10 pt-10 sm:gap-12 lg:grid-cols-3">
            {/* Brand rotator */}
            <div>
              <p className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[11px]">
                In use by
              </p>
              <div className="mt-4">
                <BrandRotator />
              </div>
            </div>

            {/* Stat 1 */}
            <div className="border-t border-envrt-brand-black/10 pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              <StatCell
                value="75+"
                label="Network of apparel brands and partners"
              />
            </div>

            {/* Stat 2 */}
            <div className="border-t border-envrt-brand-black/10 pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
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

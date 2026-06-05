"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";

type ManifestoStats = {
  dppScans: number;
  countryCount: number;
  co2Kg: number;
};

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`.replace(".0k", "k");
  return n.toLocaleString();
}

export function ManifestoSection({ stats }: { stats?: ManifestoStats }) {
  // Subtle parallax on the background photograph — moves 60px slower than the
  // page scroll over the section's height. Eye-perception of depth, no commit.
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  // Default fallback values if stats fetch fails — clearly modest to avoid
  // overclaiming when the API is unreachable.
  const safe = {
    dppScans: stats?.dppScans ?? 0,
    countryCount: stats?.countryCount ?? 0,
    co2Kg: stats?.co2Kg ?? 0,
  };

  return (
    <section ref={ref} className="relative overflow-hidden bg-white py-20 sm:py-28 lg:py-36">
      {/* Background photo, parallax-shifted */}
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-x-0 -top-[8%] -bottom-[8%]"
      >
        <Image
          src="/v3-assets/manifesto.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-white/30" />
      </motion.div>

      <div className="relative mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-aqua sm:text-[11px]">
            Why ENVRT
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="mt-6 font-manrope text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.02em] text-envrt-ink sm:mt-8 sm:text-4xl lg:text-[3rem]">
            Compliance is the floor. The ceiling is a passport a customer
            actually wants to scan.
          </p>
        </FadeUp>
        <FadeUp delay={0.22}>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-envrt-charcoal/70 sm:mt-8 sm:text-base lg:text-lg">
            Every garment carries a Digital Product Passport that satisfies
            EU ESPR and rewards the customer who picks it up. Audit-grade
            data underneath. Editorial finish on top.
          </p>
        </FadeUp>

        {/* Live ticker — small strip with platform stats */}
        <FadeUp delay={0.32}>
          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-envrt-ink/8 pt-6 sm:mt-14 sm:gap-x-7">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-aqua sm:text-[11px]">
              <span
                aria-hidden
                className="relative inline-flex h-1.5 w-1.5 items-center justify-center"
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-envrt-aqua opacity-75" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-envrt-aqua" />
              </span>
              Live
            </span>
            <Stat value={`${formatCompact(safe.dppScans)}+`} label="passports served" />
            <Sep />
            <Stat value={`${safe.countryCount}`} label="countries" />
            <Sep />
            <Stat value={`${formatCompact(safe.co2Kg)}`} unit="kg" label="CO₂e tracked" />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function Stat({ value, unit, label }: { value: string; unit?: string; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 text-xs text-envrt-charcoal/70 sm:text-sm">
      <span className="font-manrope text-base font-semibold tracking-tight text-envrt-ink sm:text-lg">
        {value}
        {unit && (
          <span className="ml-0.5 text-[10px] font-medium text-envrt-muted sm:text-xs">
            {unit}
          </span>
        )}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-envrt-charcoal/55 sm:text-[11px]">
        {label}
      </span>
    </span>
  );
}

function Sep() {
  return (
    <span aria-hidden className="hidden h-3 w-px bg-envrt-ink/15 sm:inline-block" />
  );
}

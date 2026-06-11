"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";
import { Eyebrow, SECTION_SPRING, SectionCorners } from "./_shared";

// Polaroid stack — sticky 100vh window with five photo cards that fly in
// from below as scroll progresses, fanning into a centred stack like a
// research-notebook reference spread. Each polaroid corresponds to a
// lifecycle stage; alongside the stack, a CO₂ + water ticker counts up
// using the real Hoodie 0509-1882 values, so the visual logic of
// "stages stacking up" maps onto the running impact total.
//
// The five polaroid stages consolidate the six anatomy lifecycle stages:
//   Fibre, Yarn, Fabric (= Fabric + Dyeing), Assembly, Finished (= Transport).
// Dyeing is the water-heavy stage so its volume is folded into Fabric here.

type Polaroid = {
  index: string;
  stage: string;
  note: string;
  src: string;
  alt: string;
  finalRotate: number;
  finalX: number; // px offset from centre
  finalY: number; // px offset from centre
  // Cumulative running totals — what the ticker reads AFTER this
  // polaroid has fully arrived in the stack.
  cumCo2Kg: number;
  cumWaterL: number;
};

const POLAROIDS: Polaroid[] = [
  {
    index: "01",
    stage: "Fibre",
    note: "Raw fibre, density and origin",
    src: "/v3-assets/story-fabric.jpg",
    alt: "Cream fabric texture, raw fibre",
    finalRotate: -10,
    finalX: -120,
    finalY: -10,
    cumCo2Kg: 0.48,
    cumWaterL: 800,
  },
  {
    index: "02",
    stage: "Yarn",
    note: "Spun thread, dyed in tier",
    src: "/v3-assets/provenance-loom.jpg",
    alt: "Coloured loom threads",
    finalRotate: -5,
    finalX: -60,
    finalY: 6,
    cumCo2Kg: 2.25,
    cumWaterL: 1050,
  },
  {
    index: "03",
    stage: "Fabric",
    note: "Knit, finish, dye",
    src: "/v3-assets/folded-clothes.jpg",
    alt: "Folded knitwear",
    finalRotate: 0,
    finalX: 0,
    finalY: 0,
    cumCo2Kg: 7.05,
    cumWaterL: 6380,
  },
  {
    index: "04",
    stage: "Assembly",
    note: "Cut, sew, trims",
    src: "/v3-assets/manifesto.jpg",
    alt: "Sewing machine operator on the assembly floor",
    finalRotate: 6,
    finalX: 60,
    finalY: 4,
    cumCo2Kg: 7.38,
    cumWaterL: 6470,
  },
  {
    index: "05",
    stage: "Finished",
    note: "Stitched, tagged, shipped",
    src: "/v3-assets/cta-texture.jpg",
    alt: "Stack of finished knit garments",
    finalRotate: 11,
    finalX: 120,
    finalY: -8,
    cumCo2Kg: 7.45,
    cumWaterL: 6477,
  },
];

// Each polaroid's scroll window. start = previous stagger; end = start + window.
const ENTRY_WINDOW = 0.18;
const ENTRY_STAGGER = 0.12;

// Build the ticker's transform input/output pairs from the polaroid
// arrival endpoints. Before stage 1 arrives: 0. After stage 5 arrives:
// final total, held for the rest of the section.
const TICKER_INPUT = [
  0,
  ...POLAROIDS.map((_, i) => i * ENTRY_STAGGER + ENTRY_WINDOW),
  1,
] as const;
const TICKER_CO2 = [0, ...POLAROIDS.map((p) => p.cumCo2Kg), POLAROIDS[POLAROIDS.length - 1].cumCo2Kg] as const;
const TICKER_WATER = [0, ...POLAROIDS.map((p) => p.cumWaterL), POLAROIDS[POLAROIDS.length - 1].cumWaterL] as const;

export function PolaroidStackSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: rawProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Shared smooth-scroll spring used across all v3 scroll-pinned sections.
  const progress = useSpring(rawProgress, SECTION_SPRING);

  // Cumulative ticker values — interpolate between stage arrival points.
  const co2 = useTransform(progress, [...TICKER_INPUT], [...TICKER_CO2]);
  const water = useTransform(progress, [...TICKER_INPUT], [...TICKER_WATER]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-envrt-brand-vista"
      style={{ height: "360vh", overflowX: "clip" }}
    >
      <SectionCorners left="ENVRT/LAB" right="Hoodie 0509-1882" />

      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-5 py-6 sm:px-8 lg:px-16 lg:py-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mx-auto max-w-2xl text-center">
            <FadeUp>
              <Eyebrow>Our LCA engine</Eyebrow>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h2 className="mt-3 font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-[2.5rem]">
                We wrote the engine.{" "}
                <span className="text-envrt-brand-black/40">
                  Every kilo, every litre, calculated in-house.
                </span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.16}>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-envrt-brand-black/65 sm:text-base">
                EU PEF, ISO 14040 and AWARE water scarcity, all in code we
                own. Below is the live cradle-to-gate calculation for
                Hoodie 0509-1882.
              </p>
            </FadeUp>
          </div>

          {/* Two-column on lg: stack on left, ticker on right. Stacks on
              mobile + tablet with the ticker dropping below the polaroids. */}
          <div className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-[1fr_300px] lg:items-center lg:gap-10">
            {/* Stack stage */}
            <div className="relative mx-auto h-[360px] w-full max-w-[520px] sm:h-[420px]">
              {POLAROIDS.map((p, i) => (
                <PolaroidCard
                  key={p.index}
                  polaroid={p}
                  progress={progress}
                  start={i * ENTRY_STAGGER}
                  end={i * ENTRY_STAGGER + ENTRY_WINDOW}
                  zIndex={i + 1}
                />
              ))}
            </div>

            {/* Ticker */}
            <Ticker co2={co2} water={water} />
          </div>

          {/* Footer — credits the methodology + invites readers to the
              full Lab breakdown. Anchors the section's "in-house engine"
              claim with named, citeable standards rather than just words. */}
          <FadeUp delay={0.24}>
            <div className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-between sm:gap-5">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                <FactorChip>EU PEF</FactorChip>
                <FactorChip>ISO 14040</FactorChip>
                <FactorChip>AWARE</FactorChip>
                <FactorChip>Ecobalyse</FactorChip>
              </div>
              <Link
                href="/preview/v3/lab"
                className="group inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[11px]"
              >
                See the methodology
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function FactorChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-envrt-brand-black/15 bg-white/70 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/70 backdrop-blur sm:text-[11px]">
      {children}
    </span>
  );
}

function PolaroidCard({
  polaroid,
  progress,
  start,
  end,
  zIndex,
}: {
  polaroid: Polaroid;
  progress: MotionValue<number>;
  start: number;
  end: number;
  zIndex: number;
}) {
  // Polaroid enters from below the viewport and lands at finalX/finalY
  // with finalRotate. y starts at 600px (well below the stack), rotation
  // starts at -25° (looks tossed onto the stack), opacity 0 → 1.
  const y = useTransform(progress, [start, end], [600, polaroid.finalY]);
  const x = useTransform(progress, [start, end], [0, polaroid.finalX]);
  const rotate = useTransform(progress, [start, end], [-25, polaroid.finalRotate]);
  const opacity = useTransform(progress, [start, start + 0.02], [0, 1]);

  return (
    <motion.div
      style={{ x, y, rotate, opacity, zIndex }}
      className="absolute left-1/2 top-1/2 -ml-[110px] -mt-[140px] sm:-ml-[130px] sm:-mt-[170px]"
    >
      <div className="w-[220px] rounded-sm bg-white p-3 pb-5 shadow-[0_24px_50px_-18px_rgba(14,14,14,0.35)] ring-1 ring-envrt-brand-black/8 sm:w-[260px] sm:p-4 sm:pb-6">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={polaroid.src}
            alt={polaroid.alt}
            fill
            sizes="(min-width: 640px) 260px, 220px"
            className="object-cover"
          />
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-2 px-1 sm:mt-4">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine">
            {polaroid.index} · {polaroid.stage}
          </span>
        </div>
        <p className="mt-1 px-1 font-mono text-[10px] uppercase tracking-[0.14em] text-envrt-brand-black/55">
          {polaroid.note}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Ticker ──────────────────────────────────────────────────────────────
// Direct DOM mutation per frame via useMotionValueEvent, same pattern as
// NumbersSection.CountUp. React never re-renders, the text node updates
// in place. tabular-nums + display font keeps the digits steady so the
// number reads as a register, not a flickering count.

function Ticker({
  co2,
  water,
}: {
  co2: MotionValue<number>;
  water: MotionValue<number>;
}) {
  const co2Ref = useRef<HTMLSpanElement>(null);
  const waterRef = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(co2, "change", (v) => {
    if (co2Ref.current) co2Ref.current.textContent = v.toFixed(2);
  });
  useMotionValueEvent(water, "change", (v) => {
    if (waterRef.current) {
      waterRef.current.textContent = Math.round(v).toLocaleString();
    }
  });

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1 lg:gap-5">
      <Metric
        label="CO₂e"
        sub="kg, cradle-to-gate"
        valueRef={co2Ref}
        initial="0.00"
        unit="kg"
      />
      <Metric
        label="Water · AWARE"
        sub="litres, water scarcity"
        valueRef={waterRef}
        initial="0"
        unit="L"
      />
    </div>
  );
}

function Metric({
  label,
  sub,
  valueRef,
  initial,
  unit,
}: {
  label: string;
  sub: string;
  valueRef: React.RefObject<HTMLSpanElement>;
  initial: string;
  unit: string;
}) {
  return (
    <div className="rounded-2xl border border-envrt-brand-black/12 bg-white/75 p-4 backdrop-blur sm:p-5 lg:p-6">
      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[10px]">
        {label}
      </p>
      <p className="mt-2 flex items-baseline gap-1.5 font-display tabular-nums leading-none tracking-[-0.02em] text-envrt-brand-black">
        <span
          ref={valueRef}
          className="text-3xl font-semibold sm:text-4xl lg:text-[2.75rem]"
        >
          {initial}
        </span>
        <span className="text-base font-medium text-envrt-brand-black/55 sm:text-lg">
          {unit}
        </span>
      </p>
      <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-envrt-brand-black/45 sm:text-[10px]">
        {sub}
      </p>
    </div>
  );
}

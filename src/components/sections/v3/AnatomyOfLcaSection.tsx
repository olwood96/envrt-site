"use client";

import { useEffect, useRef, useState } from "react";
import {
  easeInOut,
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import type { MotionValue } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";
import { Eyebrow, SECTION_SPRING, SectionCorners } from "./_shared";

// Anatomy of the in-house LCA: horizontal pipeline rail + a card track
// below that slides right-to-left in lockstep. Real Hoodie 0509-1882
// stage breakdown. Equation column intentionally omitted on the homepage
// (full methodology lives on the dedicated Lab page).

type Stage = {
  index: string;
  name: string;
  process: string;
  inputs: string;
  co2e: number;
  cx: number; // 0-100, position on the horizontal rail
  activation: number;
  // Mobile uses a tighter scroll window so the last card lands centred
  // earlier in the section, leaving plenty of dwell before the sticky pin
  // releases. Without this card 6 only finishes centring at ~74% of scroll,
  // which on a 500vh section is right against the pin break.
  mobileActivation: number;
};

// Rail nodes are spaced evenly: cx[i] = 8 + i * 17.2, so all six gaps
// across the 86% rail span are identical. Don't hand-tune individual cx
// values, the eye picks up even the slightest unevenness.
const STAGES: Stage[] = [
  {
    index: "01",
    name: "Fibre",
    process: "Raw fibre extraction",
    inputs: "Organic cotton blend",
    co2e: 0.48,
    cx: 8,
    activation: 0.10,
    mobileActivation: 0.06,
  },
  {
    index: "02",
    name: "Yarn",
    process: "Spinning, twist, hank prep",
    inputs: "Spun in Turkey",
    co2e: 1.77,
    cx: 25.2,
    activation: 0.22,
    mobileActivation: 0.16,
  },
  {
    index: "03",
    name: "Fabric",
    process: "Knit, weave, finishing",
    inputs: "Knit and finish",
    co2e: 0.62,
    cx: 42.4,
    activation: 0.34,
    mobileActivation: 0.26,
  },
  {
    index: "04",
    name: "Dyeing",
    process: "Reactive dye, water heating",
    inputs: "Water-heavy stage",
    co2e: 4.18,
    cx: 59.6,
    activation: 0.46,
    mobileActivation: 0.36,
  },
  {
    index: "05",
    name: "Assembly",
    process: "Cut, sew, trims",
    inputs: "Sewn in Portugal",
    co2e: 0.33,
    cx: 76.8,
    activation: 0.58,
    mobileActivation: 0.46,
  },
  {
    index: "06",
    name: "Transport",
    process: "Tier-by-tier, mode-weighted",
    inputs: "Turkey → Portugal, 29,500 km",
    co2e: 0.07,
    cx: 94,
    activation: 0.70,
    mobileActivation: 0.56,
  },
];

const STAGE_TOTAL = STAGES.reduce((sum, s) => sum + s.co2e, 0);

const RAIL_START = STAGES[0].cx;
const RAIL_END = STAGES[STAGES.length - 1].cx;
const RAIL_SPAN = RAIL_END - RAIL_START;

const STATS = [
  { value: "EU PEF", label: "Product Environmental Footprint", since: "Methodology" },
  { value: "ISO 14040", label: "Lifecycle assessment standard", since: "Compliance" },
  { value: "AWARE", label: "UN water scarcity model", since: "Water" },
];

// ─── Section root ─────────────────────────────────────────────────────────

export function AnatomyOfLcaSection() {
  return (
    <section
      className="relative bg-envrt-brand-vista text-envrt-brand-black"
      style={{ overflowX: "clip" }}
    >
      <SectionCorners left="ENVRT/LAB" right="IN-HOUSE LCA" />

      {/* Specimen-jar accent — small looping loom video at top-right of the
          section. Sits outside the sticky inner so it doesn't affect the
          pinned card track. Desktop only — saves bytes on mobile and the
          sticky inner is already dense at narrow widths. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-6 top-6 z-20 hidden lg:block"
      >
        <div className="relative h-28 w-40 overflow-hidden rounded-xl ring-1 ring-envrt-brand-black/15 shadow-[0_18px_30px_-18px_rgba(14,14,14,0.35)] xl:h-32 xl:w-48">
          <video
            src="/v3-assets/videos/loom-loom.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-1.5 left-2 rounded-md bg-envrt-brand-black/65 px-1.5 py-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.18em] text-white">
            Live · ENVRT/LAB
          </span>
        </div>
      </div>

      <DesktopAnatomy />
      <MobileAnatomy />
    </section>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────

function Header() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <FadeUp>
        <Eyebrow>Our USP</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-envrt-brand-black sm:text-4xl lg:text-[3rem]">
          We wrote the engine.{" "}
          <span className="text-envrt-brand-black/40">
            Line by line, stage by stage.
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-envrt-brand-black/65 sm:mt-5 sm:text-base">
          EU PEF, ISO 14040 and AWARE water scarcity, all in code we own.
          No third-party APIs, no black boxes. The breakdown below is live,
          from Hoodie 0509-1882.
        </p>
      </FadeUp>
    </div>
  );
}

function Stats() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      {STATS.map((s) => (
        <div
          key={s.value}
          className="flex items-center justify-between rounded-xl border border-envrt-brand-black/12 bg-white/60 px-4 py-3.5 backdrop-blur sm:px-5 sm:py-4"
        >
          <div>
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-envrt-brand-ultramarine sm:text-[10px]">
              {s.since}
            </p>
            <p className="mt-1 font-display text-base font-semibold leading-none tracking-[-0.01em] text-envrt-brand-black sm:text-lg">
              {s.value}
            </p>
          </div>
          <span className="ml-3 text-right text-[11px] leading-snug text-envrt-brand-black/55 sm:text-xs">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function ClosingTag() {
  return (
    <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-5">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-envrt-brand-black/45 sm:text-[11px]">
        Our own calculation engine
      </p>
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
  );
}

// ─── Pipeline (HTML circle nodes, no SVG ovals) ───────────────────────────

function Pipeline({
  progress,
  activeIndex,
  windowStart,
  windowEnd,
}: {
  progress: MotionValue<number>;
  activeIndex: number;
  windowStart: number;
  windowEnd: number;
}) {
  // 0 → 1 fill ratio across the rail span
  const fillRatio = useTransform(
    progress,
    [windowStart, windowEnd],
    [0, 1],
    { ease: [easeInOut] },
  );
  // Convert ratio → pixel-precise width on the rail using its span
  const fillWidthRaw = useTransform(fillRatio, (v) => v * RAIL_SPAN);
  const fillWidth = useMotionTemplate`${fillWidthRaw}%`;

  return (
    <div className="relative h-8 w-full">
      {/* Static rail */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 h-px -translate-y-1/2 bg-envrt-brand-black/14"
        style={{ left: `${RAIL_START}%`, width: `${RAIL_SPAN}%` }}
      />

      {/* Progress fill */}
      <motion.span
        aria-hidden
        style={{ left: `${RAIL_START}%`, width: fillWidth }}
        className="pointer-events-none absolute top-1/2 h-px -translate-y-1/2 bg-envrt-brand-ultramarine"
      />

      {/* HTML circle nodes — always render as proper circles */}
      {STAGES.map((stage, i) => (
        <PipelineNode
          key={stage.index}
          stage={stage}
          reached={i <= activeIndex}
          active={i === activeIndex}
        />
      ))}
    </div>
  );
}

function PipelineNode({
  stage,
  reached,
  active,
}: {
  stage: Stage;
  reached: boolean;
  active: boolean;
}) {
  return (
    <div
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${stage.cx}%` }}
    >
      <div className="relative flex h-3 w-3 items-center justify-center">
        {active && (
          <span
            aria-hidden
            className="absolute inset-[-4px] animate-ping rounded-full bg-envrt-brand-ultramarine/25"
          />
        )}
        <span
          className={`relative block h-2 w-2 rounded-full border border-envrt-brand-ultramarine transition-colors duration-300 ${
            reached ? "bg-envrt-brand-ultramarine" : "bg-white"
          }`}
        />
      </div>
    </div>
  );
}

function PipelineLabels({
  activeIndex,
  variant = "desktop",
}: {
  activeIndex: number;
  variant?: "desktop" | "mobile";
}) {
  // Mobile shows ONLY the index numbers under each dot, no stage names —
  // names like "Assembly" and "Transport" crash into each other at narrow
  // widths. The active stage name is shown separately in a centred label
  // above the cards (see ActiveStageLabel).
  if (variant === "mobile") {
    return (
      <div className="relative mt-3 h-5">
        {STAGES.map((s, i) => (
          <p
            key={s.index}
            className={`absolute -translate-x-1/2 text-center font-mono text-[10px] font-semibold tracking-[0.18em] transition-colors duration-300 ${
              i <= activeIndex
                ? "text-envrt-brand-ultramarine"
                : "text-envrt-brand-black/35"
            }`}
            style={{ left: `${s.cx}%` }}
          >
            {s.index}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="relative mt-3 h-10">
      {STAGES.map((s, i) => (
        <div
          key={s.index}
          className="absolute -translate-x-1/2 text-center"
          style={{ left: `${s.cx}%` }}
        >
          <p
            className={`font-mono text-[10px] font-semibold tracking-[0.18em] transition-colors duration-300 ${
              i <= activeIndex
                ? "text-envrt-brand-ultramarine"
                : "text-envrt-brand-black/35"
            }`}
          >
            {s.index}
          </p>
          <p
            className={`mt-0.5 font-display text-sm font-semibold tracking-[-0.01em] transition-colors duration-300 sm:text-base ${
              i <= activeIndex
                ? "text-envrt-brand-black"
                : "text-envrt-brand-black/35"
            }`}
          >
            {s.name}
          </p>
        </div>
      ))}
    </div>
  );
}

// Mobile-only: shows the active stage name in a centred row beneath the
// numbered pipeline. Reads as a clear focal point without the label-crash
// problem of placing names under every dot.
function ActiveStageLabel({ activeIndex }: { activeIndex: number }) {
  const stage = STAGES[activeIndex] ?? STAGES[0];
  return (
    <div className="mt-4 flex items-baseline justify-center gap-3">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine">
        Stage {stage.index}
      </span>
      <span
        key={stage.index}
        className="font-display text-lg font-semibold tracking-[-0.01em] text-envrt-brand-black"
      >
        {stage.name}
      </span>
    </div>
  );
}

// ─── Stage card ───────────────────────────────────────────────────────────

function StageCard({
  stage,
  size,
}: {
  stage: Stage;
  size: "desktop" | "mobile";
}) {
  const fillPctOfTotal = (stage.co2e / STAGE_TOTAL) * 100;

  const pad = size === "desktop" ? "p-7 lg:p-8" : "p-5";
  const headingSize = size === "desktop" ? "text-xl lg:text-2xl" : "text-base";
  const processSize = size === "desktop" ? "text-sm lg:text-base" : "text-[13px]";
  const inputsSize = size === "desktop" ? "text-base lg:text-lg" : "text-sm";
  const valueSize = size === "desktop" ? "text-2xl lg:text-3xl" : "text-lg";

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border border-envrt-brand-black/12 bg-white/75 backdrop-blur ${pad}`}
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine lg:text-[11px]">
          Stage {stage.index}
        </span>
        <span className="h-px flex-1 bg-envrt-brand-black/12" />
        <span
          className={`font-display font-semibold tracking-[-0.01em] text-envrt-brand-black ${headingSize}`}
        >
          {stage.name}
        </span>
      </div>

      <p className={`mt-3 text-envrt-brand-black/55 ${processSize}`}>
        {stage.process}
      </p>
      <p
        className={`mt-3 font-display font-medium leading-snug tracking-[-0.01em] text-envrt-brand-black ${inputsSize}`}
      >
        {stage.inputs}
      </p>

      <div className="mt-auto pt-6">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-black/55 lg:text-[11px]">
            CO₂e contribution
          </span>
          <span
            className={`font-display font-semibold tracking-[-0.01em] text-envrt-brand-black ${valueSize}`}
          >
            {stage.co2e.toFixed(2)} kg
          </span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-envrt-brand-black/8">
          <div
            className="h-full rounded-full bg-envrt-brand-ultramarine transition-all duration-500"
            style={{ width: `${fillPctOfTotal}%` }}
          />
        </div>
        <p className="mt-1 text-right font-mono text-[9px] uppercase tracking-[0.16em] text-envrt-brand-black/45 lg:text-[10px]">
          {fillPctOfTotal.toFixed(0)}% of total
        </p>
      </div>
    </div>
  );
}

// ─── Desktop layout ───────────────────────────────────────────────────────

function DesktopAnatomy() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: rawProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Spring-smoothed progress drives every transform in this section.
  // Same config as Scatter and every other v3 scroll-pinned section, so
  // the whole site shares one feel: stiff enough to track deliberate
  // scroll, damped enough to never overshoot, gentle on fast flicks.
  const scrollYProgress = useSpring(rawProgress, SECTION_SPRING);

  const windowStart = STAGES[0].activation - 0.04;
  const windowEnd = STAGES[STAGES.length - 1].activation + 0.04;

  // Active index for label / node colour updates
  const activeIndexMv = useTransform(scrollYProgress, (p) => {
    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (p >= STAGES[i].activation - 0.04) return i;
    }
    return 0;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(
    () => activeIndexMv.on("change", (v) => setActiveIndex(v)),
    [activeIndexMv],
  );

  // Horizontal track — translates left as scroll progresses. Cards 60% of
  // VIEWPORT width with 20vw padding-left so the first card starts centred,
  // and translateX goes from 0 to -(N-1)*60vw + the px gap between them to
  // bring each card in turn. The gap-4 = 16px between cards must be added
  // to the translate, otherwise the final card lands 80px off centre.
  // Track is intentionally pulled outside the max-w-1320px container so it
  // spans the full viewport, breaking up the rigid central column.
  const trackProgress = useTransform(
    scrollYProgress,
    [windowStart, windowEnd],
    [0, 1],
    { ease: [easeInOut] },
  );
  const trackXVw = useTransform(
    trackProgress,
    (p) => -60 * (STAGES.length - 1) * p,
  );
  const trackXPx = useTransform(
    trackProgress,
    (p) => -16 * (STAGES.length - 1) * p,
  );
  const trackTransform = useMotionTemplate`translate3d(calc(${trackXVw}vw + ${trackXPx}px), 0, 0)`;

  return (
    <div
      ref={sectionRef}
      className="relative hidden lg:block"
      style={{ height: "540vh" }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center bg-envrt-brand-vista py-12">
        {/* Header + pipeline inside the constrained max-w container */}
        <div className="mx-auto w-full max-w-[1320px] px-16">
          <Header />

          <div className="mx-auto mt-14 max-w-[1100px]">
            <Pipeline
              progress={scrollYProgress}
              activeIndex={activeIndex}
              windowStart={windowStart}
              windowEnd={windowEnd}
            />
            <PipelineLabels activeIndex={activeIndex} />
          </div>
        </div>

        {/* Card track — full viewport width, breaks out of the container */}
        <div className="mt-10 overflow-hidden">
          <motion.div
            style={{ transform: trackTransform, willChange: "transform" }}
            className="flex gap-4 pl-[20vw] pr-[20vw]"
          >
            {STAGES.map((stage) => (
              <div key={stage.index} className="w-[60vw] flex-shrink-0">
                <StageCard stage={stage} size="desktop" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Stats + closing tag back inside the constrained container */}
        <div className="mx-auto w-full max-w-[1320px] px-16">
          <div className="mt-10">
            <Stats />
          </div>
          <div className="mt-8">
            <ClosingTag />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile layout ────────────────────────────────────────────────────────

function MobileAnatomy() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: rawProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Spring-smoothed progress. Same config as Scatter so the whole site
  // shares one smooth-scroll feel.
  const scrollYProgress = useSpring(rawProgress, SECTION_SPRING);

  // Mobile uses a compressed activation window (mobileActivation) so the
  // final card lands centred at scrollYProgress ≈ 0.6 instead of 0.74,
  // leaving 40% of the section as dwell on the centred final card before
  // the sticky pin releases.
  const windowStart = STAGES[0].mobileActivation - 0.04;
  const windowEnd = STAGES[STAGES.length - 1].mobileActivation + 0.04;

  const activeIndexMv = useTransform(scrollYProgress, (p) => {
    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (p >= STAGES[i].mobileActivation - 0.04) return i;
    }
    return 0;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(
    () => activeIndexMv.on("change", (v) => setActiveIndex(v)),
    [activeIndexMv],
  );

  // Track translates in both vw and px so the gap-3 (12px) between cards
  // is included in the centring math, otherwise card 6 lands 60px off
  // centre.
  const trackProgress = useTransform(
    scrollYProgress,
    [windowStart, windowEnd],
    [0, 1],
    { ease: [easeInOut] },
  );
  const trackXVw = useTransform(
    trackProgress,
    (p) => -85 * (STAGES.length - 1) * p,
  );
  const trackXPx = useTransform(
    trackProgress,
    (p) => -12 * (STAGES.length - 1) * p,
  );
  const trackTransform = useMotionTemplate`translate3d(calc(${trackXVw}vw + ${trackXPx}px), 0, 0)`;

  return (
    <div
      ref={sectionRef}
      className="relative lg:hidden"
      style={{ height: "500vh" }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center bg-envrt-brand-vista py-10">
        <div className="mx-auto w-full px-5 sm:px-8">
          <Header />

          <div className="mt-10">
            <Pipeline
              progress={scrollYProgress}
              activeIndex={activeIndex}
              windowStart={windowStart}
              windowEnd={windowEnd}
            />
            <PipelineLabels activeIndex={activeIndex} variant="mobile" />
            <ActiveStageLabel activeIndex={activeIndex} />
          </div>

          <div className="mt-6 overflow-hidden">
            <motion.div
              style={{ transform: trackTransform, willChange: "transform" }}
              className="flex gap-3 pl-[7.5vw] pr-[7.5vw]"
            >
              {STAGES.map((stage) => (
                <div key={stage.index} className="w-[85vw] flex-shrink-0">
                  <StageCard stage={stage} size="mobile" />
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-8">
            <Stats />
          </div>
          <div className="mt-6">
            <ClosingTag />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Fragment, useRef } from "react";
import {
  easeInOut,
  easeOut,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";

// "We built the engine" — anatomy of the in-house LCA. The CO₂e equation for
// Hoodie 0509-1882 builds up term by term as the user scrolls. Six stage
// cards travel through view in lockstep, exposing the inputs and the
// factor source behind each segment.

// ─── Real Hoodie 0509-1882 stage breakdown ────────────────────────────────

type Stage = {
  index: string;
  name: string;
  process: string;
  inputs: string;
  co2e: number; // kg CO₂e per stage (real envrt_lab values)
  equation: string;
  activation: number; // scroll progress at which this stage activates
};

const STAGES: Stage[] = [
  {
    index: "01",
    name: "Fibre",
    process: "Spinning-grade fibre, raw material extraction",
    inputs: "80% Organic cotton · 18% Recycled polyester · 2% Elastane",
    co2e: 0.48,
    equation: "mass × EF_fibre",
    activation: 0.12,
  },
  {
    index: "02",
    name: "Yarn",
    process: "Spinning, twist, hank prep",
    inputs: "Spinning energy · waste rate · Turkey grid mix",
    co2e: 1.77,
    equation: "mass × EF_spin × grid",
    activation: 0.24,
  },
  {
    index: "03",
    name: "Fabric",
    process: "Knit, weave, finishing",
    inputs: "Knit structure · loss factor · finishing chemistry",
    co2e: 0.62,
    equation: "mass × EF_fabric × loss",
    activation: 0.36,
  },
  {
    index: "04",
    name: "Dyeing",
    process: "Reactive dye bath, water heating, fixing",
    inputs: "Dye process · water grid · AWARE Turkey factor",
    co2e: 4.18,
    equation: "mass × EF_dye + H₂O × AWARE",
    activation: 0.48,
  },
  {
    index: "05",
    name: "Assembly",
    process: "Cut, sew, trims, finishing",
    inputs: "Sew energy · trims · Portugal grid mix",
    co2e: 0.33,
    equation: "mass × EF_assy × grid",
    activation: 0.60,
  },
  {
    index: "06",
    name: "Transport",
    process: "Tier-by-tier distance, mode-weighted",
    inputs: "Turkey → Portugal · 29,500 km · road + sea",
    co2e: 0.07,
    equation: "Σ(d × mode_EF)",
    activation: 0.72,
  },
];

const STAGE_TOTAL = STAGES.reduce((sum, s) => sum + s.co2e, 0);
const FINAL_ACTIVATION = 0.82;

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
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-6 z-10 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:left-6"
      >
        ENVRT/LAB
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-6 z-10 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:right-6"
      >
        IN-HOUSE LCA
      </span>

      <DesktopAnatomy />
      <MobileAnatomy />
    </section>
  );
}

// ─── Shared bits ──────────────────────────────────────────────────────────

function Header() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <FadeUp>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[11px]">
          Our USP
        </p>
        <h2 className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-[-0.02em] text-envrt-brand-black sm:text-4xl lg:text-[3rem]">
          We built the engine.{" "}
          <span className="text-envrt-brand-black/40">Not licensed it.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-envrt-brand-black/65 sm:mt-5 sm:text-base">
          Built against EU PEF and ISO 14040, with AWARE water scarcity baked
          in. Below is the live calculation for Hoodie 0509-1882. Watch it
          build, stage by stage.
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
    <p className="text-center font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-envrt-brand-black/45 sm:text-[11px]">
      ENVRT/LAB · proprietary calculation engine, not a third-party API
    </p>
  );
}

// ─── Equation builder ─────────────────────────────────────────────────────

function EquationBuilder({
  progress,
  variant,
}: {
  progress: MotionValue<number>;
  variant: "desktop" | "mobile";
}) {
  const finalOpacity = useTransform(
    progress,
    [FINAL_ACTIVATION - 0.05, FINAL_ACTIVATION],
    [0, 1],
    { ease: [easeOut] },
  );

  return (
    <div
      className={`rounded-2xl border border-envrt-brand-black/12 bg-white/70 backdrop-blur ${
        variant === "desktop" ? "p-6 lg:p-7" : "p-4 sm:p-5"
      }`}
    >
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine">
        Live calculation
      </p>
      <p className="mt-1 font-mono text-[10px] text-envrt-brand-black/55">
        Hoodie 0509-1882
      </p>

      <div
        className={`mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-2 font-mono leading-relaxed ${
          variant === "desktop" ? "text-base lg:text-lg" : "text-[13px] sm:text-sm"
        }`}
      >
        <span className="text-envrt-brand-black">CO₂e</span>
        <span className="text-envrt-brand-black/40">=</span>

        {STAGES.map((stage, i) => (
          <EquationTerm
            key={stage.name}
            stage={stage}
            progress={progress}
            isLast={i === STAGES.length - 1}
          />
        ))}

        <span className="text-envrt-brand-black/40">=</span>
        <motion.span
          style={{ opacity: finalOpacity }}
          className="font-display text-2xl font-semibold tracking-[-0.01em] text-envrt-brand-black lg:text-3xl"
        >
          {STAGE_TOTAL.toFixed(2)} kg
        </motion.span>
      </div>

      {/* Stage labels strip beneath, aligned to the terms above */}
      <div
        className={`mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-[9px] uppercase tracking-[0.16em] text-envrt-brand-black/40 ${
          variant === "desktop" ? "lg:text-[10px]" : ""
        }`}
      >
        <span className="opacity-0">CO₂e</span>
        <span className="opacity-0">=</span>
        {STAGES.map((stage, i) => (
          <Fragment key={stage.name}>
            <span>{stage.name}</span>
            {i < STAGES.length - 1 && <span className="opacity-0">+</span>}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function EquationTerm({
  stage,
  progress,
  isLast,
}: {
  stage: Stage;
  progress: MotionValue<number>;
  isLast: boolean;
}) {
  const termOpacity = useTransform(
    progress,
    [stage.activation - 0.03, stage.activation],
    [0, 1],
    { ease: [easeOut] },
  );

  return (
    <Fragment>
      <span className="relative">
        <span className="text-envrt-brand-black/20">?</span>
        <motion.span
          style={{ opacity: termOpacity }}
          className="absolute inset-0 font-semibold text-envrt-brand-ultramarine"
        >
          {stage.co2e.toFixed(2)}
        </motion.span>
      </span>
      {!isLast && <span className="text-envrt-brand-black/40">+</span>}
    </Fragment>
  );
}

// ─── Stage card ───────────────────────────────────────────────────────────

function StageCard({
  stage,
  progress,
  variant,
}: {
  stage: Stage;
  progress: MotionValue<number>;
  variant: "desktop" | "mobile";
}) {
  const activeAt = stage.activation;

  // active: 0 → 1 → 1 across a small range. Drives colour, opacity, bar fill.
  const active = useTransform(
    progress,
    [activeAt - 0.05, activeAt, activeAt + 0.10],
    [0, 1, 1],
    { ease: [easeOut, easeInOut] },
  );

  const cardOpacity = useTransform(active, (v) => 0.4 + 0.6 * v);

  const detailOpacity = useTransform(
    progress,
    [activeAt - 0.02, activeAt + 0.04],
    [0, 1],
    { ease: [easeOut] },
  );

  const fillPct = (stage.co2e / STAGE_TOTAL) * 100;

  return (
    <motion.div
      style={{ opacity: cardOpacity, willChange: "opacity" }}
      className={`flex h-full flex-col rounded-2xl border border-envrt-brand-black/12 bg-white/70 backdrop-blur ${
        variant === "desktop" ? "p-5" : "p-4"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine">
          {stage.index}
        </span>
        <span className="h-px flex-1 bg-envrt-brand-black/12" />
        <span className="font-display text-base font-semibold tracking-[-0.01em] text-envrt-brand-black sm:text-lg">
          {stage.name}
        </span>
      </div>

      <p className="mt-2 text-[12px] leading-snug text-envrt-brand-black/55 sm:text-[13px]">
        {stage.process}
      </p>

      <motion.p
        style={{ opacity: detailOpacity }}
        className="mt-3 text-[12px] leading-relaxed text-envrt-brand-black/70 sm:text-[13px]"
      >
        {stage.inputs}
      </motion.p>

      <motion.div
        style={{ opacity: detailOpacity }}
        className="mt-3 overflow-x-auto rounded-lg bg-envrt-brand-vista/80 px-2.5 py-1.5"
      >
        <code className="block whitespace-pre font-mono text-[10px] text-envrt-brand-black sm:text-[11px]">
          {stage.equation}
        </code>
      </motion.div>

      <div className="mt-auto pt-4">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-black/50">
            CO₂e
          </span>
          <span className="font-display text-lg font-semibold tracking-[-0.01em] text-envrt-brand-black sm:text-xl">
            {stage.co2e.toFixed(2)} kg
          </span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-envrt-brand-black/8">
          <motion.div
            style={{ scaleX: active, transformOrigin: "left" }}
            className="h-full rounded-full bg-envrt-brand-ultramarine"
          />
        </div>
        <p className="mt-1 text-right font-mono text-[9px] uppercase tracking-[0.16em] text-envrt-brand-black/40">
          {fillPct.toFixed(0)}% of total
        </p>
      </div>
    </motion.div>
  );
}

// ─── Desktop layout (scroll-pinned, horizontal stage track) ────────────────

function DesktopAnatomy() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Track slides from 0% to -83% (5/6) so each card centres in turn.
  const trackX = useTransform(
    scrollYProgress,
    [STAGES[0].activation - 0.02, STAGES[STAGES.length - 1].activation + 0.04],
    ["0%", `-${(100 / 6) * (STAGES.length - 1)}%`],
    { ease: [easeInOut] },
  );

  return (
    <div
      ref={sectionRef}
      className="relative hidden lg:block"
      style={{ height: "320vh" }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center bg-envrt-brand-vista py-12">
        <div className="mx-auto w-full max-w-[1320px] px-16">
          <Header />

          <div className="mt-10">
            <EquationBuilder progress={scrollYProgress} variant="desktop" />
          </div>

          {/* Horizontal track of 6 stage cards. 600% width → each card is
              100% of one viewport-card slot. Track translates left to bring
              each card into focus. */}
          <div className="mt-8 overflow-hidden">
            <motion.div
              style={{ x: trackX, willChange: "transform" }}
              className="flex w-[600%] gap-4"
            >
              {STAGES.map((stage) => (
                <div key={stage.index} className="w-[16.6667%]">
                  <StageCard
                    stage={stage}
                    progress={scrollYProgress}
                    variant="desktop"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          <ProgressDots progress={scrollYProgress} />

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

// ─── Mobile layout (scroll-pinned, horizontal stage track) ────────────────

function MobileAnatomy() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Each card 85vw + 12px gap. Translate left by stride × (count - 1).
  const trackX = useTransform(
    scrollYProgress,
    [STAGES[0].activation - 0.02, STAGES[STAGES.length - 1].activation + 0.04],
    ["0vw", `-${85 * (STAGES.length - 1)}vw`],
    { ease: [easeInOut] },
  );

  return (
    <div
      ref={sectionRef}
      className="relative lg:hidden"
      style={{ height: "320vh" }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center bg-envrt-brand-vista py-10">
        <div className="mx-auto w-full px-5 sm:px-8">
          <Header />

          <div className="mt-8">
            <EquationBuilder progress={scrollYProgress} variant="mobile" />
          </div>

          {/* Horizontal track. Each card is 85vw so the next card peeks in
              from the right edge, signalling there's more to come. */}
          <div className="mt-6 overflow-hidden">
            <motion.div
              style={{ x: trackX, willChange: "transform" }}
              className="flex gap-3"
            >
              {STAGES.map((stage) => (
                <div key={stage.index} className="w-[85vw] flex-shrink-0">
                  <StageCard
                    stage={stage}
                    progress={scrollYProgress}
                    variant="mobile"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          <ProgressDots progress={scrollYProgress} />

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

// ─── Progress dots ────────────────────────────────────────────────────────

function ProgressDots({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      {STAGES.map((stage) => (
        <ProgressDot key={stage.index} stage={stage} progress={progress} />
      ))}
    </div>
  );
}

function ProgressDot({
  stage,
  progress,
}: {
  stage: Stage;
  progress: MotionValue<number>;
}) {
  const active = useTransform(
    progress,
    [stage.activation - 0.03, stage.activation],
    [0, 1],
    { ease: [easeOut] },
  );
  const width = useTransform(active, (v) => `${8 + 14 * v}px`);
  const opacity = useTransform(active, (v) => 0.25 + 0.75 * v);
  const bgOpacity = useTransform(active, (v) => 0.25 + 0.75 * v);
  const bg = useMotionTemplate`rgb(62 0 255 / ${bgOpacity})`;

  return (
    <motion.span
      aria-hidden
      style={{ width, opacity, background: bg }}
      className="block h-1 rounded-full"
    />
  );
}

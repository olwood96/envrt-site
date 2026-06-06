"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  easeInOut,
  easeOut,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";

// "We built the engine" — anatomy of the in-house LCA. Refined horizontal
// pipeline: thin rail, six nodes, a progress fill that grows along the line
// as the user scrolls. Below it a single stage detail panel that swaps as
// each stage activates, with the equation typing itself out character by
// character. Mobile keeps the horizontal scroll dynamic the user asked for.

// ─── Real Hoodie 0509-1882 breakdown ──────────────────────────────────────

type Stage = {
  index: string;
  name: string;
  process: string;
  inputs: string;
  co2e: number; // kg CO₂e per stage
  equation: string;
  // Anchor x-position on the SVG pipeline, 0–100
  cx: number;
  // Scroll progress where the stage becomes active
  activation: number;
};

const STAGES: Stage[] = [
  {
    index: "01",
    name: "Fibre",
    process: "Raw fibre extraction",
    inputs: "80% Organic cotton · 18% Recycled polyester · 2% Elastane",
    co2e: 0.48,
    equation: "mass × EF_fibre",
    cx: 8,
    activation: 0.12,
  },
  {
    index: "02",
    name: "Yarn",
    process: "Spinning, twist, hank prep",
    inputs: "Spinning energy · waste rate · Turkey grid mix",
    co2e: 1.77,
    equation: "mass × EF_spin × grid",
    cx: 26,
    activation: 0.26,
  },
  {
    index: "03",
    name: "Fabric",
    process: "Knit, weave, finishing",
    inputs: "Knit structure · loss factor · finishing chemistry",
    co2e: 0.62,
    equation: "mass × EF_fabric × loss",
    cx: 44,
    activation: 0.40,
  },
  {
    index: "04",
    name: "Dyeing",
    process: "Reactive dye bath, water heating, fixing",
    inputs: "Dye process · water grid · AWARE Turkey factor",
    co2e: 4.18,
    equation: "mass × EF_dye + H₂O × AWARE",
    cx: 62,
    activation: 0.54,
  },
  {
    index: "05",
    name: "Assembly",
    process: "Cut, sew, trims, finishing",
    inputs: "Sew energy · trims · Portugal grid mix",
    co2e: 0.33,
    equation: "mass × EF_assy × grid",
    cx: 80,
    activation: 0.68,
  },
  {
    index: "06",
    name: "Transport",
    process: "Tier-by-tier distance, mode-weighted",
    inputs: "Turkey → Portugal · 29,500 km · road + sea",
    co2e: 0.07,
    equation: "Σ(d × mode_EF)",
    cx: 95,
    activation: 0.82,
  },
];

const STAGE_TOTAL = STAGES.reduce((sum, s) => sum + s.co2e, 0);

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

// ─── Shared ───────────────────────────────────────────────────────────────

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
          in. Below is the live calculation for Hoodie 0509-1882.
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

// ─── Typewriter ───────────────────────────────────────────────────────────
//
// Renders the supplied text up to floor(active × text.length) characters,
// with a soft blinking caret. `active` is a 0 → 1 motion value driven by
// scroll position around a stage's activation window. State is updated via
// useMotionValueEvent so the component re-renders only when the displayed
// character count changes.

function Typewriter({
  text,
  active,
}: {
  text: string;
  active: MotionValue<number>;
}) {
  const [shown, setShown] = useState("");

  useMotionValueEvent(active, "change", (latest) => {
    const n = Math.max(0, Math.min(text.length, Math.floor(latest * text.length)));
    setShown(text.slice(0, n));
  });

  return (
    <span>
      {shown}
      <span className="ml-[1px] inline-block w-[1ch] animate-pulse text-envrt-brand-ultramarine/70">
        ▍
      </span>
    </span>
  );
}

// ─── Pipeline (refined) ───────────────────────────────────────────────────
//
// Thin static rail + progressive ultramarine fill driven by scroll. Six
// nodes that go from outlined → filled when reached, with a soft pulse on
// the currently-active node. No travelling dot — the fill's leading edge
// indicates position, which reads as tidier and less cartoonish.

function Pipeline({
  progress,
  activeIndex,
}: {
  progress: MotionValue<number>;
  activeIndex: number;
}) {
  // Progress fill: 0 at first stage's activation, 1 at last stage's
  // activation. strokeDashoffset uses the inverse (1 → 0).
  const fillPct = useTransform(
    progress,
    [STAGES[0].activation - 0.04, STAGES[STAGES.length - 1].activation + 0.04],
    [0, 1],
    { ease: [easeInOut] },
  );
  const dashOffset = useTransform(fillPct, (v) => 1 - v);

  const railStart = STAGES[0].cx;
  const railEnd = STAGES[STAGES.length - 1].cx;
  const railSpan = railEnd - railStart;

  return (
    <div className="relative">
      <svg
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        className="h-[60px] w-full sm:h-[72px]"
      >
        {/* Static rail */}
        <line
          x1={railStart}
          x2={railEnd}
          y1="6"
          y2="6"
          stroke="rgb(14 14 14 / 0.14)"
          strokeWidth="0.4"
        />

        {/* Progress fill — stroke-dashoffset trick on a normalised path */}
        <motion.line
          x1={railStart}
          x2={railEnd}
          y1="6"
          y2="6"
          stroke="rgb(62 0 255)"
          strokeWidth="0.55"
          strokeLinecap="round"
          pathLength={1}
          style={{ strokeDasharray: 1, strokeDashoffset: dashOffset }}
        />

        {/* Nodes */}
        {STAGES.map((s, i) => (
          <PipelineNode
            key={s.index}
            stage={s}
            index={i}
            activeIndex={activeIndex}
            fillPct={fillPct}
            railStart={railStart}
            railSpan={railSpan}
          />
        ))}
      </svg>

      {/* Stage labels under the rail */}
      <div className="absolute inset-x-0 top-full -mt-2">
        <div className="relative">
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
      </div>
    </div>
  );
}

function PipelineNode({
  stage,
  index,
  activeIndex,
  fillPct,
  railStart,
  railSpan,
}: {
  stage: Stage;
  index: number;
  activeIndex: number;
  fillPct: MotionValue<number>;
  railStart: number;
  railSpan: number;
}) {
  // Node "reached" when the fill leading edge has passed its cx position.
  // We derive the reached state from fillPct directly so it stays in sync.
  const reached = useTransform(fillPct, (v) => {
    const localPos = (stage.cx - railStart) / railSpan;
    return v >= localPos - 0.01 ? 1 : 0;
  });

  const fill = useTransform(reached, (v) =>
    v >= 1 ? "rgb(62 0 255)" : "white",
  );
  const isActive = index === activeIndex;

  return (
    <g>
      {/* Active node pulse */}
      {isActive && (
        <motion.circle
          cx={stage.cx}
          cy="6"
          r="2.4"
          fill="rgb(62 0 255 / 0.15)"
          animate={{ r: [2.4, 3.2, 2.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <motion.circle
        cx={stage.cx}
        cy="6"
        r="1.4"
        style={{ fill }}
        stroke="rgb(62 0 255)"
        strokeWidth="0.45"
      />
    </g>
  );
}

// ─── Stage detail panel ───────────────────────────────────────────────────
//
// Shows the currently active stage's process, inputs, equation (typewriter)
// and contribution. Crossfades when the active stage changes via
// AnimatePresence, so the typewriter restarts fresh for each new stage.

function StageDetailPanel({
  progress,
  stage,
}: {
  progress: MotionValue<number>;
  stage: Stage;
}) {
  // Type window — equation types out over the first 0.10 of progress after
  // the stage activates.
  const typeActive = useTransform(
    progress,
    [stage.activation, stage.activation + 0.10],
    [0, 1],
    { ease: [easeOut] },
  );

  const fillPctOfTotal = (stage.co2e / STAGE_TOTAL) * 100;

  return (
    <motion.div
      key={stage.index}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-envrt-brand-black/12 bg-white/70 p-6 backdrop-blur lg:p-7"
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine">
          Stage {stage.index}
        </span>
        <span className="h-px flex-1 bg-envrt-brand-black/12" />
        <span className="font-display text-lg font-semibold tracking-[-0.01em] text-envrt-brand-black lg:text-xl">
          {stage.name}
        </span>
      </div>

      <p className="mt-3 text-sm text-envrt-brand-black/55">{stage.process}</p>
      <p className="mt-3 text-sm leading-relaxed text-envrt-brand-black/70">
        {stage.inputs}
      </p>

      {/* Equation typewriter */}
      <div className="mt-5 rounded-lg bg-envrt-brand-vista/80 px-4 py-3">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine/70">
          Equation
        </p>
        <code className="mt-1 block font-mono text-sm text-envrt-brand-black">
          <Typewriter text={stage.equation} active={typeActive} />
        </code>
      </div>

      {/* Contribution */}
      <div className="mt-5 flex items-baseline justify-between">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-black/55">
          CO₂e contribution
        </span>
        <span className="font-display text-xl font-semibold tracking-[-0.01em] text-envrt-brand-black">
          {stage.co2e.toFixed(2)} kg
        </span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-envrt-brand-black/8">
        <div
          className="h-full rounded-full bg-envrt-brand-ultramarine transition-all duration-500"
          style={{ width: `${fillPctOfTotal}%` }}
        />
      </div>
      <p className="mt-1 text-right font-mono text-[9px] uppercase tracking-[0.16em] text-envrt-brand-black/45">
        {fillPctOfTotal.toFixed(0)}% of total
      </p>
    </motion.div>
  );
}

// ─── Desktop ──────────────────────────────────────────────────────────────

function DesktopAnatomy() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Determine active stage from progress
  const activeIndexMv = useTransform(scrollYProgress, (p) => {
    // Each stage owns the window from its activation to the next stage's
    // activation. Before the first activates, the first stage is shown.
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

  return (
    <div
      ref={sectionRef}
      className="relative hidden lg:block"
      style={{ height: "280vh" }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center bg-envrt-brand-vista py-12">
        <div className="mx-auto w-full max-w-[1320px] px-16">
          <Header />

          <div className="mt-14">
            <Pipeline progress={scrollYProgress} activeIndex={activeIndex} />
          </div>

          <div className="mx-auto mt-16 max-w-2xl">
            <AnimatePresence mode="wait">
              <StageDetailPanel
                key={STAGES[activeIndex].index}
                progress={scrollYProgress}
                stage={STAGES[activeIndex]}
              />
            </AnimatePresence>
          </div>

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

// ─── Mobile (horizontal scroll-pinned) ────────────────────────────────────

function MobileAnatomy() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Track translates left so each card centres in turn. 85vw cards leave a
  // peek of the next card on the right edge, signalling more to come.
  const trackX = useTransform(
    scrollYProgress,
    [STAGES[0].activation - 0.04, STAGES[STAGES.length - 1].activation + 0.04],
    ["0vw", `-${85 * (STAGES.length - 1)}vw`],
    { ease: [easeInOut] },
  );

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

  return (
    <div
      ref={sectionRef}
      className="relative lg:hidden"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center bg-envrt-brand-vista py-10">
        <div className="mx-auto w-full px-5 sm:px-8">
          <Header />

          {/* Compact pipeline above the cards */}
          <div className="mt-10">
            <Pipeline progress={scrollYProgress} activeIndex={activeIndex} />
          </div>

          {/* Horizontal card track */}
          <div className="mt-12 overflow-hidden">
            <motion.div
              style={{ x: trackX, willChange: "transform" }}
              className="flex gap-3"
            >
              {STAGES.map((stage) => (
                <div key={stage.index} className="w-[85vw] flex-shrink-0">
                  <MobileStageCard
                    stage={stage}
                    progress={scrollYProgress}
                  />
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

function MobileStageCard({
  stage,
  progress,
}: {
  stage: Stage;
  progress: MotionValue<number>;
}) {
  const typeActive = useTransform(
    progress,
    [stage.activation, stage.activation + 0.10],
    [0, 1],
    { ease: [easeOut] },
  );

  const fillPctOfTotal = (stage.co2e / STAGE_TOTAL) * 100;

  return (
    <div className="rounded-2xl border border-envrt-brand-black/12 bg-white/70 p-5 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine">
          {stage.index}
        </span>
        <span className="h-px flex-1 bg-envrt-brand-black/12" />
        <span className="font-display text-base font-semibold tracking-[-0.01em] text-envrt-brand-black">
          {stage.name}
        </span>
      </div>

      <p className="mt-2 text-[13px] text-envrt-brand-black/55">
        {stage.process}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-envrt-brand-black/70">
        {stage.inputs}
      </p>

      <div className="mt-4 rounded-lg bg-envrt-brand-vista/80 px-3 py-2">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine/70">
          Equation
        </p>
        <code className="mt-1 block font-mono text-[12px] text-envrt-brand-black">
          <Typewriter text={stage.equation} active={typeActive} />
        </code>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-envrt-brand-black/55">
          CO₂e
        </span>
        <span className="font-display text-lg font-semibold tracking-[-0.01em] text-envrt-brand-black">
          {stage.co2e.toFixed(2)} kg
        </span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-envrt-brand-black/8">
        <div
          className="h-full rounded-full bg-envrt-brand-ultramarine transition-all duration-500"
          style={{ width: `${fillPctOfTotal}%` }}
        />
      </div>
      <p className="mt-1 text-right font-mono text-[9px] uppercase tracking-[0.16em] text-envrt-brand-black/45">
        {fillPctOfTotal.toFixed(0)}% of total
      </p>
    </div>
  );
}

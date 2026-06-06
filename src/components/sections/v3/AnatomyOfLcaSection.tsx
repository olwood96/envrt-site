"use client";

import { useEffect, useRef, useState } from "react";
import {
  easeInOut,
  easeOut,
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";

// "We built the engine" — anatomy of the in-house LCA. Refined horizontal
// pipeline (HTML circle nodes, no SVG ovals) with progressive fill, and a
// horizontal card track underneath that slides right-to-left in lockstep
// with the pipeline. Each card holds real Hoodie 0509-1882 stage data and
// types out its equation as it becomes active.

// ─── Real Hoodie 0509-1882 breakdown ──────────────────────────────────────

type Stage = {
  index: string;
  name: string;
  process: string;
  inputs: string;
  co2e: number;
  equation: string;
  cx: number; // 0-100, position on the horizontal rail
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
    cx: 94,
    activation: 0.82,
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

// ─── Pipeline (HTML circle nodes, no SVG ovals) ───────────────────────────

function Pipeline({
  progress,
  activeIndex,
}: {
  progress: MotionValue<number>;
  activeIndex: number;
}) {
  // 0 → 1 fill ratio across the rail span
  const fillRatio = useTransform(
    progress,
    [STAGES[0].activation - 0.04, STAGES[STAGES.length - 1].activation + 0.04],
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

function PipelineLabels({ activeIndex }: { activeIndex: number }) {
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

// ─── Stage card ───────────────────────────────────────────────────────────

function StageCard({
  stage,
  progress,
  size,
}: {
  stage: Stage;
  progress: MotionValue<number>;
  size: "desktop" | "mobile";
}) {
  // Typewriter window — short enough that the equation fills in promptly
  // once a stage activates, so the reader gets the whole snippet without a
  // long wait.
  const typeActive = useTransform(
    progress,
    [stage.activation, stage.activation + 0.06],
    [0, 1],
    { ease: [easeOut] },
  );

  const fillPctOfTotal = (stage.co2e / STAGE_TOTAL) * 100;

  const pad = size === "desktop" ? "p-7 lg:p-8" : "p-5";
  const headingSize = size === "desktop" ? "text-xl lg:text-2xl" : "text-base";
  const processSize = size === "desktop" ? "text-sm lg:text-base" : "text-[13px]";
  const inputsSize = size === "desktop" ? "text-sm lg:text-base" : "text-[13px]";
  const equationSize = size === "desktop" ? "text-sm lg:text-base" : "text-[12px]";
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
      <p className={`mt-3 leading-relaxed text-envrt-brand-black/70 ${inputsSize}`}>
        {stage.inputs}
      </p>

      <div className="mt-5 rounded-lg bg-envrt-brand-vista/80 px-4 py-3">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine/70 lg:text-[10px]">
          Equation
        </p>
        <code className={`mt-1 block font-mono text-envrt-brand-black ${equationSize}`}>
          <Typewriter text={stage.equation} active={typeActive} />
        </code>
      </div>

      <div className="mt-auto pt-5">
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

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
  // and translateX goes from 0 to -(N-1)*60vw to bring each card in turn.
  // Track is intentionally pulled outside the max-w-1320px container so it
  // spans the full viewport, breaking up the rigid central column.
  const trackX = useTransform(
    scrollYProgress,
    [STAGES[0].activation - 0.04, STAGES[STAGES.length - 1].activation + 0.04],
    ["0vw", `-${60 * (STAGES.length - 1)}vw`],
    { ease: [easeInOut] },
  );

  return (
    <div
      ref={sectionRef}
      className="relative hidden lg:block"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center bg-envrt-brand-vista py-12">
        {/* Header + pipeline inside the constrained max-w container */}
        <div className="mx-auto w-full max-w-[1320px] px-16">
          <Header />

          <div className="mx-auto mt-14 max-w-[1100px]">
            <Pipeline progress={scrollYProgress} activeIndex={activeIndex} />
            <PipelineLabels activeIndex={activeIndex} />
          </div>
        </div>

        {/* Card track — full viewport width, breaks out of the container */}
        <div className="mt-10 overflow-hidden">
          <motion.div
            style={{ x: trackX, willChange: "transform" }}
            className="flex gap-4 pl-[20vw] pr-[20vw]"
          >
            {STAGES.map((stage) => (
              <div key={stage.index} className="w-[60vw] flex-shrink-0">
                <StageCard
                  stage={stage}
                  progress={scrollYProgress}
                  size="desktop"
                />
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

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

  const trackX = useTransform(
    scrollYProgress,
    [STAGES[0].activation - 0.04, STAGES[STAGES.length - 1].activation + 0.04],
    ["0vw", `-${85 * (STAGES.length - 1)}vw`],
    { ease: [easeInOut] },
  );

  return (
    <div
      ref={sectionRef}
      className="relative lg:hidden"
      style={{ height: "380vh" }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center bg-envrt-brand-vista py-10">
        <div className="mx-auto w-full px-5 sm:px-8">
          <Header />

          <div className="mt-10">
            <Pipeline progress={scrollYProgress} activeIndex={activeIndex} />
            <PipelineLabels activeIndex={activeIndex} />
          </div>

          <div className="mt-8 overflow-hidden">
            <motion.div
              style={{ x: trackX, willChange: "transform" }}
              className="flex gap-3 pl-[7.5vw] pr-[7.5vw]"
            >
              {STAGES.map((stage) => (
                <div key={stage.index} className="w-[85vw] flex-shrink-0">
                  <StageCard
                    stage={stage}
                    progress={scrollYProgress}
                    size="mobile"
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

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";

// "We built the engine" — anatomy of the in-house LCA. Six real lifecycle
// stages laid horizontally as a blueprint, with a scroll-driven travelling
// dot lighting each one in turn. Stage equations and inputs reveal as the
// dot passes. Quiet brand pact: this is the differentiator nobody else can
// fake without rebuilding their stack.

type Stage = {
  index: string;
  name: string;
  inputs: string;
  /* One-line equation rendered in mono on activation. */
  equation: string;
  /* Anchor x-position on the SVG pipeline, 0–100. */
  cx: number;
};

const STAGES: Stage[] = [
  {
    index: "01",
    name: "Fibre",
    inputs: "Cotton, polyester, viscose, recycled, blends",
    equation: "mass × EF_fibre = CO₂e_fibre",
    cx: 8,
  },
  {
    index: "02",
    name: "Yarn",
    inputs: "Spinning energy, waste rate, country grid",
    equation: "mass × EF_spin × grid_factor = CO₂e_yarn",
    cx: 26,
  },
  {
    index: "03",
    name: "Fabric",
    inputs: "Knit, weave, finishing, loss factor",
    equation: "mass × EF_fabric × loss = CO₂e_fabric",
    cx: 44,
  },
  {
    index: "04",
    name: "Dyeing",
    inputs: "Dye process, water grid, AWARE factor",
    equation: "mass × EF_dye + water × AWARE = impact",
    cx: 62,
  },
  {
    index: "05",
    name: "Assembly",
    inputs: "Cut, sew, trims, country energy mix",
    equation: "mass × EF_assembly × grid = CO₂e_assembly",
    cx: 80,
  },
  {
    index: "06",
    name: "Transport",
    inputs: "Road, sea, air. Tier-by-tier distance",
    equation: "Σ(distance × mode_EF) = CO₂e_transport",
    cx: 95,
  },
];

const STATS = [
  { value: "EU PEF", label: "Product Environmental Footprint", since: "Methodology" },
  { value: "ISO 14040", label: "Lifecycle assessment standard", since: "Compliance" },
  { value: "AWARE", label: "UN water scarcity model", since: "Water" },
];

export function AnatomyOfLcaSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Travelling dot x-position along the pipeline. Maps scroll 0.1 → 0.85 onto
  // the full 0 → 100 SVG x-range, with a hold at each end.
  const dotX = useTransform(scrollYProgress, [0.1, 0.85], [STAGES[0].cx, STAGES[STAGES.length - 1].cx]);

  // Drawing the pipeline line — strokeDashoffset from full → zero across
  // 0.05 → 0.35.
  const pipelineDraw = useTransform(scrollYProgress, [0.05, 0.35], [100, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-envrt-brand-vista text-envrt-brand-black"
      style={{ height: "240vh", overflowX: "clip" }}
    >
      {/* Construction marks */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-6 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:left-6"
      >
        ENVRT/LAB
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-6 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:right-6"
      >
        IN-HOUSE LCA
      </span>

      <div className="sticky top-0 flex h-screen items-center bg-envrt-brand-vista">
        <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-16">
          {/* Header */}
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
                Most DPP tools rent calculations from a third party. We built ours,
                against EU PEF and ISO 14040, with AWARE water scarcity baked in.
                Every passport runs the same engine.
              </p>
            </FadeUp>
          </div>

          {/* Blueprint pipeline */}
          <div className="relative mt-12 sm:mt-14 lg:mt-16">
            <Pipeline dotX={dotX} pipelineDraw={pipelineDraw} />
            <StageDetails progress={scrollYProgress} />
          </div>

          {/* Stat chips */}
          <FadeUp delay={0.3}>
            <div className="mt-12 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4">
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
          </FadeUp>

          {/* Closing tagline */}
          <p className="mt-8 text-center font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-envrt-brand-black/45 sm:mt-10 sm:text-[11px]">
            ENVRT/LAB · proprietary calculation engine, not a third-party API
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Pipeline diagram (SVG) ────────────────────────────────────────────────

function Pipeline({
  dotX,
  pipelineDraw,
}: {
  dotX: MotionValue<number>;
  pipelineDraw: MotionValue<number>;
}) {
  // strokeDashoffset is normalised to pathLength=1, so map the 100 → 0 driver
  // to 1 → 0 here at the top level (useTransform is a hook).
  const dashOffset = useTransform(pipelineDraw, (v) => v / 100);

  return (
    <div className="relative">
      <svg
        viewBox="0 0 100 22"
        preserveAspectRatio="none"
        className="h-[180px] w-full sm:h-[200px] lg:h-[240px]"
      >
        {/* Faint baseline */}
        <line
          x1={STAGES[0].cx}
          x2={STAGES[STAGES.length - 1].cx}
          y1="11"
          y2="11"
          stroke="rgb(14 14 14 / 0.12)"
          strokeWidth="0.4"
          strokeDasharray="0.4 0.6"
        />

        {/* Animated stroke layer — draws across the pipeline left to right */}
        <motion.line
          x1={STAGES[0].cx}
          x2={STAGES[STAGES.length - 1].cx}
          y1="11"
          y2="11"
          stroke="rgb(62 0 255 / 0.45)"
          strokeWidth="0.55"
          strokeLinecap="round"
          pathLength={1}
          style={{ strokeDasharray: 1, strokeDashoffset: dashOffset }}
        />

        {/* Stage nodes */}
        {STAGES.map((s) => (
          <g key={s.index}>
            <circle cx={s.cx} cy="11" r="1.6" fill="white" stroke="rgb(14 14 14)" strokeWidth="0.4" />
            <circle cx={s.cx} cy="11" r="0.7" fill="rgb(14 14 14 / 0.65)" />
          </g>
        ))}

        {/* Travelling progress dot — cx is animated directly on each circle
            (SVG attribute) so the position works in viewBox units, not CSS px. */}
        <motion.circle cx={dotX} cy="11" r="2.4" fill="rgb(62 0 255 / 0.15)" />
        <motion.circle cx={dotX} cy="11" r="1.4" fill="rgb(62 0 255)" />
      </svg>

      {/* Stage labels under the line */}
      <div className="absolute inset-x-0 top-[60%] hidden sm:block">
        <div className="relative">
          {STAGES.map((s) => (
            <div
              key={s.index}
              className="absolute -translate-x-1/2 text-center"
              style={{ left: `${s.cx}%` }}
            >
              <p className="font-mono text-[10px] font-semibold tracking-[0.18em] text-envrt-brand-black/40 sm:text-[11px]">
                {s.index}
              </p>
              <p className="mt-1 font-display text-sm font-semibold tracking-[-0.01em] text-envrt-brand-black sm:text-base">
                {s.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile fallback stack — pure list of stages */}
      <div className="mt-6 grid grid-cols-3 gap-3 sm:hidden">
        {STAGES.map((s) => (
          <div key={s.index} className="text-center">
            <p className="font-mono text-[9px] font-semibold tracking-[0.18em] text-envrt-brand-black/40">
              {s.index}
            </p>
            <p className="mt-0.5 font-display text-sm font-semibold tracking-[-0.01em] text-envrt-brand-black">
              {s.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stage details panel — shows the active stage's equation + inputs ──────

function StageDetails({ progress }: { progress: MotionValue<number> }) {
  // Determine active stage from progress. Each stage owns an equal slice of
  // the 0.1 → 0.85 travel range.
  const span = 0.85 - 0.1;
  const slice = span / STAGES.length;

  const activeIndexMv = useTransform(progress, (p) => {
    const local = (p - 0.1) / slice;
    return Math.max(0, Math.min(STAGES.length - 1, Math.floor(local)));
  });

  const [active, setActive] = useState(0);
  useEffect(() => activeIndexMv.on("change", (v) => setActive(v)), [activeIndexMv]);

  const stage = STAGES[active];

  return (
    <div className="mt-10 sm:mt-14">
      <div className="mx-auto max-w-2xl rounded-2xl border border-envrt-brand-black/10 bg-white/70 p-5 backdrop-blur sm:p-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine">
            Stage {stage.index}
          </span>
          <span className="h-px flex-1 bg-envrt-brand-black/10" />
          <span className="font-display text-base font-semibold tracking-[-0.01em] text-envrt-brand-black sm:text-lg">
            {stage.name}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-envrt-brand-black/65">
          {stage.inputs}
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg bg-envrt-brand-vista/80 px-3 py-2.5">
          <code className="block whitespace-pre font-mono text-[11px] text-envrt-brand-black sm:text-xs">
            {stage.equation}
          </code>
        </div>
      </div>
    </div>
  );
}

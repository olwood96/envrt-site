"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";
import { AssetIcon, type AssetIconType } from "./AssetIcon";
import { Eyebrow } from "./_shared";

// ─── Data ────────────────────────────────────────────────────────────────

type Capability = {
  id: string;
  name: string;
  /* One-line technical descriptor — the row's main copy. */
  desc: string;
  /* Proof-point chip on the right of the row. */
  stat: { value: string; label: string };
  /* Optional theme tag — small dimmed caption to group related rows. */
  theme: "calculate" | "comply" | "communicate";
};

const CAPABILITIES: Capability[] = [
  {
    id: "supply-chain",
    name: "Supply chain mapping",
    desc: "Reconstruct every tier from fibre to factory, verified at the source.",
    stat: { value: "3", label: "tiers mapped" },
    theme: "calculate",
  },
  {
    id: "lca",
    name: "In-house LCA",
    desc: "Per-garment lifecycle calculations against EU PEF and ISO 14040.",
    stat: { value: "6", label: "impact stages" },
    theme: "calculate",
  },
  {
    id: "eco-score",
    name: "French Eco-Score",
    desc: "Coût Environnemental built in. Government-recognised, ready to display.",
    stat: { value: "16", label: "data blocks" },
    theme: "calculate",
  },
  {
    id: "dpp",
    name: "DPP production",
    desc: "Hosted Digital Product Passports at a permanent URL. Brand-customisable.",
    stat: { value: "1", label: "hosted URL" },
    theme: "comply",
  },
  {
    id: "vault",
    name: "Evidence vault",
    desc: "Supplier certificates, test reports, declarations. Versioned, dated, signed.",
    stat: { value: "Versioned", label: "and signed" },
    theme: "comply",
  },
  {
    id: "audit",
    name: "Audit-ready reports",
    desc: "Export the methodology pack in one click. CSV, JSON, PDF.",
    stat: { value: "3", label: "export formats" },
    theme: "comply",
  },
  {
    id: "compliance",
    name: "Compliance monitoring",
    desc: "Active watch on EU PEF, ISO updates, AGEC, US state-level acts.",
    stat: { value: "Live", label: "watch" },
    theme: "comply",
  },
  {
    id: "analytics",
    name: "QR scan analytics",
    desc: "Per-SKU and brand-wide dashboards. Scans, country, dwell time.",
    stat: { value: "Live", label: "per SKU" },
    theme: "communicate",
  },
  {
    id: "claims",
    name: "Green-claims audit",
    desc: "Every marketing claim tied to source data and methodology.",
    stat: { value: "Source-tied", label: "claims" },
    theme: "communicate",
  },
];

const THEME_LABEL: Record<Capability["theme"], string> = {
  calculate: "Calculate",
  comply: "Comply",
  communicate: "Communicate",
};

// ─── Section ─────────────────────────────────────────────────────────────

export function CapabilitiesSection() {
  return (
    <section
      className="relative bg-envrt-brand-vista py-20 sm:py-24 lg:py-32"
      style={{ overflowX: "clip" }}
    >
      {/* Thin left accent rule + corner construction marks (no halos) */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/3 bottom-1/3 hidden w-px bg-envrt-brand-ultramarine/35 lg:block"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/3 bottom-1/3 hidden w-px bg-envrt-brand-ultramarine/15 lg:block"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-6 hidden font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:left-6 sm:block"
      >
        ENVRT/03
      </span>

      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <FadeUp>
            <div className="flex items-center gap-3">
              <Eyebrow>What we do</Eyebrow>
              <span aria-hidden className="h-px w-12 bg-envrt-brand-ultramarine/40 sm:w-16" />
            </div>
            <h2 className="mt-5 font-display text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-4xl lg:text-[3rem]">
              Nine capabilities.<br />
              <span className="text-envrt-brand-black/35">One platform.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.08}>
            <p className="self-end text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg">
              Read as a spec sheet. Every capability listed, every proof point
              attached, no marketing in between.
            </p>
          </FadeUp>
        </div>

        {/* Spec table */}
        <div className="mt-12 sm:mt-16">
          {/* Column header strip — only visible on sm+ as quiet metadata */}
          <div className="hidden grid-cols-[44px_44px_1fr_180px_24px] items-center gap-6 border-b border-envrt-brand-black/12 pb-3 sm:grid lg:grid-cols-[64px_56px_1fr_180px_24px]">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/45">
              No.
            </span>
            <span className="sr-only">Icon</span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/45">
              Capability
            </span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/45">
              Proof point
            </span>
            <span className="sr-only">Link</span>
          </div>

          {/* Rows */}
          <div role="list">
            {CAPABILITIES.map((cap, i) => {
              const prev = CAPABILITIES[i - 1];
              const showThemeHeader = !prev || prev.theme !== cap.theme;
              return (
                <CapabilityRow
                  key={cap.id}
                  cap={cap}
                  index={i}
                  themeHeader={showThemeHeader ? THEME_LABEL[cap.theme] : null}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Row ────────────────────────────────────────────────────────────────

function CapabilityRow({
  cap,
  index,
  themeHeader,
}: {
  cap: Capability;
  index: number;
  themeHeader: string | null;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      role="listitem"
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.05 + index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative"
    >
      {/* Theme cluster header (small label that introduces a new group of rows) */}
      {themeHeader && (
        <div className="pt-8 pb-2 sm:pt-10 sm:pb-3">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine/80 sm:text-[11px]">
            ▽ {themeHeader}
          </p>
        </div>
      )}

      {/* Row body */}
      <div className="relative border-b border-envrt-brand-black/8">
        {/* Left-edge slide-in accent (animated via group-hover would clip; use motion) */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -left-3 top-1/2 h-8 w-[2px] origin-center -translate-y-1/2 bg-envrt-brand-ultramarine sm:-left-4"
        />

        {/* Hover ground tint */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none absolute inset-0 -mx-3 rounded-xl bg-white sm:-mx-4"
        />

        {/* Mobile layout */}
        <div className="relative grid grid-cols-[28px_36px_1fr] items-baseline gap-3 py-5 sm:hidden">
          <CapIcon id={cap.id} hovered={hovered} size={22} />
          <span className="font-mono text-xs font-medium leading-none text-envrt-brand-black/40 transition-colors duration-300 group-hover:text-envrt-brand-ultramarine">
            {(index + 1).toString().padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-base font-semibold leading-tight tracking-[-0.01em] text-envrt-brand-black">
                {cap.name}
              </h3>
              <span className="text-base leading-none text-envrt-brand-black/35 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-envrt-brand-ultramarine">
                ↗
              </span>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-envrt-brand-black/65">
              {cap.desc}
            </p>
            <div className="mt-2.5 inline-flex items-baseline gap-1.5">
              <span className="font-display text-xs font-semibold text-envrt-brand-black">
                {cap.stat.value}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-envrt-brand-black/55">
                {cap.stat.label}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="relative hidden grid-cols-[44px_44px_1fr_180px_24px] items-center gap-6 py-6 sm:grid lg:grid-cols-[64px_56px_1fr_180px_24px] lg:py-7">
          {/* Index */}
          <span className="font-mono text-sm font-medium leading-none text-envrt-brand-black/40 transition-colors duration-300 group-hover:text-envrt-brand-ultramarine">
            {(index + 1).toString().padStart(2, "0")}
          </span>

          {/* Icon */}
          <CapIcon id={cap.id} hovered={hovered} size={28} />

          {/* Name + description */}
          <div className="min-w-0">
            <div className="relative inline-flex items-center">
              <h3 className="font-display text-lg font-semibold leading-tight tracking-[-0.01em] text-envrt-brand-black lg:text-xl">
                {cap.name}
              </h3>
              {/* Underline that draws in on hover */}
              <motion.span
                aria-hidden
                initial={false}
                animate={{
                  scaleX: hovered ? 1 : 0,
                  opacity: hovered ? 1 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] origin-left bg-envrt-brand-ultramarine"
              />
            </div>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-envrt-brand-black/65 lg:text-[15px]">
              {cap.desc}
            </p>
          </div>

          {/* Stat */}
          <div className="flex flex-col items-start">
            <span className="font-display text-lg font-semibold leading-none tracking-[-0.01em] text-envrt-brand-black lg:text-xl">
              {cap.stat.value}
            </span>
            <span className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-envrt-brand-black/55 lg:text-[11px]">
              {cap.stat.label}
            </span>
          </div>

          {/* Slide-in arrow */}
          <motion.span
            aria-hidden
            initial={false}
            animate={{
              x: hovered ? 0 : -6,
              opacity: hovered ? 1 : 0,
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="justify-self-end text-lg leading-none text-envrt-brand-ultramarine"
          >
            ↗
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Icon ────────────────────────────────────────────────────────────────
//
// Asset glyph for each capability row. Dimmed black by default, lifts to
// ultramarine on hover with a small scale-up + rotation "stamp" feel — like
// inking the row.

function CapIcon({
  id,
  hovered,
  size,
}: {
  id: Capability["id"];
  hovered: boolean;
  size: number;
}) {
  return (
    <motion.span
      aria-hidden
      initial={false}
      animate={{
        scale: hovered ? 1.08 : 1,
        rotate: hovered ? -3 : 0,
        color: hovered ? "rgb(62 0 255)" : "rgb(14 14 14 / 0.55)",
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center justify-center"
    >
      <AssetIcon type={id as AssetIconType} size={size} />
    </motion.span>
  );
}

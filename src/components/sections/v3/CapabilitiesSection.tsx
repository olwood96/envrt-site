"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";

// ─── Data ────────────────────────────────────────────────────────────────

type Capability = {
  id: string;
  name: string;
  short: string;
  body: string;
  /* Proof-point chip rendered next to the title — credibility marker. */
  stat: { value: string; label: string };
};

const CAPABILITIES: Capability[] = [
  {
    id: "supply-chain",
    name: "Supply chain mapping",
    short: "Mapping",
    body: "Reconstruct every tier from fibre to factory. Country, supplier, certification status — verified at the source and tied to the garment they belong to.",
    stat: { value: "3", label: "tiers mapped" },
  },
  {
    id: "lca",
    name: "In-house LCA",
    short: "LCA",
    body: "Per-garment lifecycle calculations against EU PEF and ISO 14040. CO₂e, water scarcity, six impact stages, all calculated against a database of 68,431 reference cells.",
    stat: { value: "6", label: "impact stages" },
  },
  {
    id: "eco-score",
    name: "French Eco-Score",
    short: "Eco-Score",
    body: "Coût Environnemental calculations built in. Government-recognised label, ready to display on the DPP and in regulatory filings.",
    stat: { value: "16", label: "data blocks" },
  },
  {
    id: "dpp",
    name: "DPP production",
    short: "DPP",
    body: "Hosted Digital Product Passports at a permanent URL. Brand-customisable typography, regulation-ready data, scan from any device with no app.",
    stat: { value: "1", label: "hosted URL" },
  },
  {
    id: "analytics",
    name: "QR scan analytics",
    short: "Analytics",
    body: "Per-SKU and brand-wide dashboards. Scans, country, dwell time, repeat visits. Find which passports earn the second look — and which need a rewrite.",
    stat: { value: "Live", label: "per SKU" },
  },
  {
    id: "audit",
    name: "Audit-ready reports",
    short: "Audit",
    body: "Export the methodology pack in one click. CSV, JSON, PDF. Drop straight into a compliance review without rebuilding the data downstream.",
    stat: { value: "3", label: "export formats" },
  },
  {
    id: "vault",
    name: "Evidence vault",
    short: "Vault",
    body: "Supplier certificates, test reports, signed declarations — versioned, dated, hash-stamped, and tied to the garment they cover. Never lose the paper trail.",
    stat: { value: "Versioned", label: "and signed" },
  },
  {
    id: "compliance",
    name: "Compliance monitoring",
    short: "Compliance",
    body: "Active watch on EU PEF, ISO updates, French AGEC and US state-level acts. Alerts when a passport falls behind a regulatory change.",
    stat: { value: "Live", label: "watch" },
  },
  {
    id: "claims",
    name: "Green-claims audit",
    short: "Claims",
    body: "Every marketing claim tied to source data and methodology. Substantiation that survives a Green Claims Directive review without spreadsheets.",
    stat: { value: "Source-tied", label: "claims" },
  },
];

const CYCLE_MS = 5200;

// ─── Icons ───────────────────────────────────────────────────────────────

function CapabilityIcon({ id, className = "" }: { id: string; className?: string }) {
  const props = {
    viewBox: "0 0 28 28",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (id) {
    case "supply-chain":
      return (
        <svg {...props}>
          <circle cx="5" cy="6" r="2" />
          <circle cx="23" cy="6" r="2" />
          <circle cx="14" cy="22" r="2" />
          <path d="M7 7l5 13M21 7l-5 13M7 6h14" />
        </svg>
      );
    case "lca":
      return (
        <svg {...props}>
          <path d="M22 14a8 8 0 1 1-2.34-5.66" />
          <path d="M22 4v5h-5" />
        </svg>
      );
    case "eco-score":
      return (
        <svg {...props}>
          <path d="M14 23c5-2 8-7 8-13a14 14 0 0 0-7 1c-3 2-5 5-5 9a8 8 0 0 0 4 7v-7" />
          <path d="M14 23v-7" />
        </svg>
      );
    case "dpp":
      return (
        <svg {...props}>
          <rect x="5" y="3" width="18" height="22" rx="2" />
          <circle cx="14" cy="10" r="3" />
          <path d="M9 17h10M9 20h7" />
        </svg>
      );
    case "analytics":
      return (
        <svg {...props}>
          <rect x="9" y="3" width="10" height="22" rx="2" />
          <path d="M13 20h2M12 8h4" />
          <circle cx="14" cy="13" r="1" fill="currentColor" />
        </svg>
      );
    case "audit":
      return (
        <svg {...props}>
          <path d="M7 3h9l5 5v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <path d="M16 3v5h5" />
          <path d="M9 16l3 3 5-6" />
        </svg>
      );
    case "vault":
      return (
        <svg {...props}>
          <rect x="3" y="6" width="22" height="16" rx="2" />
          <circle cx="14" cy="14" r="4" />
          <path d="M14 10v8M10 14h8" />
        </svg>
      );
    case "compliance":
      return (
        <svg {...props}>
          <path d="M14 3l9 4v5c0 6-4 11-9 13-5-2-9-7-9-13V7l9-4z" />
          <path d="M10 14l3 3 5-6" />
        </svg>
      );
    case "claims":
      return (
        <svg {...props}>
          <path d="M5 11v4h3l8 5V6L8 11H5z" />
          <path d="M19 9.5a4 4 0 0 1 0 7" />
          <path d="M22 7a8 8 0 0 1 0 12" />
        </svg>
      );
    default:
      return null;
  }
}

// ─── Section ─────────────────────────────────────────────────────────────

export function CapabilitiesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2 });

  useEffect(() => {
    if (paused || !inView) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % CAPABILITIES.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [paused, inView]);

  const active = CAPABILITIES[activeIndex];

  const handleSelect = (i: number) => {
    setActiveIndex(i);
    setPaused(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-envrt-offwhite py-20 sm:py-24 lg:py-32"
      style={{ overflowX: "clip" }}
    >
      {/* Ambient aqua washes */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[35%] h-[480px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-envrt-aqua/[0.06] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <FadeUp>
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-aqua sm:text-[11px]">
                What we do
              </p>
              <span aria-hidden className="h-px w-12 bg-envrt-aqua/40 sm:w-16" />
            </div>
            <h2 className="mt-5 font-manrope text-3xl font-semibold leading-[1.05] tracking-[-0.025em] text-envrt-ink sm:text-4xl lg:text-[3rem]">
              Nine capabilities.<br />
              <span className="text-envrt-ink/35">One platform.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.08}>
            <p className="self-end text-base leading-relaxed text-envrt-charcoal/70 sm:text-lg">
              Everything ENVRT handles for you from line-sheet to live passport.
              Tap one to read more — they rotate on their own otherwise.
            </p>
          </FadeUp>
        </div>

        {/* Capability stage */}
        <div className="mt-12 sm:mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-envrt-ink/8 bg-white shadow-[0_24px_60px_-28px_rgba(14,14,14,0.18)]">
            {/* Dotted grid background */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(14,14,14,0.45) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />
            {/* Aqua corner glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -top-20 h-[280px] w-[280px] rounded-full bg-envrt-aqua/[0.16] blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -bottom-16 h-[240px] w-[240px] rounded-full bg-envrt-aqua/[0.08] blur-3xl"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative grid items-center gap-8 p-8 sm:gap-12 sm:p-12 lg:grid-cols-[minmax(280px,1fr)_1.4fr] lg:gap-16 lg:p-16"
              >
                {/* Visual side — large iconic display */}
                <div className="relative flex items-center justify-center lg:justify-start">
                  {/* Outer aqua halo */}
                  <motion.div
                    aria-hidden
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute h-[220px] w-[220px] rounded-full bg-envrt-aqua/[0.18] blur-2xl sm:h-[260px] sm:w-[260px]"
                  />
                  {/* Inner subtle halo */}
                  <motion.div
                    aria-hidden
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute h-[140px] w-[140px] rounded-full bg-envrt-aqua/[0.22] blur-xl sm:h-[160px] sm:w-[160px]"
                  />
                  {/* Concentric rings */}
                  <div
                    aria-hidden
                    className="absolute h-[180px] w-[180px] rounded-full border border-envrt-aqua/15 sm:h-[220px] sm:w-[220px]"
                  />
                  <div
                    aria-hidden
                    className="absolute h-[120px] w-[120px] rounded-full border border-envrt-aqua/25 sm:h-[150px] sm:w-[150px]"
                  />
                  {/* Icon plate */}
                  <motion.div
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-envrt-aqua/40 bg-white shadow-[0_18px_40px_-12px_rgba(103,228,209,0.4)] sm:h-28 sm:w-28"
                  >
                    <CapabilityIcon
                      id={active.id}
                      className="h-11 w-11 text-envrt-aqua sm:h-12 sm:w-12"
                    />
                  </motion.div>
                </div>

                {/* Text side */}
                <div className="min-w-0">
                  {/* Index + stat chip row */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-aqua sm:text-[11px]">
                      {(activeIndex + 1).toString().padStart(2, "0")} / 09
                    </span>
                    <span aria-hidden className="h-px w-8 bg-envrt-ink/15" />
                    <span className="inline-flex items-baseline gap-1.5 rounded-full border border-envrt-aqua/30 bg-envrt-aqua/[0.08] px-3 py-1">
                      <span className="font-manrope text-xs font-semibold text-envrt-ink sm:text-sm">
                        {active.stat.value}
                      </span>
                      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-envrt-charcoal/65 sm:text-[11px]">
                        {active.stat.label}
                      </span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-5 font-manrope text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-envrt-ink sm:mt-6 sm:text-4xl lg:text-[2.75rem]">
                    {active.name}
                  </h3>

                  {/* Accent line */}
                  <div className="mt-4 h-px w-16 bg-envrt-aqua sm:mt-5 sm:w-20" />

                  {/* Body */}
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-envrt-charcoal/70 sm:mt-6 sm:text-lg">
                    {active.body}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Auto-cycle progress bar at the bottom */}
            {!paused && inView && (
              <motion.div
                key={`progress-${activeIndex}`}
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-envrt-aqua/55"
              />
            )}
          </div>
        </div>

        {/* Capability selector — staggered designed cards */}
        <div
          className="-mx-5 mt-6 overflow-x-auto px-5 sm:mt-8 sm:overflow-visible sm:px-0"
          // Hide scrollbar on mobile horizontal scroll
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex min-w-max gap-2 sm:grid sm:min-w-0 sm:grid-cols-5 sm:gap-3 lg:grid-cols-9">
            {CAPABILITIES.map((cap, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={cap.id}
                  type="button"
                  onClick={() => handleSelect(i)}
                  onMouseEnter={() => handleSelect(i)}
                  aria-pressed={isActive}
                  aria-label={cap.name}
                  className={`group relative flex w-[120px] flex-shrink-0 flex-col items-start gap-3 overflow-hidden rounded-2xl border p-3.5 transition-all duration-500 sm:w-auto sm:gap-3.5 sm:p-4 ${
                    isActive
                      ? "border-envrt-aqua/40 bg-white shadow-[0_14px_36px_-14px_rgba(103,228,209,0.4)]"
                      : "border-envrt-ink/8 bg-white/60 hover:-translate-y-0.5 hover:border-envrt-aqua/20 hover:bg-white"
                  }`}
                >
                  {/* Index in the corner */}
                  <span
                    className={`font-mono text-[9px] font-medium leading-none tracking-[0.15em] transition-colors duration-300 sm:text-[10px] ${
                      isActive ? "text-envrt-aqua" : "text-envrt-charcoal/35"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  {/* Icon + label */}
                  <div className="flex w-full items-center justify-between gap-2">
                    <span
                      className={`font-manrope text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors duration-300 sm:text-xs ${
                        isActive
                          ? "text-envrt-ink"
                          : "text-envrt-charcoal/65 group-hover:text-envrt-ink"
                      }`}
                    >
                      {cap.short}
                    </span>
                    <CapabilityIcon
                      id={cap.id}
                      className={`h-4 w-4 flex-shrink-0 transition-colors duration-300 sm:h-[18px] sm:w-[18px] ${
                        isActive
                          ? "text-envrt-aqua"
                          : "text-envrt-charcoal/45 group-hover:text-envrt-aqua/85"
                      }`}
                    />
                  </div>
                  {/* Active underline accent */}
                  {isActive && (
                    <motion.span
                      layoutId="cap-active-underline"
                      aria-hidden
                      className="absolute inset-x-3.5 bottom-0 h-[2px] bg-envrt-aqua sm:inset-x-4"
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

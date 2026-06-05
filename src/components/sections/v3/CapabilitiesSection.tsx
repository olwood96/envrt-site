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
};

const CAPABILITIES: Capability[] = [
  {
    id: "supply-chain",
    name: "Supply chain mapping",
    short: "Mapping",
    body: "Reconstruct every tier from fibre to factory. Country, supplier, certification status, verified at the source.",
  },
  {
    id: "lca",
    name: "In-house LCA",
    short: "LCA",
    body: "Per-garment lifecycle calculations against EU PEF and ISO 14040. CO₂e, water scarcity, six impact stages.",
  },
  {
    id: "eco-score",
    name: "French Eco-Score",
    short: "Eco-Score",
    body: "Coût Environnemental calculations built in. Government-recognised label, ready to display.",
  },
  {
    id: "dpp",
    name: "DPP production",
    short: "DPP",
    body: "Hosted Digital Product Passports at a permanent URL. Brand-customisable, regulation-ready, scan from any device.",
  },
  {
    id: "analytics",
    name: "QR scan analytics",
    short: "Analytics",
    body: "Per-SKU and brand-wide dashboards. Scans, country, dwell time. Find which passports earn the second look.",
  },
  {
    id: "audit",
    name: "Audit-ready reports",
    short: "Audit",
    body: "Export the methodology pack in one click. CSV, JSON, PDF. Drop straight into a compliance review.",
  },
  {
    id: "vault",
    name: "Evidence vault",
    short: "Vault",
    body: "Supplier certificates, test reports, signed declarations — versioned, dated, and tied to the garment they cover.",
  },
  {
    id: "compliance",
    name: "Compliance monitoring",
    short: "Compliance",
    body: "Active watch on EU PEF, ISO updates, French AGEC, US state-level acts. Alerts when a passport falls behind.",
  },
  {
    id: "claims",
    name: "Green-claims audit",
    short: "Claims",
    body: "Every marketing claim tied to source data. Substantiation that survives a Green Claims Directive review.",
  },
];

const CYCLE_MS = 4800;

// ─── Icons ───────────────────────────────────────────────────────────────
// Minimal SVG glyphs. All sized 28×28, currentColor stroke 1.5.

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
          <path d="M13 20h2" />
          <path d="M12 8h4" />
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

  // Auto-cycle only when section is in view and user hasn't interacted.
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
      className="relative overflow-hidden bg-envrt-offwhite py-20 sm:py-24 lg:py-32"
    >
      {/* Subtle aqua wash following the active capability */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/3 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-envrt-aqua/[0.05] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <FadeUp>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-aqua sm:text-[11px]">
              What we do
            </p>
            <h2 className="mt-5 font-manrope text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-envrt-ink sm:text-4xl lg:text-[2.75rem]">
              Nine capabilities. One platform.
            </h2>
          </FadeUp>
          <FadeUp delay={0.08}>
            <p className="self-end text-base leading-relaxed text-envrt-charcoal/70 sm:text-lg">
              Everything ENVRT handles for you from line-sheet to live passport.
              Tap one to read more — they rotate on their own otherwise.
            </p>
          </FadeUp>
        </div>

        {/* Featured panel — the focus */}
        <div className="mt-12 sm:mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-envrt-ink/8 bg-white p-8 sm:p-12 lg:p-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[180px_1fr] lg:gap-16"
              >
                {/* Iconic side */}
                <div className="relative flex items-center justify-center lg:justify-start">
                  {/* Aqua halo */}
                  <div
                    aria-hidden
                    className="absolute h-[160px] w-[160px] rounded-full bg-envrt-aqua/[0.18] blur-2xl"
                  />
                  {/* Frame around icon */}
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl border border-envrt-aqua/30 bg-white shadow-[0_18px_40px_-16px_rgba(103,228,209,0.4)] sm:h-32 sm:w-32">
                    <CapabilityIcon
                      id={active.id}
                      className="h-12 w-12 text-envrt-aqua sm:h-14 sm:w-14"
                    />
                  </div>
                </div>

                {/* Text side */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-aqua sm:text-[11px]">
                    {(activeIndex + 1).toString().padStart(2, "0")} / 09
                  </p>
                  <h3 className="mt-3 font-manrope text-2xl font-semibold leading-tight tracking-[-0.02em] text-envrt-ink sm:mt-4 sm:text-3xl lg:text-[2.25rem]">
                    {active.name}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-envrt-charcoal/70 sm:mt-5 sm:text-base lg:text-lg">
                    {active.body}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Auto-cycle progress bar */}
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

        {/* Strip — clickable mini cards */}
        <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-6 sm:grid-cols-5 sm:gap-3 lg:grid-cols-9">
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
                className={`group flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all duration-300 sm:p-4 ${
                  isActive
                    ? "border-envrt-aqua/40 bg-white shadow-[0_12px_30px_-12px_rgba(103,228,209,0.35)]"
                    : "border-envrt-ink/8 bg-white/50 hover:border-envrt-aqua/20 hover:bg-white"
                }`}
              >
                <CapabilityIcon
                  id={cap.id}
                  className={`h-5 w-5 transition-colors duration-300 sm:h-6 sm:w-6 ${
                    isActive
                      ? "text-envrt-aqua"
                      : "text-envrt-charcoal/55 group-hover:text-envrt-aqua/85"
                  }`}
                />
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 sm:text-[11px] ${
                    isActive ? "text-envrt-ink" : "text-envrt-charcoal/65 group-hover:text-envrt-ink"
                  }`}
                >
                  {cap.short}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

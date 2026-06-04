"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";

// ─── Annotated DPP hero (v3.next) ────────────────────────────────────────
// Centre: a clean DPP fact-sheet card with the product photo + structured
// key/value data. Around it: 8 hook cards on aqua connector lines, four per
// side on desktop, stacked underneath on mobile. NexDyne palette throughout.

type Hook = {
  label: string;
  title: string;
  body: string;
  // Vertical anchor on the centre card (0–100, % of card height) where the
  // connector terminates. Each hook gets its own anchor for clean spacing.
  anchorY: number;
};

const leftHooks: Hook[] = [
  { label: "LCA METRICS",      title: "CO₂e + water scarcity", body: "Per-garment, ISO 14040 LCA.",        anchorY: 12 },
  { label: "SUPPLY CHAIN",     title: "Tier-by-tier provenance", body: "Fibre to factory, fully mapped.",    anchorY: 38 },
  { label: "ECO-SCORE",        title: "Coût Environnemental",  body: "French government-recognised label.", anchorY: 62 },
  { label: "STORY",            title: "Your editorial voice",  body: "Photos, provenance, repair guidance.", anchorY: 88 },
];

const rightHooks: Hook[] = [
  { label: "ESPR-READY",       title: "Compliance reporting",  body: "EU PEF · ISO 14040 · AWARE.",          anchorY: 12 },
  { label: "LIVE ANALYTICS",   title: "Scan, country, dwell",  body: "Per-SKU and brand-wide dashboards.",   anchorY: 38 },
  { label: "30-MIN ONBOARDING",title: "Collection to DPP",      body: "CSV or line-sheet upload, AI gap-fill.", anchorY: 62 },
  { label: "QR + HOSTED",      title: "Care label or hangtag", body: "Resolves on envrt.com or your domain.", anchorY: 88 },
];

// ─── Single annotation card (used on both desktop and mobile) ────────────
function HookCard({ hook, alignRight = false }: { hook: Hook; alignRight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-300 hover:border-envrt-aqua/30 hover:bg-white/[0.05] sm:p-5 ${
        alignRight ? "text-left lg:text-right" : "text-left"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-aqua">
        {hook.label}
      </p>
      <p className="mt-2 font-manrope text-sm font-semibold leading-snug tracking-tight text-white sm:text-base">
        {hook.title}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-envrt-mute-cool sm:text-[13px]">
        {hook.body}
      </p>
    </div>
  );
}

// ─── Centre DPP card (the actual passport mock) ──────────────────────────
function DppCard() {
  const rows = [
    { k: "Composition", v: "100% Organic Cotton" },
    { k: "Origin",      v: "Türkiye, Izmir" },
    { k: "Care",        v: "Machine wash 30°" },
    { k: "CO₂e",        v: "6.3 kg" },
    { k: "Water",       v: "12,400 L AWARE" },
    { k: "Certifications", v: "GOTS · OEKO-TEX 100" },
  ];

  return (
    <div className="overflow-hidden rounded-3xl bg-envrt-offwhite shadow-[0_30px_80px_-20px_rgba(103,228,209,0.25),0_20px_50px_-15px_rgba(0,0,0,0.5)]">
      {/* Photo block */}
      <div className="relative aspect-[5/4] w-full bg-envrt-stone">
        <Image
          src="/jacket.png"
          alt="Organic cotton hoodie — sample DPP product"
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 60vw, 80vw"
          className="object-contain"
          priority
        />
        {/* Scanned & verified pill, top-left */}
        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-envrt-green" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-envrt-charcoal">
            Scanned &amp; Verified
          </span>
        </div>
      </div>

      {/* Data block */}
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <h3 className="font-manrope text-lg font-semibold tracking-tight text-envrt-ink sm:text-xl">
          Organic Cotton Hoodie
        </h3>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-envrt-muted">
          DPP-FA-2026-00742
        </p>

        <dl className="mt-4 space-y-2.5 border-t border-envrt-ink/8 pt-4">
          {rows.map((r) => (
            <div key={r.k} className="flex items-baseline justify-between gap-3 text-xs sm:text-[13px]">
              <dt className="text-envrt-muted">{r.k}</dt>
              <dd className="text-right font-medium text-envrt-ink">{r.v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex items-center gap-1.5 border-t border-envrt-ink/8 pt-3.5">
          <span className="h-1.5 w-1.5 rounded-full bg-envrt-green" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-envrt-muted">
            W3C VC · eIDAS aligned
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Connector lines overlay (desktop only) ───────────────────────────────
// Aqua hairlines from each hook card to the centre DPP card. Each line has a
// 90-degree bend so the path reads as a deliberate annotation, not a straight
// diagonal. Coordinates are in viewBox units (100 × 100 mapped to container).
function ConnectorLines() {
  // Card edges in viewBox % (matching the grid columns below)
  const cardLeftEdge = 32;   // left edge of centre DPP card
  const cardRightEdge = 68;  // right edge of centre DPP card
  const hookEdgeLeft = 28;   // right edge of left-side hook column
  const hookEdgeRight = 72;  // left edge of right-side hook column

  // Each hook's vertical centre as % of viewBox height.
  // Hook row centres: header(~12%) + each row roughly at 30%, 50%, 70%, 90%
  // We map them so they line up with the actual grid rendering.
  const hookCentres = [16, 38, 60, 82];

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        className="text-envrt-aqua/55"
      >
        {leftHooks.map((h, i) => {
          const hookY = hookCentres[i];
          const cardY = h.anchorY;
          // Path: from hook inner edge, horizontal halfway, then vertical to
          // card Y, then horizontal to card left edge.
          const midX = (hookEdgeLeft + cardLeftEdge) / 2;
          const d = `M ${hookEdgeLeft} ${hookY} L ${midX} ${hookY} L ${midX} ${cardY} L ${cardLeftEdge} ${cardY}`;
          return <path key={`l-${i}`} d={d} />;
        })}
        {rightHooks.map((h, i) => {
          const hookY = hookCentres[i];
          const cardY = h.anchorY;
          const midX = (cardRightEdge + hookEdgeRight) / 2;
          const d = `M ${cardRightEdge} ${cardY} L ${midX} ${cardY} L ${midX} ${hookY} L ${hookEdgeRight} ${hookY}`;
          return <path key={`r-${i}`} d={d} />;
        })}
      </g>
      {/* Endpoint dots, aqua filled, one at each end of every connector */}
      <g className="fill-envrt-aqua">
        {leftHooks.map((h, i) => {
          const hookY = hookCentres[i];
          const cardY = h.anchorY;
          return (
            <g key={`l-dots-${i}`}>
              <circle cx={hookEdgeLeft} cy={hookY} r="0.7" />
              <circle cx={cardLeftEdge} cy={cardY} r="0.85" />
            </g>
          );
        })}
        {rightHooks.map((h, i) => {
          const hookY = hookCentres[i];
          const cardY = h.anchorY;
          return (
            <g key={`r-dots-${i}`}>
              <circle cx={cardRightEdge} cy={cardY} r="0.85" />
              <circle cx={hookEdgeRight} cy={hookY} r="0.7" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ─── Hero shell ──────────────────────────────────────────────────────────

export function HeroV3() {
  return (
    <section className="relative overflow-hidden bg-envrt-deep">
      {/* Faint grid background, like the NexDyne spec boards */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Aqua halo behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-envrt-aqua/[0.10] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 pt-24 pb-16 sm:px-8 sm:pt-28 lg:px-12 lg:pt-32 lg:pb-24">
        {/* Top copy */}
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-envrt-aqua sm:text-[11px]">
              EU ESPR · Ready
            </p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="mt-5 font-manrope text-[2rem] font-semibold leading-[1.06] tracking-[-0.025em] text-white sm:text-5xl lg:text-[3.5rem]">
              Digital Product Passports for fashion brands.
            </h1>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-envrt-mute-cool sm:text-base">
              Calculate emissions, water scarcity and Eco-Score for every
              garment. Attach a QR to the care label. Customers scan and see
              the full story.
            </p>
          </FadeUp>
          <FadeUp delay={0.24}>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href="/free-dpp"
                size="md"
                className="w-full sm:w-auto sm:px-7 sm:py-3 sm:text-base"
                data-cta="hero-v3-free-dpp"
              >
                Get a free DPP<span className="ml-2">→</span>
              </Button>
              <Button
                href="/contact"
                variant="ghost"
                size="md"
                className="w-full text-white hover:text-envrt-aqua sm:w-auto sm:px-3 sm:py-3 sm:text-base"
                data-cta="hero-v3-book-demo"
              >
                Book a demo<span className="ml-1.5">→</span>
              </Button>
            </div>
          </FadeUp>
        </div>

        {/* DPP + hooks composition */}
        <FadeUp delay={0.32}>
          {/* ── Desktop (≥lg): 3-column grid with connector overlay ── */}
          <div className="relative mt-16 hidden lg:block">
            <ConnectorLines />
            <div className="relative grid grid-cols-[1fr_minmax(340px,420px)_1fr] items-center gap-x-10 xl:gap-x-14">
              {/* Left column: 4 hooks */}
              <div className="grid gap-5">
                {leftHooks.map((h) => (
                  <HookCard key={`dl-${h.label}`} hook={h} alignRight />
                ))}
              </div>

              {/* Centre: DPP card */}
              <div className="relative">
                <DppCard />
              </div>

              {/* Right column: 4 hooks */}
              <div className="grid gap-5">
                {rightHooks.map((h) => (
                  <HookCard key={`dr-${h.label}`} hook={h} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Mobile / tablet (<lg): card first, hooks 2-up below ── */}
          <div className="mt-12 lg:hidden">
            <div className="mx-auto w-full max-w-md">
              <DppCard />
            </div>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[...leftHooks, ...rightHooks].map((h) => (
                <HookCard key={`m-${h.label}`} hook={h} />
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

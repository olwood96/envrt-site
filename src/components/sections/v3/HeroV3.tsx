"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";
import { DotGridBackground, Eyebrow } from "./_shared";

// ─── Hero v3 ─────────────────────────────────────────────────────────────
// Split A/B annotation test. Top 3 callouts use the SPEC-SHEET pattern
// (numbered dots on the garment + a clean numbered legend below). Bottom 3
// use the HANGTAG pattern (small rectangular tags hanging from string on
// the photo edges). Same garment, two patterns visible side-by-side so we
// can pick the final treatment.

type SpecAnnotation = {
  index: string;
  label: string;
  /** Anchor point on the photo (% of container). */
  at: { x: number; y: number };
};

type Hangtag = {
  index: string;
  label: string;
  /** Anchor on the garment where the string attaches (% of container). */
  at: { x: number; y: number };
  /** Where the tag sits relative to the anchor (% of container). */
  tagAt: { x: number; y: number };
  rotation: number;
};

const SPEC_ANNOTATIONS: SpecAnnotation[] = [
  { index: "01", label: "Composition",   at: { x: 50, y: 14 } },
  { index: "02", label: "Supply chain",  at: { x: 35, y: 33 } },
  { index: "03", label: "Brand voice",   at: { x: 50, y: 50 } },
];

const HANGTAGS: Hangtag[] = [
  { index: "04", label: "Care + LCA", at: { x: 50, y: 75 }, tagAt: { x: 18, y: 92 }, rotation: -4 },
  { index: "05", label: "Scan + DPP", at: { x: 66, y: 62 }, tagAt: { x: 90, y: 75 }, rotation: 3 },
  { index: "06", label: "Eco-Score",  at: { x: 64, y: 86 }, tagAt: { x: 90, y: 95 }, rotation: -2 },
];

const CHIPS = ["Composition", "Supply chain", "Brand voice", "Care + LCA", "Scan + DPP", "Eco-Score"];

export function HeroV3() {
  return (
    <section className="relative overflow-hidden bg-envrt-brand-vista">
      <DotGridBackground opacity={0.04} size={22} />
      <ConstructionMarks />

      <div className="relative mx-auto max-w-[1280px] px-5 pt-24 pb-16 sm:px-8 sm:pt-28 lg:px-12 lg:grid lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:pt-32 lg:pb-24">
        {/* Left: copy */}
        <div className="max-w-xl lg:py-12">
          <FadeUp>
            <Eyebrow>EU ESPR · Ready</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="mt-5 font-display text-[2.25rem] font-semibold leading-[1.04] tracking-[-0.025em] text-envrt-brand-black sm:text-5xl lg:text-[3.5rem]">
              Digital Product Passports for fashion brands.
            </h1>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-envrt-brand-black/70 sm:text-base">
              Emissions, water scarcity and Eco-Score for every garment. Attach
              a QR to the care label. Customers scan, regulators audit.
            </p>
          </FadeUp>
          <FadeUp delay={0.24}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                href="/free-dpp"
                size="md"
                className="w-full !bg-envrt-brand-ultramarine !text-white shadow-[0_12px_28px_-14px_rgba(62,0,255,0.7)] hover:!bg-envrt-brand-ultramarine/90 sm:w-auto sm:px-7 sm:py-3 sm:text-base"
                data-cta="hero-v3-free-dpp"
              >
                Get a free DPP<span className="ml-2">→</span>
              </Button>
              <Button
                href="/contact"
                variant="ghost"
                size="md"
                className="w-full sm:w-auto sm:px-3 sm:py-3 sm:text-base"
                data-cta="hero-v3-book-demo"
              >
                Book a demo<span className="ml-1.5">→</span>
              </Button>
            </div>
          </FadeUp>
        </div>

        {/* Right: garment with annotations */}
        <FadeUp delay={0.2}>
          <div className="mt-12 lg:mt-0">
            {/* Desktop garment composition */}
            <div className="relative hidden lg:block">
              <GarmentComposition />
            </div>

            {/* Mobile / tablet — clean photo, chip strip below */}
            <div className="relative lg:hidden">
              <GarmentCompositionMobile />
              <div
                className="-mx-5 mt-8 overflow-x-auto px-5 sm:mx-0 sm:px-0"
                style={{ scrollbarWidth: "none" }}
              >
                <ul className="flex min-w-max gap-2 sm:flex-wrap sm:gap-2.5">
                  {CHIPS.map((c, i) => (
                    <li
                      key={c}
                      className="inline-flex items-center gap-1.5 rounded-full border border-envrt-brand-black/10 bg-white px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-envrt-brand-black/75 sm:text-[11px]"
                    >
                      <span className="text-envrt-brand-black/35">
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Desktop garment composition ──────────────────────────────────────────

function GarmentComposition() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      {/* Photo area */}
      <div className="relative aspect-[4/5] w-full">
        {/* Soft stone backplate */}
        <div
          aria-hidden
          className="absolute inset-x-6 bottom-2 top-10 rounded-[2.4rem] bg-envrt-stone"
        />

        {/* Hoodie */}
        <div className="absolute inset-0 z-10">
          <Image
            src="/jacket.png"
            alt="Sustainable hoodie"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-contain drop-shadow-[0_30px_60px_rgba(14,14,14,0.16)]"
            priority
          />
        </div>

        {/* Angry Pablo tag — side detail */}
        <div className="absolute right-0 top-8 z-20 w-32 -rotate-6 sm:w-36 lg:w-40">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-white shadow-[0_18px_40px_-12px_rgba(14,14,14,0.25)] ring-1 ring-envrt-brand-black/8">
            <Image
              src="/v3-assets/angry-pablo-tag.jpg"
              alt="ENVRT-issued Angry Pablo hangtag"
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
          <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-envrt-brand-black/55">
            Angry Pablo · live
          </p>
        </div>

        {/* ── PATTERN A: spec-sheet — numbered dots on the garment ── */}
        {SPEC_ANNOTATIONS.map((a) => (
          <span
            key={`spec-${a.index}`}
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${a.at.x}%`, top: `${a.at.y}%` }}
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-envrt-brand-black ring-2 ring-envrt-brand-vista" />
              <span className="relative font-mono text-[9px] font-bold leading-none text-envrt-brand-vista">
                {a.index}
              </span>
            </span>
          </span>
        ))}

        {/* ── PATTERN B: hangtag — string + paper tag ── */}
        {HANGTAGS.map((h) => (
          <HangtagCallout key={`tag-${h.index}`} hangtag={h} />
        ))}
      </div>

      {/* Spec-sheet legend below the photo (Pattern A) */}
      <div className="mt-6 border-t border-envrt-brand-black/12 pt-4">
        <p className="mb-2 font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-envrt-brand-black/40">
          Pattern A · spec-sheet legend
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {SPEC_ANNOTATIONS.map((a) => (
            <li
              key={`legend-${a.index}`}
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-envrt-brand-black"
            >
              <span className="font-bold">{a.index}</span>
              <span className="text-envrt-brand-black/30">—</span>
              <span>{a.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Single hangtag — string + tag ───────────────────────────────────────

function HangtagCallout({ hangtag }: { hangtag: Hangtag }) {
  return (
    <>
      {/* Thread line from anchor on garment to the tag */}
      <svg
        aria-hidden
        className="absolute inset-0 z-25 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line
          x1={hangtag.at.x}
          y1={hangtag.at.y}
          x2={hangtag.tagAt.x}
          y2={hangtag.tagAt.y - 4}
          stroke="rgba(26,26,26,0.55)"
          strokeWidth="0.25"
          vectorEffect="non-scaling-stroke"
        />
        {/* Anchor knot */}
        <circle
          cx={hangtag.at.x}
          cy={hangtag.at.y}
          r="0.45"
          className="fill-envrt-brand-black"
        />
      </svg>

      {/* Hangtag card */}
      <div
        className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${hangtag.tagAt.x}%`,
          top: `${hangtag.tagAt.y}%`,
          transform: `translate(-50%, -50%) rotate(${hangtag.rotation}deg)`,
        }}
      >
        <div className="relative bg-white px-3 py-1.5 shadow-[0_10px_22px_-10px_rgba(14,14,14,0.25)] ring-1 ring-envrt-brand-black/15">
          {/* Top notch for the string hole */}
          <span
            aria-hidden
            className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-envrt-brand-vista ring-1 ring-envrt-brand-black/30"
          />
          <span className="inline-flex items-center gap-1.5">
            <span className="font-mono text-[8px] font-bold tracking-wider text-envrt-brand-black/45">
              {hangtag.index}
            </span>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-envrt-brand-black">
              {hangtag.label}
            </span>
          </span>
        </div>
      </div>
    </>
  );
}

// ─── Mobile composition ──────────────────────────────────────────────────

function GarmentCompositionMobile() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[440px]">
      <div
        aria-hidden
        className="absolute inset-x-4 bottom-2 top-8 rounded-[2.2rem] bg-envrt-stone"
      />
      <div className="absolute inset-0 z-10">
        <Image
          src="/jacket.png"
          alt="Sustainable hoodie"
          fill
          sizes="(max-width: 1024px) 100vw, 440px"
          className="object-contain drop-shadow-[0_20px_40px_rgba(14,14,14,0.16)]"
          priority
        />
      </div>
      <div className="absolute right-2 top-4 z-20 w-20 -rotate-6 sm:right-4 sm:w-24">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white shadow-[0_14px_30px_-10px_rgba(14,14,14,0.22)] ring-1 ring-envrt-brand-black/8">
          <Image
            src="/v3-assets/angry-pablo-tag.jpg"
            alt="ENVRT-issued Angry Pablo hangtag"
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Construction marks at section corners ────────────────────────────────

function ConstructionMarks() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <span className="absolute left-4 top-20 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:left-6 sm:top-24">
        04x
      </span>
      <span className="absolute right-4 top-20 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:right-6 sm:top-24">
        08x
      </span>
      <span className="absolute bottom-4 left-4 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:bottom-6 sm:left-6">
        ENVRT/01
      </span>
      <span className="absolute bottom-4 right-4 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:bottom-6 sm:right-6">
        v3
      </span>
    </div>
  );
}

"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";

// ─── Hero v3 ─────────────────────────────────────────────────────────────
// Clean editorial product hero. Hoodie is the anchor. Six annotations point
// AT the garment via thin aqua lines + small dots — no card backgrounds.
// The Angry Pablo tag rides as a side detail, not the centerpiece.
//
// Mobile: no annotations on the image, just a compact horizontal scroll of
// capability chips below. Avoids the dense stacked-card pattern we had.

type Annotation = {
  label: string;
  /** Anchor on the photo where the line terminates (% of container). */
  point: { x: number; y: number };
  /** Where the label sits relative to the anchor. */
  label_at: { x: number; y: number };
};

const ANNOTATIONS: Annotation[] = [
  { label: "Composition",   point: { x: 50, y: 12 }, label_at: { x: 50, y: 2 } },
  { label: "Supply chain",  point: { x: 32, y: 32 }, label_at: { x: 8, y: 28 } },
  { label: "Brand voice",   point: { x: 50, y: 48 }, label_at: { x: 8, y: 56 } },
  { label: "Care + LCA",    point: { x: 50, y: 72 }, label_at: { x: 8, y: 78 } },
  { label: "Scan + DPP",    point: { x: 68, y: 60 }, label_at: { x: 92, y: 56 } },
  { label: "Eco-Score",     point: { x: 65, y: 86 }, label_at: { x: 92, y: 86 } },
];

const CHIPS = ["Composition", "Supply chain", "Brand voice", "Care + LCA", "Scan + DPP", "Eco-Score"];

export function HeroV3() {
  return (
    <section className="relative overflow-hidden bg-envrt-brand-vista">
      {/* Aqua wash behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[50%] h-[440px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-envrt-brand-ultramarine/[0.08] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1280px] px-5 pt-24 pb-16 sm:px-8 sm:pt-28 lg:px-12 lg:grid lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:pt-32 lg:pb-24">
        {/* Left: copy */}
        <div className="max-w-xl lg:py-12">
          <FadeUp>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[11px]">
              EU ESPR · Ready
            </p>
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
                className="w-full sm:w-auto sm:px-7 sm:py-3 sm:text-base"
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
            {/* Annotated garment composition — desktop */}
            <div className="relative hidden lg:block">
              <GarmentComposition />
            </div>

            {/* Mobile / tablet — clean photo, no on-image annotations */}
            <div className="relative lg:hidden">
              <GarmentCompositionMobile />
              {/* Compact chip row below */}
              <div
                className="-mx-5 mt-8 overflow-x-auto px-5 sm:mx-0 sm:px-0"
                style={{ scrollbarWidth: "none" }}
              >
                <ul className="flex min-w-max gap-2 sm:flex-wrap sm:gap-2.5">
                  {CHIPS.map((c) => (
                    <li
                      key={c}
                      className="inline-flex items-center gap-1.5 rounded-full border border-envrt-brand-black/10 bg-white px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-envrt-brand-black/75 sm:text-[11px]"
                    >
                      <span aria-hidden className="h-1 w-1 rounded-full bg-envrt-brand-ultramarine" />
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

// ─── Desktop composition ─────────────────────────────────────────────────

function GarmentComposition() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[560px]">
      {/* Soft stone backplate */}
      <div
        aria-hidden
        className="absolute inset-x-6 bottom-2 top-10 rounded-[2.4rem] bg-envrt-stone"
      />

      {/* Hoodie photo */}
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

      {/* Angry Pablo tag — small side detail, not the centerpiece */}
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

      {/* Annotation overlay */}
      <svg
        aria-hidden
        className="absolute inset-0 z-30 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {ANNOTATIONS.map((a, i) => (
          <g key={a.label}>
            {/* Connector line: from anchor to label */}
            <line
              x1={a.point.x}
              y1={a.point.y}
              x2={a.label_at.x}
              y2={a.label_at.y}
              stroke="currentColor"
              strokeWidth="0.6"
              strokeDasharray={i % 2 ? "1.2 1.2" : "none"}
              vectorEffect="non-scaling-stroke"
              className="text-envrt-brand-ultramarine/55"
            />
            {/* Anchor dot on garment */}
            <circle
              cx={a.point.x}
              cy={a.point.y}
              r="0.5"
              className="fill-envrt-brand-ultramarine"
            />
            <circle
              cx={a.point.x}
              cy={a.point.y}
              r="0.18"
              className="fill-white"
            />
          </g>
        ))}
      </svg>

      {/* Annotation labels — positioned via inline style as % of container */}
      {ANNOTATIONS.map((a) => (
        <p
          key={`label-${a.label}`}
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-envrt-brand-black/85"
          style={{
            left: `${a.label_at.x}%`,
            top: `${a.label_at.y}%`,
          }}
        >
          {a.label}
        </p>
      ))}
    </div>
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
      {/* Tag detail (smaller on mobile) */}
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

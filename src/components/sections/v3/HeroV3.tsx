"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";

// ─── Annotated DPP hero (v3.next, light) ─────────────────────────────────
// Centre: a clean DPP fact-sheet card. Around it on desktop: 8 hook cards,
// 4 per side, stacked vertically. No connector lines or floating dots —
// proximity and grid alignment do the annotation work.

type Hook = {
  label: string;
  title: string;
  body: string;
};

const leftHooks: Hook[] = [
  { label: "LCA METRICS",      title: "CO₂e and water scarcity", body: "Per-garment, ISO 14040 LCA." },
  { label: "SUPPLY CHAIN",     title: "Tier-by-tier provenance", body: "Fibre to factory, fully mapped." },
  { label: "ECO-SCORE",        title: "Coût Environnemental",    body: "French government-recognised label." },
  { label: "STORY",            title: "Your editorial voice",    body: "Photos, provenance, repair guidance." },
];

const rightHooks: Hook[] = [
  { label: "ESPR-READY",       title: "Compliance reporting",    body: "EU PEF · ISO 14040 · AWARE." },
  { label: "LIVE ANALYTICS",   title: "Scan, country, dwell",    body: "Per-SKU and brand-wide dashboards." },
  { label: "30-MIN ONBOARDING",title: "Collection to DPP",       body: "CSV or line-sheet upload, AI gap-fill." },
  { label: "QR + HOSTED",      title: "Care label or hangtag",   body: "Resolves on envrt.com or your domain." },
];

// ─── Single hook card ────────────────────────────────────────────────────
function HookCard({ hook }: { hook: Hook }) {
  return (
    <div className="rounded-2xl border border-envrt-ink/8 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-envrt-aqua/40 hover:shadow-[0_12px_30px_-12px_rgba(14,14,14,0.10)] sm:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-aqua">
        {hook.label}
      </p>
      <p className="mt-2 font-manrope text-sm font-semibold leading-snug tracking-tight text-envrt-ink sm:text-base">
        {hook.title}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-envrt-charcoal/65 sm:text-[13px]">
        {hook.body}
      </p>
    </div>
  );
}

// ─── Centre DPP card ─────────────────────────────────────────────────────
function DppCard() {
  const rows = [
    { k: "Composition",    v: "100% Organic Cotton" },
    { k: "Origin",         v: "Türkiye, Izmir" },
    { k: "Care",           v: "Machine wash 30°" },
    { k: "CO₂e",           v: "6.3 kg" },
    { k: "Water",          v: "12,400 L AWARE" },
    { k: "Certifications", v: "GOTS · OEKO-TEX 100" },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-envrt-ink/8 bg-white shadow-[0_30px_60px_-25px_rgba(14,14,14,0.18)]">
      {/* Photo block */}
      <div className="relative aspect-[5/4] w-full bg-envrt-stone">
        <Image
          src="/jacket.png"
          alt="Organic cotton hoodie, sample DPP product"
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 60vw, 80vw"
          className="object-contain"
          priority
        />
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

// ─── Hero shell ──────────────────────────────────────────────────────────

export function HeroV3() {
  return (
    <section className="relative overflow-hidden bg-envrt-offwhite">
      {/* Subtle aqua wash behind the centre card, very low opacity */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[55%] h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-envrt-aqua/[0.08] blur-3xl"
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
            <h1 className="mt-5 font-manrope text-[2rem] font-semibold leading-[1.06] tracking-[-0.025em] text-envrt-ink sm:text-5xl lg:text-[3.5rem]">
              Digital Product Passports for fashion brands.
            </h1>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-envrt-charcoal/70 sm:text-base">
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
                className="w-full sm:w-auto sm:px-3 sm:py-3 sm:text-base"
                data-cta="hero-v3-book-demo"
              >
                Book a demo<span className="ml-1.5">→</span>
              </Button>
            </div>
          </FadeUp>
        </div>

        {/* DPP + hooks composition */}
        <FadeUp delay={0.32}>
          {/* ── Desktop (≥lg): 3-column grid, hooks flanking card ── */}
          <div className="mt-14 hidden lg:block">
            <div className="grid grid-cols-[1fr_minmax(360px,440px)_1fr] items-center gap-x-10 xl:gap-x-14">
              <div className="grid gap-5">
                {leftHooks.map((h) => (
                  <HookCard key={`dl-${h.label}`} hook={h} />
                ))}
              </div>

              <div className="relative">
                <DppCard />
              </div>

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

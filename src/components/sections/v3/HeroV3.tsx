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
// Real-world hangtag from Angry Pablo, an ENVRT-equipped brand. The photo
// IS the proof — the 8 hooks around it describe what scanning the QR opens.
function DppCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-envrt-ink/8 bg-white shadow-[0_30px_60px_-25px_rgba(14,14,14,0.18)]">
      {/* Photo block — the real product */}
      <div className="relative aspect-[4/5] w-full bg-envrt-stone">
        <Image
          src="/v3-assets/angry-pablo-tag.jpg"
          alt="Angry Pablo cycling jersey hangtag with ENVRT QR Digital Product Passport"
          fill
          sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 80vw"
          className="object-cover"
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

      {/* Caption strip */}
      <div className="border-t border-envrt-ink/8 px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-aqua">
          In the wild
        </p>
        <p className="mt-1.5 font-manrope text-base font-semibold leading-snug tracking-tight text-envrt-ink sm:text-lg">
          Angry Pablo · Short Sleeve Cycling Jersey
        </p>
        <p className="mt-1 text-xs text-envrt-charcoal/60 sm:text-[13px]">
          Care label, ENVRT-verified Digital Product Passport.
        </p>
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

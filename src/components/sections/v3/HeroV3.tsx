"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";
import { DotGridBackground, Eyebrow } from "./_shared";
import { HeroSupplyChainPreview } from "./HeroSupplyChainPreview";

// ─── Hero ────────────────────────────────────────────────────────────────
// Stats sit inline under the CTAs on the left so the right column has full
// height for the garment annotation diagram and the supply chain map.

export function HeroV3() {
  return (
    <section className="relative overflow-hidden bg-envrt-brand-vista">
      <DotGridBackground opacity={0.04} size={22} />

      <div className="relative mx-auto max-w-[1320px] px-5 pt-20 pb-12 sm:px-8 sm:pt-24 lg:px-12 lg:grid lg:grid-cols-[1fr_1fr] lg:gap-12 lg:pt-24 lg:pb-16">
        {/* ── Left column ── */}
        <div className="max-w-xl lg:flex lg:flex-col lg:justify-between lg:py-8">
          {/* Heading + body */}
          <div>
            <FadeUp>
              <Eyebrow>DPPs in minutes, not months</Eyebrow>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h1 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-5xl lg:text-[3.5rem]">
                Supply chain, LCA and DPP.{" "}
                <span className="text-envrt-brand-black/45">
                  Built by us, end to end.
                </span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.16}>
              <p className="mt-5 max-w-md text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg">
                ENVRT helps fashion brands map their supply chain, calculate
                every garment and publish a hosted Digital Product Passport.
                Every layer ours, no outside partners in the middle.
              </p>
            </FadeUp>
          </div>

          {/* CTAs */}
          <FadeUp delay={0.28}>
            <div className="mt-7 flex flex-col gap-3 lg:mt-0 sm:flex-row sm:items-center">
              <Button
                href="/free-dpp"
                size="md"
                className="w-full !bg-envrt-brand-ultramarine !text-white shadow-[0_12px_28px_-14px_rgba(62,0,255,0.7)] hover:!bg-envrt-brand-ultramarine/90 sm:w-auto sm:px-7 sm:py-3 sm:text-base"
                data-cta="hero-v3-try-one-garment"
              >
                Try ENVRT on one garment<span className="ml-2">→</span>
              </Button>
              <Button
                href="/contact"
                variant="ghost"
                size="md"
                className="w-full sm:w-auto sm:px-7 sm:py-3 sm:text-base"
                data-cta="hero-v3-book-demo"
              >
                Book a demo<span className="ml-1.5">→</span>
              </Button>
            </div>
          </FadeUp>

          {/* Stats — desktop only, vertical list pinned to bottom */}
          <div className="hidden lg:block">
            <FadeUp delay={0.38}>
              <div className="divide-y divide-envrt-brand-black/[0.08] border-t border-envrt-brand-black/[0.08]">
                <StatItem value="<30" unit="min" label="First live DPP" />
                <StatItem value="75+" label="Brands & partners" />
                <StatItem value="27" label="EU markets" />
              </div>
            </FadeUp>
          </div>
        </div>

        {/* ── Right column ── */}
        <FadeUp delay={0.2}>
          <div className="mt-8 lg:mt-0">
            {/* Desktop: annotation diagram + supply chain map */}
            <div className="hidden lg:block">
              <GarmentPhotoDesktop />
              {/* Connector — negative margin pulls up through transparent PNG bottom to sit at the visual hem */}
              <div className="relative z-10 -mt-[150px] flex flex-col items-center">
                <div className="h-2.5 w-2.5 rounded-full border border-envrt-brand-black/30 bg-white shadow-sm" />
                <div className="h-10 w-px bg-envrt-brand-black/[0.16]" />
              </div>
              <div className="mx-auto max-w-[400px]">
                <HeroSupplyChainPreview />
              </div>
            </div>
            {/* Mobile: same annotated garment, sizes scale down */}
            <div className="lg:hidden">
              <GarmentPhotoDesktop />
            </div>
          </div>
        </FadeUp>

        {/* Stats — mobile only, sits below the garment image */}
        <div className="mt-2 lg:hidden">
          <FadeUp delay={0.44}>
            <div className="divide-y divide-envrt-brand-black/[0.08] border-t border-envrt-brand-black/[0.08]">
              <StatItem value="<30" unit="min" label="First live DPP" />
              <StatItem value="75+" label="Brands & partners" />
              <StatItem value="27" label="EU markets" />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Inline stat item ─────────────────────────────────────────────────────

function StatItem({ value, unit, label }: { value: string; unit?: string; label: string }) {
  return (
    <div className="py-4">
      <p className="font-display text-[1.65rem] font-medium leading-none tracking-[-0.025em] text-envrt-brand-black">
        {value}
        {unit && (
          <span className="ml-1 text-sm font-medium tracking-normal text-envrt-brand-black/50">
            {unit}
          </span>
        )}
      </p>
      <p className="mt-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-envrt-brand-black/50">
        {label}
      </p>
    </div>
  );
}

// ─── Desktop garment photo with annotation lines ──────────────────────────
// Three outputs annotated with flat marker lines from the garment:
//   Left  → Ecoscore card, line from left chest/pocket (~58% down)
//   Right → QR / DPP card, line from right shoulder (~24% down)
// Supply chain map is connected below via a dot+line in the parent.

function GarmentPhotoDesktop() {
  return (
    <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[420px] lg:max-w-[560px]">
      <div className="relative aspect-square w-full">
        {/* Hoodie */}
        <div className="absolute inset-0 z-10">
          <Image
            src="/jacket.png"
            alt="ENVRT-equipped hoodie"
            fill
            sizes="(min-width: 1024px) 740px, (min-width: 640px) 420px, 300px"
            className="object-contain drop-shadow-[0_40px_80px_rgba(14,14,14,0.18)]"
            priority
          />
        </div>

        {/* LEFT annotation: Coût Environnemental */}
        <div className="absolute left-0 top-[58%] z-20 -translate-y-1/2">
          <p className="mb-1 font-mono text-[6px] uppercase tracking-[0.14em] text-envrt-brand-black/38 sm:mb-1.5 sm:text-[7px] lg:text-[8px]">
            Coût Environnemental
          </p>
          <div className="flex items-center">
            <div className="w-[100px] flex-shrink-0 rounded-lg bg-white p-1.5 ring-1 ring-black/[0.07] shadow-[0_12px_28px_-8px_rgba(14,14,14,0.18)] sm:w-[155px] sm:rounded-xl sm:p-2 lg:w-[210px] lg:p-3">
              <Image
                src="/v3-assets/angry-pablo-ecoscore.svg"
                alt="Coût environnemental: 1573 points d'impact, 449 pour 100g"
                width={240}
                height={120}
                className="block h-auto w-full"
                unoptimized
              />
            </div>
            <div className="h-px w-6 flex-shrink-0 bg-envrt-brand-black/[0.16] sm:w-10 lg:w-16" />
            <div className="h-2 w-2 flex-shrink-0 rounded-full border border-envrt-brand-black/30 bg-white shadow-sm sm:h-2.5 sm:w-2.5" />
          </div>
        </div>

        {/* RIGHT annotation: Digital Product Passport */}
        <div className="absolute right-0 top-[22%] z-20">
          <p className="mb-1 text-right font-mono text-[6px] uppercase tracking-[0.14em] text-envrt-brand-black/38 sm:mb-1.5 sm:text-[7px] lg:text-[8px]">
            Digital Product Passport
          </p>
          <div className="flex items-center">
            <div className="h-2 w-2 flex-shrink-0 rounded-full border border-envrt-brand-black/30 bg-white shadow-sm sm:h-2.5 sm:w-2.5" />
            <div className="h-px w-6 flex-shrink-0 bg-envrt-brand-black/[0.16] sm:w-10 lg:w-16" />
            <div className="w-[72px] flex-shrink-0 rounded-lg bg-white p-1.5 ring-1 ring-black/[0.07] shadow-[0_12px_28px_-8px_rgba(14,14,14,0.18)] sm:w-[110px] sm:rounded-xl sm:p-2 lg:w-[148px] lg:p-3">
              <Image
                src="/qr-code.png"
                alt="Scan to view Digital Product Passport"
                width={148}
                height={148}
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


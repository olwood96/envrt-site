"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";
import { DotGridBackground, Eyebrow } from "./_shared";
import { BrandStripV3 } from "./BrandStripV3";

// ─── Hero ────────────────────────────────────────────────────────────────
// Positions ENVRT as a small team running fashion's environmental work
// end to end. Hero copy leads with that worldview plus the speed hook
// (DPPs in minutes, not months). Garment photo carries no labels. A
// compact brand proof strip closes the hero with one rotating brand
// logo plus two trust stats.

export function HeroV3() {
  return (
    <section className="relative overflow-hidden bg-envrt-brand-vista">
      <DotGridBackground opacity={0.04} size={22} />

      <div className="relative mx-auto max-w-[1320px] px-5 pt-20 pb-8 sm:px-8 sm:pt-24 lg:px-12 lg:grid lg:grid-cols-[1fr_1fr] lg:gap-12 lg:pt-24 lg:pb-10">
        <div className="max-w-xl lg:py-8">
          <FadeUp>
            <Eyebrow>DPPs in minutes, not months</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="mt-5 font-display text-[1.85rem] font-semibold leading-[1.04] tracking-[-0.025em] text-envrt-brand-black sm:text-5xl lg:text-[3.5rem]">
              Supply chain, LCA and DPP.{" "}
              <span className="text-envrt-brand-black/45">
                Built by us, end to end.
              </span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-envrt-brand-black/70 sm:text-base">
              ENVRT is a small team helping fashion brands map their supply
              chain, calculate every garment and publish a hosted Digital
              Product Passport. Every layer ours, no outside partners in the
              middle.
            </p>
          </FadeUp>
          <FadeUp delay={0.28}>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
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
                className="w-full sm:w-auto sm:px-3 sm:py-3 sm:text-base"
                data-cta="hero-v3-book-demo"
              >
                Book a demo<span className="ml-1.5">→</span>
              </Button>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.2}>
          <div className="mt-12 lg:mt-0">
            <div className="relative hidden lg:block">
              <GarmentPhoto variant="desktop" />
            </div>
            <div className="relative lg:hidden">
              <GarmentPhoto variant="mobile" />
            </div>
          </div>
        </FadeUp>
      </div>

      <div className="relative mx-auto max-w-[1320px] px-5 pb-10 sm:px-8 lg:px-12 lg:pb-14">
        <FadeUp delay={0.3}>
          <BrandStripV3 />
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Garment photo ───────────────────────────────────────────────────────
// Clean photo, no annotation system. The product is the product; the
// platform breadth lives in the capability strip below.

function GarmentPhoto({ variant }: { variant: "desktop" | "mobile" }) {
  const isDesktop = variant === "desktop";
  return (
    <div
      className={`relative mx-auto w-full ${isDesktop ? "max-w-[460px]" : "max-w-[380px]"}`}
    >
      <div className="relative aspect-[4/5] w-full">
        <div
          aria-hidden
          className={`absolute ${isDesktop ? "inset-x-6 bottom-2 top-10 rounded-[2.4rem]" : "inset-x-4 bottom-2 top-8 rounded-[2.2rem]"} bg-envrt-stone`}
        />
        <div className="absolute inset-0 z-10">
          <Image
            src="/jacket.png"
            alt="ENVRT-equipped hoodie"
            fill
            sizes={isDesktop ? "(min-width: 1024px) 560px, 100vw" : "(max-width: 1024px) 100vw, 440px"}
            className={`object-contain ${isDesktop ? "drop-shadow-[0_30px_60px_rgba(14,14,14,0.16)]" : "drop-shadow-[0_20px_40px_rgba(14,14,14,0.16)]"}`}
            priority
          />
        </div>

        {/* Official French Coût Environnemental label for the hoodie. The
            SVG is the calculated score from Ecobalyse; per their policy the
            label cannot be redrawn or restyled, so it sits inside a white
            card pinned to the hoodie image. Slightly tilted so it reads as
            hand-pinned rather than chrome. */}
        <div
          className={`absolute z-20 ${isDesktop ? "right-0 top-8 w-52 sm:w-56" : "right-2 top-4 w-36 sm:right-4 sm:w-44"} rotate-[6deg]`}
        >
          <div
            className={`relative rounded-xl bg-white ${isDesktop ? "p-2 shadow-[0_18px_40px_-12px_rgba(14,14,14,0.25)]" : "p-1.5 shadow-[0_14px_30px_-10px_rgba(14,14,14,0.22)]"} ring-1 ring-envrt-brand-black/8`}
          >
            <Image
              src="/v3-assets/angry-pablo-ecoscore.svg"
              alt="Coût environnemental: 1573 points d'impact, 449 pour 100g"
              width={180}
              height={90}
              className="block h-auto w-full"
              unoptimized
            />
          </div>
          {isDesktop && (
            <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-envrt-brand-black/55">
              Coût Environnemental
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


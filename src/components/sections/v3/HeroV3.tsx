"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";
import { DotGridBackground, Eyebrow } from "./_shared";
import { BrandStripV3 } from "./BrandStripV3";

// ─── Hero ────────────────────────────────────────────────────────────────
// Positions ENVRT as running fashion's environmental work end to end.
// Hero copy leads with that worldview plus the speed hook (DPPs in
// minutes, not months). Garment photo carries no labels. A compact
// brand proof strip closes the hero with one rotating brand logo plus
// two trust stats.

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
                className="w-full sm:w-auto sm:px-7 sm:py-3 sm:text-base"
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
// Hoodie floats on the section background, grounded by a soft radial
// shadow. Labels are split across the garment: ecoscore lower-left at
// -5deg (pocket area), QR mid-right at +4deg (sleeve level). Diagonal
// tension, no stacking.

function GarmentPhoto({ variant }: { variant: "desktop" | "mobile" }) {
  const isDesktop = variant === "desktop";
  return (
    <div
      className={`relative mx-auto w-full ${isDesktop ? "max-w-[520px]" : "max-w-[400px]"}`}
    >
      <div className="relative aspect-[4/5] w-full">
        {/* Soft ground shadow — anchors without boxing */}
        <div
          aria-hidden
          className="absolute bottom-[4%] left-1/2 h-10 w-[55%] -translate-x-1/2 rounded-full bg-envrt-brand-black/[0.07] blur-3xl"
        />

        {/* Hoodie */}
        <div className="absolute inset-0 z-10">
          <Image
            src="/jacket.png"
            alt="ENVRT-equipped hoodie"
            fill
            sizes={isDesktop ? "(min-width: 1024px) 620px, 100vw" : "(max-width: 1024px) 480px, 100vw"}
            className={`object-contain ${isDesktop ? "drop-shadow-[0_40px_80px_rgba(14,14,14,0.18)]" : "drop-shadow-[0_28px_56px_rgba(14,14,14,0.16)]"}`}
            priority
          />
        </div>

        {/* Ecoscore — lower-left, angled like a swing tag at the pocket.
            SVG has no built-in background; per Ecobalyse policy it cannot
            be redrawn or restyled, so it sits in a minimal white card. */}
        <div
          className={`absolute z-20 -rotate-[5deg] ${
            isDesktop
              ? "bottom-[22%] left-2 w-44 sm:w-48"
              : "bottom-[20%] left-1 w-28 sm:w-32"
          }`}
        >
          <div
            className={`rounded-xl bg-white ${
              isDesktop
                ? "p-2 shadow-[0_20px_48px_-10px_rgba(14,14,14,0.22)]"
                : "p-1.5 shadow-[0_14px_34px_-8px_rgba(14,14,14,0.18)]"
            }`}
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
        </div>

        {/* QR — mid-right at sleeve height, opposite angle to ecoscore */}
        <div
          className={`absolute z-20 rotate-[4deg] ${
            isDesktop
              ? "right-2 top-[35%] w-[112px]"
              : "right-1 top-[37%] w-[76px]"
          }`}
        >
          {isDesktop && (
            <p className="mb-1.5 text-center font-mono text-[8px] uppercase tracking-[0.16em] text-envrt-brand-black/45">
              Digital Product Passport
            </p>
          )}
          <div
            className={`rounded-xl bg-white ${
              isDesktop
                ? "p-2.5 shadow-[0_16px_36px_-8px_rgba(14,14,14,0.22)]"
                : "p-2 shadow-[0_10px_24px_-6px_rgba(14,14,14,0.18)]"
            }`}
          >
            <Image
              src="/qr-code.png"
              alt="Scan to view Digital Product Passport"
              width={112}
              height={112}
              className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


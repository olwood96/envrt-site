"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";
import { AssetIcon, type AssetIconType } from "./AssetIcon";
import { DotGridBackground, Eyebrow } from "./_shared";

// ─── Hero ────────────────────────────────────────────────────────────────
// Positions ENVRT as the environmental engine for fashion, with the DPP
// reframed as the final output rather than the product. Hero copy leads
// with what the platform does end to end (supplier mapping → LCA → water
// → score → DPP). Garment photo carries no labels; the stat strip below
// it lists the six capabilities the platform brings.

type Capability = {
  icon: AssetIconType;
  label: string;
  stat: string;
};

const CAPABILITIES: Capability[] = [
  { icon: "supply-chain", label: "Supply chain",  stat: "4 tiers, fibre to factory" },
  { icon: "lca",          label: "In-house LCA",  stat: "EU PEF · ISO 14040" },
  { icon: "compliance",   label: "Water · AWARE", stat: "UN water scarcity model" },
  { icon: "eco-score",    label: "Eco-Score",     stat: "FR regulator-aligned" },
  { icon: "dpp",          label: "Hosted DPP",    stat: "Permanent URL + QR" },
  { icon: "vault",        label: "Evidence vault", stat: "Versioned and signed" },
];

export function HeroV3() {
  return (
    <section className="relative overflow-hidden bg-envrt-brand-vista">
      <DotGridBackground opacity={0.04} size={22} />
      <ConstructionMarks />

      <div className="relative mx-auto max-w-[1280px] px-5 pt-24 pb-12 sm:px-8 sm:pt-28 lg:px-12 lg:grid lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:pt-32 lg:pb-16">
        <div className="max-w-xl lg:py-12">
          <FadeUp>
            <Eyebrow>Environmental platform · for fashion</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="mt-5 font-display text-[2.25rem] font-semibold leading-[1.04] tracking-[-0.025em] text-envrt-brand-black sm:text-5xl lg:text-[3.5rem]">
              Built for fashion&apos;s environmental work.{" "}
              <span className="text-envrt-brand-black/45">
                Not just the receipt at the end.
              </span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-envrt-brand-black/70 sm:text-base">
              Supplier mapping, in-house lifecycle assessment, water scarcity,
              Eco-Score and ESPR-ready Digital Product Passports. One platform.
              EU PEF and ISO 14040 throughout. From £149 a month.
            </p>
          </FadeUp>
          <FadeUp delay={0.24}>
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
                href="/pricing"
                variant="ghost"
                size="md"
                className="w-full sm:w-auto sm:px-3 sm:py-3 sm:text-base"
                data-cta="hero-v3-see-pricing"
              >
                See pricing<span className="ml-1.5">→</span>
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

      <div className="relative mx-auto max-w-[1280px] px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
        <FadeUp delay={0.3}>
          <CapabilityStrip />
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
      className={`relative mx-auto w-full ${isDesktop ? "max-w-[560px]" : "max-w-[440px]"}`}
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

        {/* Real customer hangtag side-detail */}
        <div
          className={`absolute z-20 ${isDesktop ? "right-0 top-8 w-32 sm:w-36 lg:w-40" : "right-2 top-4 w-20 sm:right-4 sm:w-24"} -rotate-6`}
        >
          <div
            className={`relative aspect-[3/4] overflow-hidden ${isDesktop ? "rounded-xl shadow-[0_18px_40px_-12px_rgba(14,14,14,0.25)]" : "rounded-lg shadow-[0_14px_30px_-10px_rgba(14,14,14,0.22)]"} bg-white ring-1 ring-envrt-brand-black/8`}
          >
            <Image
              src="/v3-assets/angry-pablo-tag.jpg"
              alt="ENVRT-issued Angry Pablo hangtag"
              fill
              sizes={isDesktop ? "160px" : "96px"}
              className="object-cover"
            />
          </div>
          {isDesktop && (
            <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-envrt-brand-black/55">
              Angry Pablo · live
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Capability strip ────────────────────────────────────────────────────
// Six capabilities, full width below the hero. Replaces the previous
// numbered annotations on the garment, which never pointed at anything
// physical. Reads as "here's what the platform actually does".

function CapabilityStrip() {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-5 border-t border-envrt-brand-black/10 pt-6 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-6 sm:pt-8 lg:grid-cols-6 lg:gap-x-6">
      {CAPABILITIES.map((cap) => (
        <div key={cap.label} className="flex items-start gap-3">
          <AssetIcon
            type={cap.icon}
            size={20}
            className="mt-0.5 flex-shrink-0 text-envrt-brand-ultramarine"
          />
          <div className="min-w-0">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[10px]">
              {cap.label}
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-envrt-brand-black/75 sm:text-xs">
              {cap.stat}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Construction marks ──────────────────────────────────────────────────
// Brand fingerprint at the section corners. "v3" dev artefact removed.

function ConstructionMarks() {
  const cls =
    "absolute font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <span className={`${cls} left-4 top-20 sm:left-6 sm:top-24`}>04x</span>
      <span className={`${cls} right-4 top-20 sm:right-6 sm:top-24`}>08x</span>
      <span className={`${cls} bottom-4 left-4 sm:bottom-6 sm:left-6`}>
        ENVRT/01
      </span>
    </div>
  );
}

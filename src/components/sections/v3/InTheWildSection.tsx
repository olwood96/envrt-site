"use client";

import Image from "next/image";
import { FadeUp } from "@/components/ui/Motion";
import { EcoScoreLabel } from "@/components/sections/v3/EcoScoreLabel";

// ─── In the wild ─────────────────────────────────────────────────────────
// Replaces the previous "What's in a DPP" bento — that content is already
// covered interactively in the scroll tour. This section instead shows a
// real ENVRT-equipped product so the visitor sees the platform in production
// without marketing scaffolding.

export function InTheWildSection() {
  return (
    <section
      className="relative bg-white py-20 sm:py-24 lg:py-32"
      style={{ overflowX: "clip" }}
    >
      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        {/* Header */}
        <FadeUp>
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="relative inline-flex h-1.5 w-1.5 items-center justify-center"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-envrt-brand-ultramarine opacity-75" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-envrt-brand-ultramarine" />
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[11px]">
              Live · in the wild
            </p>
          </div>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-4xl lg:text-[3rem]">
            Real garments.<br />
            <span className="text-envrt-brand-black/35">Real passports.</span>
          </h2>
        </FadeUp>

        {/* Spotlight card */}
        <FadeUp delay={0.1}>
          <div className="mt-12 grid gap-8 sm:mt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            {/* Visual */}
            <div className="relative">
              <div className="relative aspect-[5/6] w-full overflow-hidden rounded-3xl bg-envrt-stone">
                <Image
                  src="/v3-assets/angry-pablo-tag.jpg"
                  alt="Angry Pablo Short Sleeve Cycling Jersey 001 with ENVRT-issued DPP hangtag"
                  fill
                  sizes="(min-width: 1024px) 580px, 100vw"
                  className="object-cover"
                />
              </div>
              {/* Floating Eco-Score label overlay */}
              <div className="absolute -bottom-5 left-5 sm:left-8 lg:-left-6">
                <EcoScoreLabel score={1573} perHundredG={449} envrtAccent />
              </div>
            </div>

            {/* Detail column */}
            <div className="flex flex-col lg:py-6">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-envrt-brand-black/55 sm:text-[11px]">
                  Brand
                </p>
                <p className="mt-1.5 font-display text-xl font-semibold tracking-tight text-envrt-brand-black sm:text-2xl">
                  Angry Pablo
                </p>
              </div>

              <div className="mt-8">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-envrt-brand-black/55 sm:text-[11px]">
                  Product
                </p>
                <p className="mt-1.5 font-display text-xl font-semibold tracking-tight text-envrt-brand-black sm:text-2xl">
                  Short Sleeve Cycling Jersey 001
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-envrt-brand-black/45">
                  DPP-FA-2026-00742
                </p>
              </div>

              {/* Compact stat grid */}
              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-envrt-brand-black/10 pt-8">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-envrt-brand-black/55">
                    CO₂e
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold tracking-tight text-envrt-brand-black">
                    8.4 <span className="text-base text-envrt-brand-black/45">kg</span>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-envrt-brand-black/55">
                    Water
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold tracking-tight text-envrt-brand-black">
                    14.8k <span className="text-base text-envrt-brand-black/45">L</span>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-envrt-brand-black/55">
                    Origin
                  </dt>
                  <dd className="mt-1 text-sm text-envrt-brand-black">
                    Portugal
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-envrt-brand-black/55">
                    Composition
                  </dt>
                  <dd className="mt-1 text-sm text-envrt-brand-black">
                    100% recycled polyester
                  </dd>
                </div>
              </dl>

              {/* Live link */}
              <a
                href="https://dpp.envrt.com/envrt/demo-garments/hoodie-0509-1882"
                target="_blank"
                rel="noreferrer"
                className="group mt-10 inline-flex items-center gap-2 self-start border-b border-envrt-brand-black/15 pb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-envrt-brand-black transition-colors duration-200 hover:border-envrt-brand-ultramarine hover:text-envrt-brand-ultramarine sm:text-xs"
              >
                Open the live passport
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

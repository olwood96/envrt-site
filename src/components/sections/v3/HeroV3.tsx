"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";

export function HeroV3() {
  return (
    <section className="relative overflow-hidden bg-envrt-offwhite">
      {/* Editorial baseline: wide left text column, calm right image column.
          No ambient glow blobs, no callouts cluttering the photo. */}
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-12 px-6 pb-20 pt-28 sm:px-10 sm:pt-32 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:px-16 lg:pb-28">
        {/* Left: editorial copy */}
        <div className="max-w-2xl">
          <FadeUp>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-envrt-charcoal/55">
              EU ESPR · Ready
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            {/* Serif lead — Fraunces italic. The emotional hook. */}
            <p className="mt-7 font-fraunces text-[1.7rem] font-normal italic leading-[1.2] tracking-tight text-envrt-ink sm:text-[2.1rem] lg:text-[2.4rem]">
              Numbers that pass an audit. Stories that earn a scan.
            </p>
          </FadeUp>

          <FadeUp delay={0.18}>
            {/* H1 — N27 bold, calm, declarative. Sits below the kicker as
                the "official" product line. */}
            <h1 className="mt-6 text-3xl font-bold leading-[1.15] tracking-tight text-envrt-ink sm:text-4xl lg:text-[2.65rem]">
              Digital Product Passports for fashion brands.
            </h1>
          </FadeUp>

          <FadeUp delay={0.26}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-envrt-charcoal/70 sm:text-lg">
              Calculate emissions, water scarcity and Eco-Score for every
              garment. Attach a QR to the care label. Customers scan and see
              the full story.
            </p>
          </FadeUp>

          <FadeUp delay={0.34}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                href="/free-dpp"
                size="md"
                className="sm:px-8 sm:py-4 sm:text-lg"
                data-cta="hero-v3-free-dpp"
              >
                Get a free DPP<span className="ml-2">→</span>
              </Button>
              <Button
                href="/contact"
                variant="secondary"
                size="md"
                className="sm:px-8 sm:py-4 sm:text-lg"
                data-cta="hero-v3-book-demo"
              >
                Book a demo
              </Button>
            </div>
          </FadeUp>

          <FadeUp delay={0.42}>
            <p className="mt-8 max-w-md font-fraunces text-sm italic leading-relaxed text-envrt-charcoal/50">
              Built for fashion and apparel brands selling into the EU.
            </p>
          </FadeUp>
        </div>

        {/* Right: a single, considered product photograph. No floating tiles,
            no rotated cards — the photo is the hero, the tag is the moment. */}
        <FadeUp delay={0.1}>
          <div className="relative mx-auto w-full max-w-[520px]">
            {/* Soft stone-toned scene plate behind the photo. Editorial frame. */}
            <div
              aria-hidden
              className="absolute inset-x-6 top-10 bottom-6 rounded-[2.5rem] bg-envrt-stone"
            />
            <div className="relative aspect-[5/6] w-full">
              <Image
                src="/jacket.png"
                alt="Sustainable hoodie with attached care-label QR"
                fill
                sizes="(min-width: 1024px) 520px, 80vw"
                className="object-contain drop-shadow-[0_30px_60px_rgba(14,14,14,0.18)]"
                priority
              />
              {/* QR placed where the care tag would be. Calm, square,
                  with a thin label strip underneath like a real tag. */}
              <div className="absolute left-1/2 top-[55%] z-10 w-[120px] -translate-x-1/2 -translate-y-1/2">
                <div className="overflow-hidden rounded-[10px] bg-white shadow-[0_18px_36px_rgba(14,14,14,0.18)] ring-1 ring-envrt-ink/5">
                  <div className="p-2">
                    <div className="relative h-[88px] w-full">
                      <Image
                        src="/qr-code.png"
                        alt="Digital Product Passport QR"
                        fill
                        sizes="88px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="border-t border-envrt-ink/5 bg-envrt-offwhite px-2.5 py-1.5">
                    <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-envrt-charcoal/60">
                      Scan · ENVRT passport
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial metadata strip under the photo, magazine caption style */}
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-envrt-ink/8 pt-4 text-left">
              <div>
                <p className="font-fraunces text-xl font-medium text-envrt-ink">
                  6.3<span className="text-xs text-envrt-muted">kg</span>
                </p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-envrt-charcoal/55">
                  CO₂e
                </p>
              </div>
              <div>
                <p className="font-fraunces text-xl font-medium text-envrt-ink">
                  12.4k<span className="text-xs text-envrt-muted">L</span>
                </p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-envrt-charcoal/55">
                  Water
                </p>
              </div>
              <div>
                <p className="font-fraunces text-xl font-medium text-envrt-ink">
                  69<span className="text-xs text-envrt-muted">%</span>
                </p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-envrt-charcoal/55">
                  Data depth
                </p>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

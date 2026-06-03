"use client";

import Image from "next/image";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { FadeUp } from "../../ui/Motion";

// ─── Annotation tiles ─────────────────────────────────────────────────────
// Flat white cards that float beside / over the hoodie. The annotated DPP
// content sits directly on the card — no nested frame around it. Three of
// the four use real captured DPP element screenshots. Verified standards
// uses a brand-consistent recreation, which the user has approved.

function TileHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-envrt-charcoal/55">
      {children}
    </p>
  );
}

function EcoScoreTile() {
  return (
    <div className="rounded-2xl bg-white px-5 pb-4 pt-4 shadow-[0_22px_50px_-18px_rgba(0,0,0,0.28)]">
      <TileHeader>Eco-Score (FR)</TileHeader>
      <div className="mt-2.5 flex justify-center">
        <Image
          src="/screenshots/dpp/sections/eco-score.png"
          alt="Ecobalyse Coût Environnemental label showing 1,573 points"
          width={460}
          height={272}
          sizes="320px"
          className="h-auto w-full max-w-[280px]"
        />
      </div>
    </div>
  );
}

function HeadlineImpactTile() {
  return (
    <div className="rounded-2xl bg-white px-5 pb-4 pt-4 shadow-[0_22px_50px_-18px_rgba(0,0,0,0.28)]">
      <TileHeader>Headline impact</TileHeader>
      <div className="mt-2.5">
        <Image
          src="/screenshots/dpp/sections/headline-metrics.png"
          alt="CO2e, water scarcity, garment mass and transparency metric cards"
          width={760}
          height={500}
          sizes="320px"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}

function SupplyChainMapTile() {
  // The production-journey capture is tall (map + stage list). Show the
  // map only by cropping to a wide aspect ratio with the map at centre.
  return (
    <div className="rounded-2xl bg-white px-5 pb-4 pt-4 shadow-[0_22px_50px_-18px_rgba(0,0,0,0.28)]">
      <TileHeader>Production journey</TileHeader>
      <div className="relative mt-2.5 aspect-[5/3] w-full overflow-hidden rounded-md">
        <Image
          src="/screenshots/dpp/sections/production-journey.png"
          alt="World supply chain map with country dots and connections"
          fill
          sizes="320px"
          style={{ objectFit: "cover", objectPosition: "center 22%" }}
        />
      </div>
    </div>
  );
}

function VerifiedStandardsTile() {
  const standards = ["EU PEF", "ISO 14040", "AWARE"];
  return (
    <div className="rounded-2xl bg-white px-5 pb-4 pt-4 shadow-[0_22px_50px_-18px_rgba(0,0,0,0.28)]">
      <TileHeader>Verified standards</TileHeader>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {standards.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1 rounded-md border border-envrt-charcoal/10 bg-envrt-offwhite px-2.5 py-1.5 text-[11px] font-semibold text-envrt-charcoal"
          >
            <svg className="h-3 w-3 text-envrt-teal" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 4L6 12L2 8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {s}
          </span>
        ))}
      </div>
      <p className="mt-2.5 text-xs leading-snug text-envrt-muted">
        Aligned with EU and ISO methodologies.
      </p>
    </div>
  );
}

// ─── Cascade layout config ────────────────────────────────────────────────
// Tiles cascade down the left side of the right column, with each one
// offset slightly so they overlap each other and the hoodie behind them.

type Slot = {
  id: number;
  Tile: React.ComponentType;
  // Desktop position as percentages of the right column.
  desktop: { top: string; left: string; width: string; rotate?: string };
};

const slots: Slot[] = [
  {
    id: 1,
    Tile: EcoScoreTile,
    desktop: { top: "1%",  left: "0%",  width: "52%", rotate: "-1.5deg" },
  },
  {
    id: 2,
    Tile: HeadlineImpactTile,
    desktop: { top: "28%", left: "6%",  width: "55%", rotate: "1deg" },
  },
  {
    id: 3,
    Tile: SupplyChainMapTile,
    desktop: { top: "55%", left: "1%",  width: "52%", rotate: "-1deg" },
  },
  {
    id: 4,
    Tile: VerifiedStandardsTile,
    desktop: { top: "80%", left: "9%",  width: "48%", rotate: "1.5deg" },
  },
];

export function HeroV2() {
  return (
    <section className="relative mx-auto max-w-[1360px] overflow-x-clip px-6 pt-28 pb-16 sm:px-10 sm:pt-32 sm:pb-20 lg:px-16 lg:pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* Left: text content */}
        <div className="max-w-xl">
          <FadeUp><Badge>Ready for the EU ESPR mandate.</Badge></FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight text-envrt-charcoal sm:text-5xl lg:text-[3.5rem]">
              Digital Product Passports for fashion brands.
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mt-4 text-2xl font-bold leading-[1.25] tracking-tight text-envrt-charcoal/70 sm:text-3xl lg:text-4xl">
              <em className="italic">Your</em> GARMENTS.{" "}
              <em className="italic">Their</em> IMPACT.{" "}
              <em className="italic">One</em> PLATFORM.
            </p>
          </FadeUp>
          <FadeUp delay={0.25}>
            <p className="mt-6 text-base leading-relaxed text-envrt-muted sm:text-lg">
              Calculate emissions, water scarcity and Eco-Score for every garment. Attach a QR to the tag. Customers scan and see it.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/free-dpp" size="md" className="sm:px-8 sm:py-4 sm:text-lg" data-cta="hero-free-dpp">
                Get a free DPP<span className="ml-2">→</span>
              </Button>
              <Button href="/contact" variant="secondary" size="md" className="sm:px-8 sm:py-4 sm:text-lg" data-cta="hero-book-demo">
                Book a demo
              </Button>
            </div>
          </FadeUp>
          <FadeUp delay={0.4}>
            <p className="mt-6 text-xs font-medium tracking-wide text-envrt-muted/70">
              Built for fashion and apparel brands selling into the EU.
            </p>
          </FadeUp>
        </div>

        {/* Right: hoodie + cascading annotation tiles */}
        <FadeUp delay={0.2}>
          <div className="relative mx-auto w-full max-w-[640px]">
            {/* Desktop composition */}
            <div className="relative hidden h-[680px] lg:block">
              {/* Hoodie pushed right, tiles will overlap its left edge */}
              <div className="absolute right-[-2%] top-1/2 z-0 h-[110%] w-[60%] -translate-y-1/2">
                <Image
                  src="/jacket.png"
                  alt="Sustainable hoodie"
                  fill
                  sizes="380px"
                  className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.22)]"
                  priority
                />
                {/* QR small overlay near tag area */}
                <div className="absolute" style={{ width: 92, height: 92, bottom: "16%", right: "18%", transform: "rotate(8deg)" }}>
                  <Image
                    src="/qr-code.png"
                    alt="Digital Product Passport QR code"
                    fill
                    sizes="92px"
                    className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]"
                  />
                </div>
              </div>

              {/* Cascading tiles */}
              {slots.map((slot, i) => (
                <div
                  key={slot.id}
                  className="absolute z-10"
                  style={{
                    top: slot.desktop.top,
                    left: slot.desktop.left,
                    width: slot.desktop.width,
                    transform: slot.desktop.rotate ? `rotate(${slot.desktop.rotate})` : undefined,
                    zIndex: 10 + i,
                  }}
                >
                  <slot.Tile />
                </div>
              ))}
            </div>

            {/* Mobile: hoodie at top, tiles stacked below */}
            <div className="lg:hidden">
              <div className="relative mx-auto h-[360px] w-full max-w-[340px]">
                <Image
                  src="/jacket.png"
                  alt="Sustainable hoodie"
                  fill
                  sizes="340px"
                  className="object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.18)]"
                  priority
                />
                <div
                  className="absolute"
                  style={{ width: 80, height: 80, bottom: "14%", right: "14%", transform: "rotate(8deg)" }}
                >
                  <Image
                    src="/qr-code.png"
                    alt="Digital Product Passport QR code"
                    fill
                    sizes="80px"
                    className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]"
                  />
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {slots.map((slot) => (
                  <slot.Tile key={slot.id} />
                ))}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

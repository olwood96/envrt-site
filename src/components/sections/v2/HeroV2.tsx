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

// ─── Annotated callouts layout config ─────────────────────────────────────
// Each tile sits in a corner of the right column, with the hoodie centered
// between them. Callouts fade in sequentially via per-tile delays. Slight
// overlap with the hoodie reads as "callouts in front of the photo".

type Callout = {
  id: number;
  Tile: React.ComponentType;
  delay: number;
  // Desktop position as percentages of the right column.
  desktop: React.CSSProperties;
  // Mobile is a simple stack — only the order matters.
  mobileDelay: number;
};

const callouts: Callout[] = [
  {
    id: 1,
    Tile: EcoScoreTile,
    delay: 0.25,
    mobileDelay: 0.2,
    desktop: { top: "1%", left: "0%", width: "32%" },
  },
  {
    id: 2,
    Tile: VerifiedStandardsTile,
    delay: 0.4,
    mobileDelay: 0.3,
    desktop: { top: "1%", right: "0%", width: "30%" },
  },
  {
    id: 3,
    Tile: HeadlineImpactTile,
    delay: 0.55,
    mobileDelay: 0.4,
    desktop: { bottom: "1%", left: "0%", width: "34%" },
  },
  {
    id: 4,
    Tile: SupplyChainMapTile,
    delay: 0.7,
    mobileDelay: 0.5,
    desktop: { bottom: "1%", right: "0%", width: "32%" },
  },
];

export function HeroV2() {
  return (
    <section className="relative mx-auto max-w-[1360px] overflow-x-clip px-6 pt-28 pb-16 sm:px-10 sm:pt-32 sm:pb-20 lg:px-16 lg:pb-24">
      {/* Ambient glow blobs (decorative, behind everything) */}
      <div
        aria-hidden
        className="glow-blob bg-envrt-teal/15"
        style={{ top: "8%", left: "-6%", width: "420px", height: "420px" }}
      />
      <div
        aria-hidden
        className="glow-blob bg-envrt-green/10"
        style={{ bottom: "4%", right: "-4%", width: "520px", height: "520px" }}
      />

      <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
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
              <em className="italic">Your</em>{" "}
              <span className="gradient-text">GARMENTS</span>.{" "}
              <em className="italic">Their</em>{" "}
              <span className="gradient-text">IMPACT</span>.{" "}
              <em className="italic">One</em>{" "}
              <span className="gradient-text">PLATFORM</span>.
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

        {/* Right: hoodie centered + annotated callouts at the four corners */}
        <div className="relative mx-auto w-full max-w-[640px]">
          {/* Desktop composition */}
          <div className="relative hidden h-[680px] lg:block">
            {/* Hoodie centered */}
            <FadeUp delay={0.1}>
              <div className="animate-float absolute left-1/2 top-1/2 z-0 h-full w-[44%] -translate-x-1/2 -translate-y-1/2">
                <Image
                  src="/jacket.png"
                  alt="Sustainable hoodie"
                  fill
                  sizes="300px"
                  className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.22)]"
                  priority
                />
                {/* QR small overlay near tag area, with pulse ring behind */}
                <div
                  className="absolute"
                  style={{ width: 84, height: 84, bottom: "18%", right: "10%", transform: "rotate(8deg)" }}
                >
                  <span
                    aria-hidden
                    className="animate-pulse-ring absolute inset-0 rounded-2xl bg-envrt-teal/30"
                  />
                  <Image
                    src="/qr-code.png"
                    alt="Digital Product Passport QR code"
                    fill
                    sizes="84px"
                    className="relative object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]"
                  />
                </div>
              </div>
            </FadeUp>

            {/* Corner callouts */}
            {callouts.map((c, i) => (
              <FadeUp key={c.id} delay={c.delay}>
                <div className="absolute z-10" style={{ ...c.desktop, zIndex: 10 + i }}>
                  <c.Tile />
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Mobile: hoodie at top, callouts stacked below */}
          <div className="lg:hidden">
            <FadeUp delay={0.1}>
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
                  <span
                    aria-hidden
                    className="animate-pulse-ring absolute inset-0 rounded-2xl bg-envrt-teal/30"
                  />
                  <Image
                    src="/qr-code.png"
                    alt="Digital Product Passport QR code"
                    fill
                    sizes="80px"
                    className="relative object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]"
                  />
                </div>
              </div>
            </FadeUp>
            <div className="mt-6 space-y-3">
              {callouts.map((c) => (
                <FadeUp key={c.id} delay={c.mobileDelay}>
                  <c.Tile />
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

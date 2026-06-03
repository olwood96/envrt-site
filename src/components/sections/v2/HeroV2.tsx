"use client";

import Image from "next/image";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { FadeUp } from "../../ui/Motion";

// ─── Annotation tiles ─────────────────────────────────────────────────────
// Three tiles use real captured DPP element screenshots (eco-score badge,
// headline metrics, production journey). The fourth (verified standards)
// is a brand-consistent recreation since the user is happy with that one.

function ScreenshotTile({
  src,
  alt,
  objectPosition = "center",
}: {
  src: string;
  alt: string;
  objectPosition?: string;
}) {
  return (
    <div className="relative aspect-[5/3] w-full overflow-hidden rounded-md border border-envrt-charcoal/10 bg-envrt-offwhite">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="220px"
        style={{ objectFit: "cover", objectPosition }}
      />
    </div>
  );
}

function EcoScoreTile() {
  return (
    <div className="rounded-xl border border-envrt-charcoal/10 bg-white p-3 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-envrt-muted">
          Eco-Score
        </p>
        <span className="rounded-sm bg-envrt-offwhite px-1 py-0.5 text-[8px] font-bold text-envrt-charcoal">
          FR
        </span>
      </div>
      <div className="mt-2">
        <ScreenshotTile src="/screenshots/dpp/sections/eco-score.png" alt="Ecobalyse Coût Environnemental label" />
      </div>
    </div>
  );
}

function HeadlineImpactTile() {
  return (
    <div className="rounded-xl border border-envrt-charcoal/10 bg-white p-3 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-envrt-muted">
        Headline impact
      </p>
      <div className="mt-2">
        <ScreenshotTile
          src="/screenshots/dpp/sections/headline-metrics.png"
          alt="Emissions and water scarcity metric cards"
          objectPosition="center top"
        />
      </div>
    </div>
  );
}

function SupplyChainMapTile() {
  return (
    <div className="rounded-xl border border-envrt-charcoal/10 bg-white p-3 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-envrt-muted">
        Production journey
      </p>
      <div className="mt-2">
        <ScreenshotTile
          src="/screenshots/dpp/sections/production-journey.png"
          alt="World supply chain map with production countries"
          objectPosition="center 18%"
        />
      </div>
    </div>
  );
}

function VerifiedStandardsTile() {
  // Recreation kept — the user said this one is fine as-is.
  const standards = [
    { label: "EU PEF" },
    { label: "ISO 14040" },
    { label: "AWARE" },
  ];
  return (
    <div className="rounded-xl border border-envrt-charcoal/10 bg-white p-4 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-envrt-muted">
        Verified standards
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {standards.map((s) => (
          <span
            key={s.label}
            className="inline-flex items-center gap-1 rounded-md border border-envrt-charcoal/10 bg-envrt-offwhite px-2 py-1 text-[10px] font-semibold text-envrt-charcoal"
          >
            <svg className="h-2.5 w-2.5 text-envrt-teal" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 4L6 12L2 8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {s.label}
          </span>
        ))}
      </div>
      <p className="mt-2 text-[10px] leading-snug text-envrt-muted">
        Aligned with EU and ISO methodologies.
      </p>
    </div>
  );
}

// ─── Annotation layout config ─────────────────────────────────────────────
type AnnotationSlot = {
  id: number;
  label: string;
  Tile: React.ComponentType;
  desktop: { top: string; side: "left" | "right" };
  // Anchors used to draw the connector bezier. Coordinates are percentages
  // of the right column (0–100).
  hoodieAnchor: { x: number; y: number };
  tileAnchor: { x: number; y: number };
};

const annotations: AnnotationSlot[] = [
  {
    id: 1,
    label: "Eco-Score",
    Tile: EcoScoreTile,
    desktop: { top: "1%", side: "left" },
    hoodieAnchor: { x: 42, y: 22 },
    tileAnchor: { x: 26, y: 12 },
  },
  {
    id: 2,
    label: "Headline impact",
    Tile: HeadlineImpactTile,
    desktop: { top: "1%", side: "right" },
    hoodieAnchor: { x: 58, y: 22 },
    tileAnchor: { x: 74, y: 12 },
  },
  {
    id: 3,
    label: "Production journey",
    Tile: SupplyChainMapTile,
    desktop: { top: "60%", side: "left" },
    hoodieAnchor: { x: 42, y: 78 },
    tileAnchor: { x: 26, y: 82 },
  },
  {
    id: 4,
    label: "Verified standards",
    Tile: VerifiedStandardsTile,
    desktop: { top: "60%", side: "right" },
    hoodieAnchor: { x: 58, y: 78 },
    tileAnchor: { x: 74, y: 82 },
  },
];

function buildConnectorPath(
  start: { x: number; y: number },
  end: { x: number; y: number },
  side: "left" | "right",
): string {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const offset = side === "left" ? -4 : 4;
  return `M ${start.x} ${start.y} Q ${midX + offset} ${midY} ${end.x} ${end.y}`;
}

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

        {/* Right: hoodie + QR + tiles. No iframe — that lives in the section below. */}
        <FadeUp delay={0.2}>
          <div className="relative mx-auto w-full max-w-[640px]">
            {/* Desktop composition */}
            <div className="relative hidden h-[600px] lg:block">
              {/* Connector overlay */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {annotations.map((a) => (
                  <path
                    key={a.id}
                    d={buildConnectorPath(a.tileAnchor, a.hoodieAnchor, a.desktop.side)}
                    stroke="rgba(30, 30, 30, 0.22)"
                    strokeWidth={0.2}
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                  />
                ))}
              </svg>

              {/* Annotation tiles at the corners */}
              {annotations.map((a) => (
                <div
                  key={a.id}
                  className="absolute z-20 w-[24%]"
                  style={{
                    top: a.desktop.top,
                    [a.desktop.side === "left" ? "left" : "right"]: "0%",
                  }}
                >
                  <a.Tile />
                </div>
              ))}

              {/* Hoodie + QR central group */}
              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <div className="relative" style={{ width: 360, height: 420 }}>
                  <Image
                    src="/jacket.png"
                    alt="Sustainable hoodie"
                    fill
                    sizes="360px"
                    className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.18)]"
                    priority
                  />
                  <div
                    className="absolute"
                    style={{ width: 110, height: 110, bottom: "10%", right: "8%", transform: "rotate(8deg)" }}
                  >
                    <Image
                      src="/qr-code.png"
                      alt="Digital Product Passport QR code"
                      fill
                      sizes="110px"
                      className="object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.22)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile composition: hoodie + QR, tiles in 2x2 below */}
            <div className="lg:hidden">
              <div className="relative mx-auto h-[360px] w-full max-w-[320px]">
                <Image
                  src="/jacket.png"
                  alt="Sustainable hoodie"
                  fill
                  sizes="320px"
                  className="object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.18)]"
                  priority
                />
                <div
                  className="absolute"
                  style={{ width: 90, height: 90, bottom: "12%", right: "8%", transform: "rotate(8deg)" }}
                >
                  <Image
                    src="/qr-code.png"
                    alt="Digital Product Passport QR code"
                    fill
                    sizes="90px"
                    className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]"
                  />
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {annotations.map((a) => (
                  <a.Tile key={a.id} />
                ))}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

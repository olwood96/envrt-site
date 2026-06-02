"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { FadeUp } from "../../ui/Motion";
import { QRScanLoader } from "../../ui/QRScanLoader";
import { siteConfig } from "@/lib/config";
import {
  PHONE_VIEWPORT_WIDTH,
  PHONE_VIEWPORT_HEIGHT,
} from "@/lib/constants";

// ─── Phone with live DPP iframe ───────────────────────────────────────────
function PhoneMockup({ src }: { src: string }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const update = () => {
      if (screenRef.current) {
        setScale(screenRef.current.offsetWidth / PHONE_VIEWPORT_WIDTH);
      }
    };
    update();
    const observer = new ResizeObserver(update);
    if (screenRef.current) observer.observe(screenRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full max-w-[280px]">
      <div className="relative overflow-hidden rounded-[2.8rem] border-[5px] border-envrt-charcoal/90 bg-envrt-charcoal shadow-[0_25px_60px_-10px_rgba(0,0,0,0.4)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between rounded-t-[2.3rem] bg-white px-5" style={{ height: 22 }}>
          <span className="text-[10px] font-semibold leading-none text-envrt-charcoal">21:37</span>
          <div className="w-[72px]" />
          <div className="flex items-center gap-[4px]">
            <svg width="12" height="9" viewBox="0 0 14 10" fill="none" className="text-envrt-charcoal">
              <rect x="0" y="7" width="2.5" height="3" rx="0.5" fill="currentColor" />
              <rect x="3.5" y="5" width="2.5" height="5" rx="0.5" fill="currentColor" />
              <rect x="7" y="2.5" width="2.5" height="7.5" rx="0.5" fill="currentColor" />
              <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="currentColor" />
            </svg>
            <svg width="11" height="9" viewBox="0 0 13 10" fill="none" className="text-envrt-charcoal">
              <path d="M6.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor" />
              <path d="M4 7.2a3.5 3.5 0 0 1 5 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M1.8 4.8a6.5 6.5 0 0 1 9.4 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="text-[8px] font-medium leading-none text-envrt-charcoal">69</span>
            <div className="flex items-center gap-[1px]">
              <div className="relative h-[8px] w-[17px] rounded-[2px] border border-envrt-charcoal/80">
                <div className="absolute inset-[1px] rounded-[1px] bg-envrt-charcoal" style={{ width: "69%" }} />
              </div>
              <div className="h-[3px] w-[1px] rounded-r-full bg-envrt-charcoal/80" />
            </div>
          </div>
        </div>
        <div className="absolute left-1/2 top-[4px] z-30 h-[16px] w-[72px] -translate-x-1/2 rounded-full bg-envrt-charcoal" />

        <div ref={screenRef} className="relative w-full overflow-hidden rounded-[2.3rem] bg-white" style={{ aspectRatio: "9 / 19" }}>
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              src={src}
              title="Digital Product Passport"
              loading="eager"
              className="absolute border-0"
              style={{
                top: 0,
                left: 0,
                width: `${PHONE_VIEWPORT_WIDTH}px`,
                height: `${PHONE_VIEWPORT_HEIGHT}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                overflow: "auto",
                WebkitOverflowScrolling: "touch",
                paddingTop: "22px",
              }}
              sandbox="allow-scripts allow-same-origin"
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
          <QRScanLoader
            visible={!iframeLoaded}
            containerRadiusClassName="rounded-[2.3rem]"
            qrSizeClassName="w-[55%]"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Annotation recreations ───────────────────────────────────────────────
// Small, brand-consistent stylings of each annotated DPP section. Not
// screenshots. Designed to look like the real DPP at a glance but render
// crisp at any size and stay in our control.

function HeadlineImpactTile() {
  return (
    <div className="rounded-xl border border-envrt-charcoal/10 bg-white p-4 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-envrt-muted">
        Emissions footprint
      </p>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="text-2xl font-bold leading-none tracking-tight text-envrt-charcoal">
          7.4
        </span>
        <span className="text-xs font-medium text-envrt-muted">kg CO₂-eq</span>
      </div>
      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-envrt-green/10 px-2 py-0.5">
        <svg className="h-2.5 w-2.5 text-envrt-green" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 9.5L1.5 5h9z" />
        </svg>
        <span className="text-[10px] font-semibold text-envrt-green">49.5% vs industry avg</span>
      </div>
    </div>
  );
}

function EcoScoreTile() {
  // Recreation of the Ecobalyse "coût environnemental" badge embedded on
  // the live DPP. The score is in points (lower is better); the colour
  // scale runs from a low-impact green through to a high-impact red.
  const points = 1573;
  // The scale used by Affichage Environnemental tops out around 2400 for
  // textiles; map our position approximately.
  const scalePosition = Math.min(95, Math.max(5, (points / 2400) * 100));

  return (
    <div className="rounded-xl border border-envrt-charcoal/10 bg-white p-4 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-envrt-muted">
        Eco-Score (FR)
      </p>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="text-2xl font-bold leading-none tracking-tight text-envrt-charcoal">
          {points.toLocaleString()}
        </span>
        <span className="text-xs font-medium text-envrt-muted">pts</span>
      </div>
      <div className="relative mt-2.5">
        <div
          className="h-1 w-full rounded-full"
          style={{
            background:
              "linear-gradient(to right, #1a7d3a 0%, #7bb84a 28%, #e8c83a 52%, #e0833a 76%, #c43a2a 100%)",
          }}
        />
        <div
          className="absolute top-1/2 h-3 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-envrt-charcoal"
          style={{ left: `${scalePosition}%` }}
        />
      </div>
      <p className="mt-1.5 text-[10px] text-envrt-muted">Lower is better</p>
    </div>
  );
}

function SupplyChainMapTile() {
  // Schematic of a production journey: 4 stages with locations, connected.
  const stages = [
    { x: 12, y: 60, label: "Fibre", country: "TR" },
    { x: 40, y: 35, label: "Yarn", country: "PT" },
    { x: 65, y: 55, label: "Fabric", country: "IT" },
    { x: 90, y: 30, label: "Assembly", country: "PT" },
  ];
  return (
    <div className="rounded-xl border border-envrt-charcoal/10 bg-white p-4 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-envrt-muted">
        Production journey
      </p>
      <svg viewBox="0 0 100 80" className="mt-2 h-16 w-full">
        {/* Connector path */}
        <path
          d={`M ${stages[0].x},${stages[0].y} L ${stages[1].x},${stages[1].y} L ${stages[2].x},${stages[2].y} L ${stages[3].x},${stages[3].y}`}
          stroke="rgba(42, 161, 152, 0.5)"
          strokeWidth="0.6"
          fill="none"
          strokeDasharray="2 1.5"
        />
        {stages.map((s) => (
          <g key={s.label}>
            <circle cx={s.x} cy={s.y} r="2.5" fill="#1a3a2a" />
            <text
              x={s.x}
              y={s.y - 5}
              textAnchor="middle"
              fontSize="4"
              fill="#1e1e1e"
              fontWeight="600"
            >
              {s.country}
            </text>
            <text
              x={s.x}
              y={s.y + 9}
              textAnchor="middle"
              fontSize="3.5"
              fill="#9ca3a0"
            >
              {s.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function VerifiedStandardsTile() {
  const standards = [
    { label: "EU PEF", code: "PEF" },
    { label: "ISO 14040", code: "ISO" },
    { label: "AWARE", code: "AW" },
  ];
  return (
    <div className="rounded-xl border border-envrt-charcoal/10 bg-white p-4 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-envrt-muted">
        Verified standards
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {standards.map((s) => (
          <span
            key={s.code}
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
  // Position of the tile on the desktop composition (% of right column).
  desktop: {
    top: string;
    side: "left" | "right";
  };
  // Anchor point on the phone (in the right column's % space) where the
  // connector line ends. Tuned by eye to land on the relevant DPP section.
  phoneAnchor: { x: number; y: number };
  // Anchor point on the tile (in the right column's % space) where the line
  // starts. Drawn at the inner edge of the tile facing the phone.
  tileAnchor: { x: number; y: number };
};

const annotations: AnnotationSlot[] = [
  {
    id: 1,
    label: "Headline impact",
    Tile: HeadlineImpactTile,
    desktop: { top: "2%", side: "left" },
    phoneAnchor: { x: 50, y: 18 },
    tileAnchor: { x: 31, y: 14 },
  },
  {
    id: 2,
    label: "Eco-Score",
    Tile: EcoScoreTile,
    desktop: { top: "2%", side: "right" },
    phoneAnchor: { x: 50, y: 32 },
    tileAnchor: { x: 69, y: 14 },
  },
  {
    id: 3,
    label: "Supply chain map",
    Tile: SupplyChainMapTile,
    desktop: { top: "62%", side: "left" },
    phoneAnchor: { x: 50, y: 64 },
    tileAnchor: { x: 31, y: 74 },
  },
  {
    id: 4,
    label: "Verified standards",
    Tile: VerifiedStandardsTile,
    desktop: { top: "62%", side: "right" },
    phoneAnchor: { x: 50, y: 82 },
    tileAnchor: { x: 69, y: 74 },
  },
];

// Build a smooth quadratic bezier path between two points with a control
// point offset outward (away from the phone) for a gentle curve.
function buildConnectorPath(
  start: { x: number; y: number },
  end: { x: number; y: number },
  side: "left" | "right",
): string {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  // Pull the curve toward the outside of the composition.
  const offset = side === "left" ? -5 : 5;
  const cx = midX + offset;
  const cy = midY;
  return `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;
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

        {/* Right: phone + iframe with annotation tiles around it */}
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
                    d={buildConnectorPath(a.tileAnchor, a.phoneAnchor, a.desktop.side)}
                    stroke="rgba(30, 30, 30, 0.18)"
                    strokeWidth={0.18}
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>

              {/* Annotation tiles */}
              {annotations.map((a) => (
                <div
                  key={a.id}
                  className="absolute w-[26%]"
                  style={{
                    top: a.desktop.top,
                    [a.desktop.side === "left" ? "left" : "right"]: "0%",
                  }}
                >
                  <a.Tile />
                </div>
              ))}

              {/* Phone centred */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <PhoneMockup src={siteConfig.dppDemoEmbedUrl} />
              </div>
            </div>

            {/* Mobile composition: phone + 2x2 tile grid */}
            <div className="lg:hidden">
              <div className="mx-auto flex justify-center">
                <PhoneMockup src={siteConfig.dppDemoEmbedUrl} />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
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

"use client";

import { useRef, useState, useEffect } from "react"; // useRef/useState used by PhoneMockup
import Image from "next/image";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { FadeUp } from "../../ui/Motion";
import { QRScanLoader } from "../../ui/QRScanLoader";
import { siteConfig } from "@/lib/config";
import {
  HERO_JACKET_HEIGHT_RATIO,
  HERO_QR_HEIGHT_RATIO,
  PHONE_VIEWPORT_WIDTH,
  PHONE_VIEWPORT_HEIGHT,
} from "@/lib/constants";

// 280px wide phone with 9:19 screen + 5px border each side = ~601px tall.
const PHONE_HEIGHT = 601;
const JACKET_HEIGHT = PHONE_HEIGHT * HERO_JACKET_HEIGHT_RATIO;
const QR_HEIGHT = PHONE_HEIGHT * HERO_QR_HEIGHT_RATIO;

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
    <div className="relative w-[280px]">
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
// Brand-consistent recreations of each annotated DPP section. Designed to
// look like the real DPP at a glance, render crisp at any size, and stay
// in our control without screenshots.

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
  // the live DPP. White card, big point score, gradient scale with marker.
  const points = 1573;
  const scalePosition = Math.min(95, Math.max(5, (points / 2400) * 100));

  return (
    <div className="rounded-xl border border-envrt-charcoal/10 bg-white p-4 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-envrt-muted">
          Coût environnemental
        </p>
        <span className="rounded-sm bg-envrt-offwhite px-1 py-0.5 text-[8px] font-bold text-envrt-charcoal">
          FR
        </span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="text-2xl font-bold leading-none tracking-tight text-envrt-charcoal">
          {points.toLocaleString()}
        </span>
        <span className="text-xs font-medium text-envrt-muted">pts</span>
      </div>
      <div className="relative mt-2.5">
        <div
          className="h-1.5 w-full rounded-full"
          style={{
            background:
              "linear-gradient(to right, #1a7d3a 0%, #7bb84a 28%, #e8c83a 52%, #e0833a 76%, #c43a2a 100%)",
          }}
        />
        <div
          className="absolute top-1/2 h-3.5 w-[2.5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-envrt-charcoal shadow-[0_0_0_2px_white]"
          style={{ left: `${scalePosition}%` }}
        />
      </div>
      <p className="mt-1.5 text-[10px] text-envrt-muted">Ecobalyse • lower is better</p>
    </div>
  );
}

function SupplyChainMapTile() {
  // Stylised world view with dots on production countries, lines linking
  // the journey. Not photographic but recognisably a map, matching the
  // "production journey" section in the live DPP.
  const stages = [
    { x: 50, y: 47, code: "TR", label: "Fibre" },
    { x: 45, y: 35, code: "PT", label: "Yarn" },
    { x: 48, y: 36, code: "IT", label: "Fabric" },
    { x: 45, y: 35, code: "PT", label: "Assembly" },
  ];

  return (
    <div className="rounded-xl border border-envrt-charcoal/10 bg-white p-4 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.18)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-envrt-muted">
        Production journey
      </p>
      <div className="relative mt-2 h-16 w-full overflow-hidden rounded-md bg-envrt-offwhite">
        <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
          {/* Stylised continent shapes */}
          <g fill="rgba(30, 30, 30, 0.08)" stroke="rgba(30, 30, 30, 0.12)" strokeWidth="0.3">
            {/* North America */}
            <path d="M5 20 Q12 16 18 18 Q22 22 24 28 Q22 34 16 36 Q10 34 8 28 Z" />
            {/* South America */}
            <path d="M22 38 Q26 38 27 44 Q26 52 22 54 Q18 50 19 44 Z" />
            {/* Europe + Africa */}
            <path d="M44 18 Q50 16 54 20 Q56 24 53 28 L52 32 Q54 40 52 48 Q48 52 44 50 Q42 44 44 36 Q42 30 44 24 Z" />
            {/* Asia */}
            <path d="M58 18 Q72 16 82 22 Q86 28 84 34 Q78 38 70 36 Q62 34 58 28 Z" />
            {/* Oceania */}
            <path d="M78 44 Q86 44 88 48 Q86 52 80 51 Q76 49 78 46 Z" />
          </g>
          {/* Connecting line between stages */}
          <path
            d={`M ${stages[0].x},${stages[0].y} Q 47,40 ${stages[1].x},${stages[1].y}`}
            stroke="rgba(42, 161, 152, 0.7)"
            strokeWidth="0.6"
            fill="none"
            strokeDasharray="1.5 1"
          />
          {/* Country markers */}
          {stages.slice(0, 2).map((s, i) => (
            <g key={i}>
              <circle cx={s.x} cy={s.y} r="2" fill="#1a3a2a" stroke="white" strokeWidth="0.6" />
            </g>
          ))}
        </svg>
      </div>
      <p className="mt-2 text-[10px] leading-snug text-envrt-muted">
        Fibre → Yarn → Fabric → Assembly, traced to country.
      </p>
    </div>
  );
}

function VerifiedStandardsTile() {
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
  phoneAnchor: { x: number; y: number };
  tileAnchor: { x: number; y: number };
};

const annotations: AnnotationSlot[] = [
  {
    id: 1,
    label: "Headline impact",
    Tile: HeadlineImpactTile,
    desktop: { top: "2%", side: "left" },
    phoneAnchor: { x: 42, y: 22 },
    tileAnchor: { x: 23, y: 14 },
  },
  {
    id: 2,
    label: "Eco-Score",
    Tile: EcoScoreTile,
    desktop: { top: "2%", side: "right" },
    phoneAnchor: { x: 58, y: 22 },
    tileAnchor: { x: 77, y: 14 },
  },
  {
    id: 3,
    label: "Supply chain map",
    Tile: SupplyChainMapTile,
    desktop: { top: "62%", side: "left" },
    phoneAnchor: { x: 42, y: 70 },
    tileAnchor: { x: 23, y: 78 },
  },
  {
    id: 4,
    label: "Verified standards",
    Tile: VerifiedStandardsTile,
    desktop: { top: "62%", side: "right" },
    phoneAnchor: { x: 58, y: 78 },
    tileAnchor: { x: 77, y: 78 },
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

        {/* Right: phone + hoodie + QR + annotation tiles */}
        <FadeUp delay={0.2}>
          <div className="relative mx-auto w-full max-w-[640px]">
            {/* Desktop composition */}
            <div className="relative hidden h-[640px] lg:block">
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
                  className="absolute z-20 w-[26%]"
                  style={{
                    top: a.desktop.top,
                    [a.desktop.side === "left" ? "left" : "right"]: "0%",
                  }}
                >
                  <a.Tile />
                </div>
              ))}

              {/* Central hoodie + QR + phone group */}
              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div
                    className="pointer-events-none absolute -z-10 -rotate-[14deg]"
                    style={{ height: JACKET_HEIGHT, top: "-15%", left: "-58%" }}
                  >
                    <Image
                      src="/jacket.png"
                      alt="Sustainable hoodie"
                      width={480}
                      height={560}
                      className="h-full w-auto object-contain opacity-90 drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
                      priority
                    />
                  </div>
                  <div
                    className="pointer-events-none absolute z-20"
                    style={{
                      width: QR_HEIGHT,
                      height: QR_HEIGHT,
                      bottom: "2%",
                      right: "-22%",
                      transform: "rotate(10deg)",
                    }}
                  >
                    <Image
                      src="/qr-code.png"
                      alt="Digital Product Passport QR code"
                      width={320}
                      height={320}
                      className="h-full w-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.25)]"
                    />
                  </div>
                  <div className="relative z-10">
                    <PhoneMockup src={siteConfig.dppDemoEmbedUrl} />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile composition: phone + hoodie + QR, tiles in 2x2 below */}
            <div className="lg:hidden">
              <div className="relative mx-auto flex justify-center">
                <div className="relative">
                  <div
                    className="pointer-events-none absolute -z-10 -rotate-[16deg]"
                    style={{ height: JACKET_HEIGHT, top: "-15%", left: "-50%" }}
                  >
                    <Image
                      src="/jacket.png"
                      alt="Sustainable hoodie"
                      width={480}
                      height={560}
                      className="h-full w-auto object-contain opacity-90"
                      priority
                    />
                  </div>
                  <div
                    className="pointer-events-none absolute z-20"
                    style={{
                      width: QR_HEIGHT,
                      height: QR_HEIGHT,
                      bottom: "2%",
                      right: "-18%",
                      transform: "rotate(10deg)",
                    }}
                  >
                    <Image
                      src="/qr-code.png"
                      alt="Digital Product Passport QR code"
                      width={320}
                      height={320}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <PhoneMockup src={siteConfig.dppDemoEmbedUrl} />
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

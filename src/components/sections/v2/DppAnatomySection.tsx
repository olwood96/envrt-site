"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { Container } from "../../ui/Container";
import { FadeUp } from "../../ui/Motion";
import { siteConfig } from "@/lib/config";

// ─── Geometry ─────────────────────────────────────────────────────────────
// Desktop phone screen height (from a 280px-wide phone with 9:19 ratio).
const DESKTOP_SCREEN_HEIGHT = 591;
const MOBILE_SCREEN_HEIGHT = 506; // 240px-wide phone at 9:19
// Natural iframe height — tall enough to include every annotated section.
const IFRAME_NATURAL_HEIGHT = 7200;
// Outer stage scroll runway in viewport heights.
const STAGE_HEIGHT_VH = 480;

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type Callout = {
  id: number;
  label: string;
  body: string;
  // Approximate DPP page Y of the section's top (for line endpoint tracking).
  sectionY: number;
  // Scroll progress range over which this annotation is visible.
  range: [number, number];
  // Desktop corner placement.
  corner: Corner;
};

// Annotations in DPP top-to-bottom order. Corners alternate.
const callouts: Callout[] = [
  {
    id: 1,
    label: "Eco-Score",
    body: "French Affichage Environnemental score, calculated using the official Ecobalyse methodology.",
    sectionY: 320,
    range: [0.0, 0.18],
    corner: "top-left",
  },
  {
    id: 2,
    label: "Headline impact",
    body: "CO₂e and water scarcity per garment, calculated against industry benchmarks using peer-reviewed methods.",
    sectionY: 520,
    range: [0.18, 0.36],
    corner: "top-right",
  },
  {
    id: 3,
    label: "Supply chain map",
    body: "Every stage from fibre to finished garment, mapped to the country and verified.",
    sectionY: 2300,
    range: [0.36, 0.72],
    corner: "bottom-left",
  },
  {
    id: 4,
    label: "Verified standards",
    body: "Aligned with EU PEF, ISO 14040 and AWARE methodologies, so the numbers hold up.",
    sectionY: 6200,
    range: [0.72, 1.0],
    corner: "bottom-right",
  },
];

// ─── Scrollable phone mockup ──────────────────────────────────────────────
function ScrollablePhone({
  iframeY,
  screenHeight,
}: {
  iframeY: import("framer-motion").MotionValue<number>;
  screenHeight: number;
}) {
  const width = (screenHeight * 9) / 19;
  return (
    <div className="relative" style={{ width }}>
      <div className="relative overflow-hidden rounded-[2.8rem] border-[5px] border-envrt-charcoal/90 bg-envrt-charcoal shadow-[0_25px_60px_-10px_rgba(0,0,0,0.4)]">
        {/* Status bar */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between rounded-t-[2.3rem] bg-white px-5"
          style={{ height: 22 }}
        >
          <span className="text-[10px] font-semibold leading-none text-envrt-charcoal">21:37</span>
          <div className="w-[72px]" />
          <div className="flex items-center gap-[4px]">
            <svg width="12" height="9" viewBox="0 0 14 10" fill="none" className="text-envrt-charcoal">
              <rect x="0" y="7" width="2.5" height="3" rx="0.5" fill="currentColor" />
              <rect x="3.5" y="5" width="2.5" height="5" rx="0.5" fill="currentColor" />
              <rect x="7" y="2.5" width="2.5" height="7.5" rx="0.5" fill="currentColor" />
              <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="currentColor" />
            </svg>
            <div className="flex items-center gap-[1px]">
              <div className="relative h-[8px] w-[17px] rounded-[2px] border border-envrt-charcoal/80">
                <div className="absolute inset-[1px] rounded-[1px] bg-envrt-charcoal" style={{ width: "69%" }} />
              </div>
              <div className="h-[3px] w-[1px] rounded-r-full bg-envrt-charcoal/80" />
            </div>
          </div>
        </div>
        {/* Dynamic island */}
        <div className="absolute left-1/2 top-[4px] z-30 h-[16px] w-[72px] -translate-x-1/2 rounded-full bg-envrt-charcoal" />

        {/* Screen */}
        <div
          className="relative w-full overflow-hidden rounded-[2.3rem] bg-white"
          style={{ height: screenHeight }}
        >
          <motion.iframe
            src={siteConfig.dppDemoEmbedUrl}
            title="What's in a Digital Product Passport"
            loading="lazy"
            className="pointer-events-none absolute left-0 top-0 w-full border-0"
            style={{ y: iframeY, height: IFRAME_NATURAL_HEIGHT, paddingTop: 22 }}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────
export function DppAnatomySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Iframe pan distance for each layout.
  const desktopRange = IFRAME_NATURAL_HEIGHT - DESKTOP_SCREEN_HEIGHT;
  const mobileRange = IFRAME_NATURAL_HEIGHT - MOBILE_SCREEN_HEIGHT;
  const desktopIframeY = useTransform(smoothProgress, [0, 1], [0, -desktopRange]);
  const mobileIframeY = useTransform(smoothProgress, [0, 1], [0, -mobileRange]);

  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    let next = 0;
    for (let i = 0; i < callouts.length; i++) {
      if (latest >= callouts[i].range[0] && latest < callouts[i].range[1]) {
        next = i;
        break;
      }
      if (latest >= callouts[i].range[1]) next = i;
    }
    setActiveIndex(next);
  });

  return (
    <section className="px-4 sm:px-6" id="what-is-a-dpp">
      <Container>
        <FadeUp>
          <div className="mx-auto max-w-2xl pt-16 text-center sm:pt-24">
            <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
              The product
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
              What&apos;s in a Digital Product Passport.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-envrt-muted sm:text-lg">
              Scroll through a live passport. Each label highlights its section as it comes into view.
            </p>
          </div>
        </FadeUp>

        <div
          ref={containerRef}
          className="relative mx-auto max-w-[1100px]"
          style={{ height: `${STAGE_HEIGHT_VH}vh` }}
        >
          {/* ── Mobile stage ────────────────────────────────────────────── */}
          <div className="sticky top-0 flex h-screen flex-col items-center justify-between gap-6 py-10 lg:hidden">
            <ScrollablePhone iframeY={mobileIframeY} screenHeight={MOBILE_SCREEN_HEIGHT} />
            <MobileCalloutCarousel
              callouts={callouts}
              activeIndex={activeIndex}
            />
          </div>

          {/* ── Desktop stage ───────────────────────────────────────────── */}
          <div className="sticky top-0 hidden h-screen items-center justify-center lg:flex">
            <DesktopStage
              callouts={callouts}
              activeIndex={activeIndex}
              progress={smoothProgress}
              iframeY={desktopIframeY}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─── Mobile carousel ──────────────────────────────────────────────────────
function MobileCalloutCarousel({
  callouts,
  activeIndex,
}: {
  callouts: Callout[];
  activeIndex: number;
}) {
  return (
    <div className="w-full max-w-md">
      {/* Progress dots */}
      <div className="mb-4 flex justify-center gap-2">
        {callouts.map((c, i) => (
          <span
            key={c.id}
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
              i === activeIndex ? "bg-envrt-teal" : "bg-envrt-charcoal/15"
            }`}
          />
        ))}
      </div>
      {/* Cross-fading callouts */}
      <div className="relative h-32">
        {callouts.map((c, i) => (
          <motion.div
            key={c.id}
            initial={false}
            animate={{ opacity: i === activeIndex ? 1 : 0, y: i === activeIndex ? 0 : 8 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 flex gap-4"
          >
            <span className="text-3xl font-bold leading-none tracking-tight text-envrt-teal">
              {String(c.id).padStart(2, "0")}
            </span>
            <div className="flex-1">
              <p className="text-base font-semibold text-envrt-charcoal">{c.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-envrt-muted">{c.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Desktop stage ────────────────────────────────────────────────────────
// Stage layout (percentages of stage box):
//   Phone:          centred at x=50, occupies a vertical band ~middle.
//   Corner tiles:   placed at the 4 corners, each tile ~24% wide.
//   Connector line: from tile inner edge to a tracked Y on phone outer edge.
//
// Stage is 100vh tall. Phone is fixed pixel height. We position everything
// in a 1100×600 viewBox-ish coordinate space using percentages so the SVG
// connector overlay tracks alongside the DOM tiles.

const STAGE_WIDTH_PX = 1100;
const STAGE_HEIGHT_PX = 600;
const PHONE_LEFT_EDGE_PCT = 41.5; // visual left edge of phone in stage
const PHONE_RIGHT_EDGE_PCT = 58.5;
const PHONE_TOP_PCT = 8;
const PHONE_BOTTOM_PCT = 92;

const CORNER_LAYOUT: Record<Corner, {
  tileTop: string;
  tileSide: "left" | "right";
  tileSidePct: number;
  // Anchor point on the tile's inner edge.
  tileAnchor: { xPct: number; yPct: number };
}> = {
  "top-left":     { tileTop: "8%",  tileSide: "left",  tileSidePct: 2,  tileAnchor: { xPct: 28, yPct: 12 } },
  "top-right":    { tileTop: "8%",  tileSide: "right", tileSidePct: 2,  tileAnchor: { xPct: 72, yPct: 12 } },
  "bottom-left":  { tileTop: "70%", tileSide: "left",  tileSidePct: 2,  tileAnchor: { xPct: 28, yPct: 78 } },
  "bottom-right": { tileTop: "70%", tileSide: "right", tileSidePct: 2,  tileAnchor: { xPct: 72, yPct: 78 } },
};

function DesktopStage({
  callouts,
  activeIndex,
  progress,
  iframeY,
}: {
  callouts: Callout[];
  activeIndex: number;
  progress: import("framer-motion").MotionValue<number>;
  iframeY: import("framer-motion").MotionValue<number>;
}) {
  return (
    <div
      className="relative"
      style={{ width: STAGE_WIDTH_PX, height: STAGE_HEIGHT_PX, maxWidth: "100%" }}
    >
      {/* SVG connector overlay — draws the active annotation's line */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {callouts.map((c, i) => (
          <ConnectorLine
            key={c.id}
            callout={c}
            isActive={i === activeIndex}
            progress={progress}
          />
        ))}
      </svg>

      {/* Annotation tiles, only the active one is visible (cross-fade) */}
      {callouts.map((c, i) => {
        const layout = CORNER_LAYOUT[c.corner];
        return (
          <motion.div
            key={c.id}
            initial={false}
            animate={{ opacity: i === activeIndex ? 1 : 0, y: i === activeIndex ? 0 : 6 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className={`absolute z-20 w-[24%] ${layout.tileSide === "left" ? "text-left" : "text-right"}`}
            style={{
              top: layout.tileTop,
              [layout.tileSide]: `${layout.tileSidePct}%`,
            }}
          >
            <p className="text-3xl font-bold leading-none tracking-tight text-envrt-teal sm:text-4xl">
              {String(c.id).padStart(2, "0")}
            </p>
            <p className="mt-3 text-lg font-semibold text-envrt-charcoal">{c.label}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-envrt-muted">{c.body}</p>
          </motion.div>
        );
      })}

      {/* Phone centred */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <ScrollablePhone iframeY={iframeY} screenHeight={DESKTOP_SCREEN_HEIGHT} />
      </div>
    </div>
  );
}

// ─── Connector line ───────────────────────────────────────────────────────
// The line endpoint on the phone tracks the active section as it moves
// through the visible frame. Endpoint Y is derived from scroll progress
// using each section's known DPP Y position.
function ConnectorLine({
  callout,
  isActive,
  progress,
}: {
  callout: Callout;
  isActive: boolean;
  progress: import("framer-motion").MotionValue<number>;
}) {
  const layout = CORNER_LAYOUT[callout.corner];
  const desktopRange = IFRAME_NATURAL_HEIGHT - DESKTOP_SCREEN_HEIGHT;
  const phoneEdgeXPct = layout.tileSide === "left" ? PHONE_LEFT_EDGE_PCT : PHONE_RIGHT_EDGE_PCT;

  // Convert section Y on the phone screen into a percentage of stage height.
  // Section Y on screen = sectionY - panPosition. panPosition = desktopRange * p.
  // Fraction of screen = (sectionY - desktopRange*p) / DESKTOP_SCREEN_HEIGHT.
  // Phone screen occupies stage Y from PHONE_TOP_PCT to PHONE_BOTTOM_PCT.
  const phoneEdgeY = useTransform(progress, (p) => {
    const sectionOnScreen = callout.sectionY - desktopRange * p;
    const screenFraction = Math.max(0, Math.min(1, sectionOnScreen / DESKTOP_SCREEN_HEIGHT));
    return PHONE_TOP_PCT + screenFraction * (PHONE_BOTTOM_PCT - PHONE_TOP_PCT);
  });

  // Build the SVG path as a curved bezier from tile anchor to phone edge.
  const pathD = useTransform(phoneEdgeY, (yPct) => {
    const start = layout.tileAnchor;
    const end = { x: phoneEdgeXPct, y: yPct };
    const midX = (start.xPct + end.x) / 2;
    const midY = (start.yPct + end.y) / 2;
    const sideOffset = layout.tileSide === "left" ? -3 : 3;
    return `M ${start.xPct} ${start.yPct} Q ${midX + sideOffset} ${midY} ${end.x} ${end.y}`;
  });

  return (
    <motion.path
      d={pathD}
      stroke="rgba(30, 30, 30, 0.28)"
      strokeWidth={0.18}
      fill="none"
      vectorEffect="non-scaling-stroke"
      strokeLinecap="round"
      initial={false}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    />
  );
}

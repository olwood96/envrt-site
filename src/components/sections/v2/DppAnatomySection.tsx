"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { Container } from "../../ui/Container";
import { FadeUp } from "../../ui/Motion";
import { siteConfig } from "@/lib/config";

// ─── Geometry ─────────────────────────────────────────────────────────────
// Measured live at 280px viewport (see scripts/capture-dpp-screenshot.mjs).
// Updating these constants is a single source of truth for both the iframe
// pan range and the per-section reveal thresholds.
const IFRAME_NATURAL_HEIGHT = 5400; // total DPP page height at phone width
const DESKTOP_SCREEN_HEIGHT = 591;  // 280px-wide phone, 9:19 ratio
const MOBILE_SCREEN_HEIGHT = 506;   // 240px-wide phone, 9:19 ratio
// Stage scroll runway in viewport heights. Longer = slower pan.
const STAGE_HEIGHT_VH = 480;

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type Callout = {
  id: number;
  label: string;
  body: string;
  // Approximate DPP Y of the section's top, in pixels. Used to compute
  // both the reveal threshold and the live line endpoint position.
  sectionY: number;
  // Approximate height of the section so we can detect when it exits.
  sectionHeight: number;
  corner: Corner;
};

const callouts: Callout[] = [
  {
    id: 1,
    label: "Eco-Score",
    body: "French Affichage Environnemental score, calculated using the official Ecobalyse methodology.",
    sectionY: 350,         // inside the hero section, badge sits over the product image
    sectionHeight: 100,
    corner: "top-left",
  },
  {
    id: 2,
    label: "Headline impact",
    body: "CO₂e and water scarcity per garment, with industry-average comparison baked in.",
    sectionY: 468,
    sectionHeight: 367,
    corner: "top-right",
  },
  {
    id: 3,
    label: "Production journey",
    body: "World map of fibre-to-garment stages, with each country traced and verified.",
    sectionY: 1290,
    sectionHeight: 1275,
    corner: "bottom-left",
  },
  {
    id: 4,
    label: "Verified standards",
    body: "Real certifications and third-party claims, attached to the product page.",
    sectionY: 3055,
    sectionHeight: 793,
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
        <div className="absolute left-1/2 top-[4px] z-30 h-[16px] w-[72px] -translate-x-1/2 rounded-full bg-envrt-charcoal" />
        <div className="relative w-full overflow-hidden rounded-[2.3rem] bg-white" style={{ height: screenHeight }}>
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
const DESKTOP_PAN_RANGE = IFRAME_NATURAL_HEIGHT - DESKTOP_SCREEN_HEIGHT;
const MOBILE_PAN_RANGE = IFRAME_NATURAL_HEIGHT - MOBILE_SCREEN_HEIGHT;

// Reveal threshold for a callout: progress at which the section's top
// reaches the top of the visible window. Clamped to [0, 1].
function revealThreshold(c: Callout) {
  return Math.max(0, Math.min(1, c.sectionY / DESKTOP_PAN_RANGE));
}

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

  const desktopIframeY = useTransform(smoothProgress, [0, 1], [0, -DESKTOP_PAN_RANGE]);
  const mobileIframeY = useTransform(smoothProgress, [0, 1], [0, -MOBILE_PAN_RANGE]);

  // Accumulating reveal: once a callout reveals, it stays visible.
  const [revealedSet, setRevealedSet] = useState<Set<number>>(new Set([1]));
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    setRevealedSet((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (const c of callouts) {
        if (!next.has(c.id) && latest >= revealThreshold(c)) {
          next.add(c.id);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
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
              Scroll through a live passport. Each label stays once it appears, so you can read them together at the end as a summary.
            </p>
          </div>
        </FadeUp>

        <div
          ref={containerRef}
          className="relative mx-auto max-w-[1100px]"
          style={{ height: `${STAGE_HEIGHT_VH}vh` }}
        >
          {/* ── Mobile stage ────────────────────────────────────────────── */}
          <div className="sticky top-0 flex h-screen flex-col items-center justify-start gap-5 py-10 lg:hidden">
            <ScrollablePhone iframeY={mobileIframeY} screenHeight={MOBILE_SCREEN_HEIGHT} />
            <div className="w-full max-w-md flex-1 space-y-3">
              {callouts.map((c) => {
                const isRevealed = revealedSet.has(c.id);
                return (
                  <motion.div
                    key={c.id}
                    initial={false}
                    animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 8 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    className="flex gap-3"
                  >
                    <span className="text-xl font-bold leading-none tracking-tight text-envrt-teal">
                      {String(c.id).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-envrt-charcoal">{c.label}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-envrt-muted">{c.body}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── Desktop stage ───────────────────────────────────────────── */}
          <div className="sticky top-0 hidden h-screen items-center justify-center lg:flex">
            <DesktopStage
              callouts={callouts}
              revealedSet={revealedSet}
              progress={smoothProgress}
              iframeY={desktopIframeY}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─── Desktop stage ────────────────────────────────────────────────────────
const STAGE_WIDTH_PX = 1100;
const STAGE_HEIGHT_PX = 620;
const PHONE_LEFT_EDGE_PCT = 41;
const PHONE_RIGHT_EDGE_PCT = 59;
const PHONE_TOP_PCT = 6;
const PHONE_BOTTOM_PCT = 94;

const CORNER_LAYOUT: Record<Corner, {
  tileTop: string;
  tileSide: "left" | "right";
  tileSidePct: number;
  tileAnchor: { xPct: number; yPct: number };
}> = {
  "top-left":     { tileTop: "6%",  tileSide: "left",  tileSidePct: 2, tileAnchor: { xPct: 27, yPct: 10 } },
  "top-right":    { tileTop: "6%",  tileSide: "right", tileSidePct: 2, tileAnchor: { xPct: 73, yPct: 10 } },
  "bottom-left":  { tileTop: "62%", tileSide: "left",  tileSidePct: 2, tileAnchor: { xPct: 27, yPct: 80 } },
  "bottom-right": { tileTop: "62%", tileSide: "right", tileSidePct: 2, tileAnchor: { xPct: 73, yPct: 80 } },
};

function DesktopStage({
  callouts,
  revealedSet,
  progress,
  iframeY,
}: {
  callouts: Callout[];
  revealedSet: Set<number>;
  progress: import("framer-motion").MotionValue<number>;
  iframeY: import("framer-motion").MotionValue<number>;
}) {
  return (
    <div className="relative" style={{ width: STAGE_WIDTH_PX, height: STAGE_HEIGHT_PX, maxWidth: "100%" }}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {callouts.map((c) => (
          <ConnectorLine key={c.id} callout={c} isRevealed={revealedSet.has(c.id)} progress={progress} />
        ))}
      </svg>

      {callouts.map((c) => {
        const layout = CORNER_LAYOUT[c.corner];
        const isRevealed = revealedSet.has(c.id);
        return (
          <motion.div
            key={c.id}
            initial={false}
            animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 6 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
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

      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <ScrollablePhone iframeY={iframeY} screenHeight={DESKTOP_SCREEN_HEIGHT} />
      </div>
    </div>
  );
}

// Connector line for a single callout. While its section is in the visible
// frame, the line endpoint Y tracks the section's top. After the section
// exits the top of the frame, the endpoint clamps to the top of the phone.
function ConnectorLine({
  callout,
  isRevealed,
  progress,
}: {
  callout: Callout;
  isRevealed: boolean;
  progress: import("framer-motion").MotionValue<number>;
}) {
  const layout = CORNER_LAYOUT[callout.corner];
  const phoneEdgeXPct = layout.tileSide === "left" ? PHONE_LEFT_EDGE_PCT : PHONE_RIGHT_EDGE_PCT;

  const phoneEdgeY = useTransform(progress, (p) => {
    const panPos = DESKTOP_PAN_RANGE * p;
    const sectionOnScreen = callout.sectionY - panPos;
    const fraction = Math.max(0, Math.min(1, sectionOnScreen / DESKTOP_SCREEN_HEIGHT));
    return PHONE_TOP_PCT + fraction * (PHONE_BOTTOM_PCT - PHONE_TOP_PCT);
  });

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
      animate={{ opacity: isRevealed ? 1 : 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
    />
  );
}

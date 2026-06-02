"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { Container } from "../../ui/Container";
import { FadeUp } from "../../ui/Motion";
import { siteConfig } from "@/lib/config";

// ─── Geometry ─────────────────────────────────────────────────────────────
const MOBILE_FRAME_HEIGHT = 420;
const DESKTOP_FRAME_HEIGHT = 600;
// Natural rendered height we give the iframe. Tall enough to include every
// annotated section (headline impact, materials, supply chain, verified
// standards). The actual DPP page is ~9014px tall; this clips the bottom
// few sections (care & EOL, footer CTA) which aren't annotated.
const IFRAME_NATURAL_HEIGHT = 7200;
// Outer stage height in viewport units. Sets the scroll runway.
const STAGE_HEIGHT_VH = 480;

type Callout = {
  id: number;
  label: string;
  body: string;
  // Progress threshold (0–1) at which this callout reveals.
  revealAt: number;
  // Desktop position relative to the sticky stage.
  desktopPosition: { top: string; side: "left" | "right" };
  // Y anchor on the DPP frame edge (0–100) where the connector line lands.
  visualAnchorY: number;
};

const callouts: Callout[] = [
  {
    id: 1,
    label: "Headline impact",
    body: "CO₂e and water scarcity per garment, calculated against industry benchmarks using peer-reviewed methods.",
    revealAt: 0.0,
    desktopPosition: { top: "12%", side: "left" },
    visualAnchorY: 12,
  },
  {
    id: 2,
    label: "Materials breakdown",
    body: "Every fibre, every blend, with percentage breakdown and source country traced.",
    revealAt: 0.15,
    desktopPosition: { top: "12%", side: "right" },
    visualAnchorY: 26,
  },
  {
    id: 3,
    label: "Supply chain map",
    body: "Every stage from fibre to finished garment, mapped to the country and verified.",
    revealAt: 0.32,
    desktopPosition: { top: "62%", side: "left" },
    visualAnchorY: 56,
  },
  {
    id: 4,
    label: "Verified standards",
    body: "Aligned with EU PEF, ISO 14040 and AWARE methodologies, so the numbers hold up.",
    revealAt: 0.78,
    desktopPosition: { top: "62%", side: "right" },
    visualAnchorY: 82,
  },
];

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

  const mobileIframeY = useTransform(
    smoothProgress,
    [0, 1],
    [0, -(IFRAME_NATURAL_HEIGHT - MOBILE_FRAME_HEIGHT)],
  );
  const desktopIframeY = useTransform(
    smoothProgress,
    [0, 1],
    [0, -(IFRAME_NATURAL_HEIGHT - DESKTOP_FRAME_HEIGHT)],
  );

  // Track which callouts have been revealed. Once revealed, they stay.
  const [revealedCount, setRevealedCount] = useState(1);
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const count = callouts.filter((c) => latest >= c.revealAt).length;
    setRevealedCount(Math.max(1, count));
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
              Scroll through a live passport. Annotations appear as each part comes into view.
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
            <div className="relative mx-auto w-full max-w-[260px]">
              <div
                className="relative overflow-hidden rounded-[1.75rem] border border-envrt-charcoal/10 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)]"
                style={{ height: MOBILE_FRAME_HEIGHT }}
              >
                <motion.iframe
                  src={siteConfig.dppDemoEmbedUrl}
                  title="What's in a Digital Product Passport"
                  loading="lazy"
                  className="pointer-events-none absolute left-0 top-0 w-full border-0"
                  style={{ y: mobileIframeY, height: IFRAME_NATURAL_HEIGHT }}
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>

            {/* Accumulating callout stack below the visual */}
            <div className="relative w-full max-w-md flex-1 overflow-hidden">
              <div className="flex flex-col gap-4">
                {callouts.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{
                      opacity: i < revealedCount ? 1 : 0,
                      y: i < revealedCount ? 0 : 12,
                    }}
                    transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                    className="flex gap-4"
                  >
                    <span className="text-2xl font-bold leading-none tracking-tight text-envrt-teal">
                      {String(c.id).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-envrt-charcoal">{c.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-envrt-muted">{c.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Desktop stage ───────────────────────────────────────────── */}
          <div className="sticky top-0 hidden h-screen items-center justify-center pt-12 lg:flex">
            <div className="relative h-full w-full max-w-[1100px]">
              {/* SVG connector overlay */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {callouts.map((c, i) => {
                  const isRevealed = i < revealedCount;
                  const visualEdgeX = c.desktopPosition.side === "left" ? 39 : 61;
                  const calloutDotX = c.desktopPosition.side === "left" ? 28 : 72;
                  const calloutDotY = parseFloat(c.desktopPosition.top) + 6;
                  return (
                    <motion.g
                      key={c.id}
                      initial={false}
                      animate={{ opacity: isRevealed ? 1 : 0 }}
                      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <motion.line
                        x1={visualEdgeX}
                        y1={c.visualAnchorY}
                        x2={calloutDotX}
                        y2={calloutDotY}
                        stroke="rgba(42, 161, 152, 0.5)"
                        strokeWidth={0.15}
                        strokeDasharray="0.5 0.5"
                        vectorEffect="non-scaling-stroke"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: isRevealed ? 1 : 0 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                      />
                      <circle
                        cx={visualEdgeX}
                        cy={c.visualAnchorY}
                        r={0.4}
                        fill="rgb(42, 161, 152)"
                        vectorEffect="non-scaling-stroke"
                      />
                      <circle
                        cx={calloutDotX}
                        cy={calloutDotY}
                        r={0.3}
                        fill="rgb(42, 161, 152)"
                        vectorEffect="non-scaling-stroke"
                      />
                    </motion.g>
                  );
                })}
              </svg>

              {/* Callout panels positioned absolutely */}
              {callouts.map((c, i) => {
                const isRevealed = i < revealedCount;
                return (
                  <motion.div
                    key={c.id}
                    initial={false}
                    animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 8 }}
                    transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                    className={`absolute w-[24%] ${c.desktopPosition.side === "left" ? "text-left" : "text-right"}`}
                    style={{
                      top: c.desktopPosition.top,
                      [c.desktopPosition.side === "left" ? "left" : "right"]: "2%",
                    }}
                  >
                    <p className="text-3xl font-bold leading-none tracking-tight text-envrt-teal sm:text-4xl">
                      {String(c.id).padStart(2, "0")}
                    </p>
                    <p className="mt-3 text-base font-semibold text-envrt-charcoal">{c.label}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-envrt-muted">{c.body}</p>
                  </motion.div>
                );
              })}

              {/* DPP visual, centred */}
              <div className="absolute left-1/2 top-1/2 w-[340px] -translate-x-1/2 -translate-y-1/2">
                <div
                  className="relative overflow-hidden rounded-[2rem] border border-envrt-charcoal/10 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]"
                  style={{ height: DESKTOP_FRAME_HEIGHT }}
                >
                  <motion.iframe
                    src={siteConfig.dppDemoEmbedUrl}
                    title="What's in a Digital Product Passport"
                    loading="lazy"
                    className="pointer-events-none absolute left-0 top-0 w-full border-0"
                    style={{ y: desktopIframeY, height: IFRAME_NATURAL_HEIGHT }}
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

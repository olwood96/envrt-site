"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";
import { Eyebrow, LivePill, SECTION_SPRING } from "./_shared";

const DPP_URL = "https://dpp.envrt.com/envrt/demo-garments/hoodie-0509-1882";

// Real height of the live DPP at the iframe's 414px width. Measured by
// scripts/capture-dpp-screenshot.mjs and stored in
// public/screenshots/dpp/measurements.json. Bumping this from the old
// 4700 placeholder unclips the bottom ~650px which contained the back
// half of care-end-of-life and the feedback band.
const IFRAME_HEIGHT = 5353;

type Stop = {
  title: string;
  body: string;
  /* Scroll progress (0–1) where this stop is "active". */
  range: [number, number];
};

// Stop ranges are derived from the actual DPP section boundaries
// (measurements.json) and the pan curve (0% → -78% over progress
// 0 → 0.85). Each stop's midpoint is calibrated so the labelled
// section is centred in the phone window when the label is bold.
// Verified positions at midpoints (px into 5353-px DPP):
//
//   01 scan        @ p≈0.05 → pan -4.6%  → top of page (hero 80–452)
//   02 metrics     @ p≈0.16 → pan -14.7% → headline-metrics 468–835
//   03 materials   @ p≈0.34 → pan -30.7% → production-journey 1290–2565
//   04 footprint   @ p≈0.52 → pan -48.2% → env-impact 2581–3039
//   05 standards   @ p≈0.66 → pan -60.6% → certifications 3055–3848
//   06 care        @ p≈0.79 → pan -72.0% → care-end-of-life 3864–4657
//
// 0.85–1.00 is dwell at -78% so care + actions stay on screen
// before the section unpins.
const stops: Stop[] = [
  {
    title: "The scan moment",
    body: "Customer scans the QR on the care label. They land on a hosted page with the garment's hero image and brand voice.",
    range: [0.0, 0.10],
  },
  {
    title: "Headline impact",
    body: "CO₂e, water scarcity and data depth, calculated per garment with EU PEF and ISO 14040 methodology.",
    range: [0.10, 0.22],
  },
  {
    title: "Materials and journey",
    body: "Every fibre, every tier, every country mapped. Customers see provenance, regulators see traceability.",
    range: [0.22, 0.45],
  },
  {
    title: "Environmental footprint",
    body: "AWARE water scarcity, stage-by-stage CO₂e and the rest of the underlying data. The headline figures are auditable line by line.",
    range: [0.45, 0.60],
  },
  {
    title: "Recognised standards",
    body: "French Eco-Score, EU PEF, ISO 14040. Standards referenced with their issuing bodies on every passport.",
    range: [0.60, 0.72],
  },
  {
    title: "Care and end of life",
    body: "Repair guidance, washing instructions, take-back and recycling options. The story doesn't stop at the till.",
    range: [0.72, 0.85],
  },
];

// Split into Desktop + Mobile components, each with its own useScroll +
// useSpring chain. Mirrors ScatterToOrderSection + AnatomyOfLcaSection
// (the v3 scroll-pinned sections that never showed the mini-jitter that
// previously affected this section). Each viewport's scroll-pinned
// wrapper gets its own GPU layer via .scroll-pinned in globals.css.
// Pan + stop transforms only fire in the visible subtree, the hidden
// one's target has no layout so its useScroll reports a parked 0 and
// the spring never ticks.
//
// Both subtrees mount their own iframe. That's intentional: each phone
// shell scales the iframe at a viewport-specific factor (0.319 mobile,
// 0.411 sm, 0.720 desktop), and the alternative of a single hoisted
// iframe would need branching scroll progress per viewport which would
// re-introduce the cross-viewport coupling the split is supposed to
// remove. Browsers dedupe cross-origin fetches to the same URL where
// possible; if cache headers cooperate the second iframe rehydrates
// from cache. Worth re-measuring if this turns out to cost a lot.

export function ScrollTourSection() {
  return (
    <section
      className="relative bg-envrt-brand-vista text-envrt-brand-black"
      style={{ overflowX: "clip" }}
    >
      <DesktopScrollTour />
      <MobileScrollTour />
    </section>
  );
}

// ─── Desktop ──────────────────────────────────────────────────────────────

function DesktopScrollTour() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const { scrollYProgress: rawProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const scrollYProgress = useSpring(rawProgress, SECTION_SPRING);

  // Pan curve calibrated against the real DPP section positions. Lands
  // the care section dead-centre in the phone window at p=0.79 (mid
  // stop 06), then holds at -78% during the 0.85→1.0 dwell so care +
  // actions stay readable before the section unpins.
  const dppY = useTransform(scrollYProgress, [0, 0.85], ["0%", "-78%"]);

  return (
    <div
      ref={sectionRef}
      className="scroll-pinned relative hidden lg:block"
      style={{ height: "500vh" }}
    >
      <div className="sticky top-0 flex h-screen items-center bg-envrt-brand-vista">
        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-[1.05fr_1fr] items-center gap-16 px-16">
          <div className="relative min-w-0">
            <FadeUp>
              <Eyebrow>Tour · the passport</Eyebrow>
              <h2 className="mt-4 max-w-xl font-display text-[2.5rem] font-medium leading-[1.15] tracking-[-0.02em] text-envrt-brand-black">
                Scroll through a live passport.
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-envrt-brand-black/60">
                Five moments of a real DPP. The phone tracks your scroll.
              </p>
            </FadeUp>

            <div className="mt-8 space-y-7">
              {stops.map((stop, i) => (
                <ScrollStop
                  key={stop.title}
                  stop={stop}
                  index={i}
                  progress={scrollYProgress}
                />
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[310px]">
            <div className="relative overflow-hidden rounded-[2.4rem] border-[6px] border-envrt-brand-black bg-envrt-brand-black shadow-[0_20px_40px_-12px_rgba(14,14,14,0.4)]">
              <div className="relative h-[600px] overflow-hidden bg-white">
                <DppSkeleton hidden={iframeLoaded} />

                {/* Scale wrapper. Inner width 310 - 12 = 298, scale =
                    298 / 414 = 0.720. */}
                <div
                  className="origin-top-left scale-[0.720] will-change-transform"
                  style={{ width: "414px" }}
                >
                  <motion.div style={{ y: dppY, willChange: "transform" }}>
                    <iframe
                      src={DPP_URL}
                      title="Live ENVRT Digital Product Passport"
                      style={{ width: "414px", height: `${IFRAME_HEIGHT}px` }}
                      className={`pointer-events-none block border-0 transition-opacity duration-500 ${
                        iframeLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      loading="eager"
                      onLoad={() => setIframeLoaded(true)}
                    />
                  </motion.div>
                </div>

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col items-center gap-3">
              <LivePill label="dpp.envrt.com · live" />
              <a
                href={DPP_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-xl bg-envrt-brand-ultramarine px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_-12px_rgba(62,0,255,0.55)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Open the live passport
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile ───────────────────────────────────────────────────────────────

function MobileScrollTour() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const { scrollYProgress: rawProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const scrollYProgress = useSpring(rawProgress, SECTION_SPRING);

  const dppY = useTransform(scrollYProgress, [0, 0.85], ["0%", "-78%"]);

  return (
    <div
      ref={sectionRef}
      className="scroll-pinned relative lg:hidden"
      style={{ height: "500vh" }}
    >
      <div className="sticky top-0 flex h-screen items-center bg-envrt-brand-vista">
        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-[1fr_140px] items-center gap-3 px-5 sm:grid-cols-[1fr_180px] sm:gap-5 sm:px-8">
          <div className="relative min-w-0">
            <FadeUp>
              <Eyebrow>Tour · the passport</Eyebrow>
              <h2 className="mt-3 max-w-xl font-display text-[1.05rem] font-medium leading-[1.15] tracking-[-0.02em] text-envrt-brand-black sm:mt-4 sm:text-2xl">
                Scroll through a live passport.
              </h2>
              <p className="mt-2 hidden max-w-md text-xs leading-relaxed text-envrt-brand-black/60 sm:block sm:text-sm">
                Five moments of a real DPP. The phone tracks your scroll.
              </p>
            </FadeUp>

            <div className="mt-5 space-y-4 sm:mt-8 sm:space-y-6">
              {stops.map((stop, i) => (
                <ScrollStop
                  key={stop.title}
                  stop={stop}
                  index={i}
                  progress={scrollYProgress}
                />
              ))}
            </div>
          </div>

          {/* Phone overlaps the right edge for a peeking effect. */}
          <div className="relative mx-auto w-full max-w-[140px] translate-x-3 sm:max-w-[180px] sm:translate-x-4">
            <div className="relative overflow-hidden rounded-[1.4rem] border-[4px] border-envrt-brand-black bg-envrt-brand-black shadow-[0_20px_40px_-12px_rgba(14,14,14,0.4)] sm:rounded-[1.8rem] sm:border-[5px]">
              <div className="relative h-[268px] overflow-hidden bg-white sm:h-[370px]">
                <DppSkeleton hidden={iframeLoaded} />

                {/* Scale wrapper.
                    Mobile: (140 - 8) / 414 = 0.319
                    sm:     (180 - 10) / 414 = 0.411 */}
                <div
                  className="origin-top-left scale-[0.319] will-change-transform sm:scale-[0.411]"
                  style={{ width: "414px" }}
                >
                  <motion.div style={{ y: dppY, willChange: "transform" }}>
                    <iframe
                      src={DPP_URL}
                      title="Live ENVRT Digital Product Passport"
                      style={{ width: "414px", height: `${IFRAME_HEIGHT}px` }}
                      className={`pointer-events-none block border-0 transition-opacity duration-500 ${
                        iframeLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      loading="eager"
                      onLoad={() => setIframeLoaded(true)}
                    />
                  </motion.div>
                </div>

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white to-transparent sm:h-10"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent sm:h-12"
                />
              </div>
            </div>

            <div className="mt-4 hidden flex-col items-center gap-3 sm:mt-5 sm:flex">
              <LivePill label="dpp.envrt.com · live" />
              <a
                href={DPP_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 rounded-xl bg-envrt-brand-ultramarine px-4 py-2.5 text-xs font-semibold text-white shadow-[0_10px_22px_-12px_rgba(62,0,255,0.55)] transition-transform duration-200 hover:-translate-y-0.5 sm:text-sm"
              >
                Open the live passport
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only CTA below the sticky tour, renders once at the
          end of the scroll-tour scroll range. */}
      <div className="absolute inset-x-0 bottom-0 z-10 sm:hidden">
        <div className="mx-auto max-w-[1320px] px-5 pb-6">
          <a
            href={DPP_URL}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between gap-3 rounded-2xl border border-envrt-brand-black/10 bg-white px-4 py-3 text-sm font-semibold text-envrt-brand-black shadow-sm hover:border-envrt-brand-ultramarine/30 hover:text-envrt-brand-ultramarine"
          >
            <span>Open the live passport</span>
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Stop ─────────────────────────────────────────────────────────────────

function ScrollStop({
  stop,
  index,
  progress,
}: {
  stop: Stop;
  index: number;
  progress: MotionValue<number>;
}) {
  const [start, end] = stop.range;
  const fade = 0.04;
  const dim = 0.28;

  const opacity = useTransform(progress, (p) => {
    if (p < start - fade) return dim;
    if (p < start) return dim + (1 - dim) * ((p - (start - fade)) / fade);
    if (p <= end) return 1;
    if (p <= end + fade) return dim + (1 - dim) * (1 - (p - end) / fade);
    return dim;
  });

  const indicatorOpacity = useTransform(progress, (p) =>
    p >= start - fade && p <= end + fade ? 1 : 0,
  );

  const isActive = useTransform(progress, (p) => p >= start && p <= end);

  return (
    <motion.div
      style={{ opacity }}
      className="relative grid grid-cols-[28px_1fr] gap-2 sm:grid-cols-[44px_1fr] sm:gap-3"
    >
      <motion.span
        aria-hidden
        style={{ opacity: indicatorOpacity }}
        className="absolute left-0 top-1 h-5 w-[2px] bg-envrt-brand-ultramarine sm:h-6"
      />
      <ActiveNumber index={index} active={isActive} />
      <div className="min-w-0">
        <h3 className="font-display text-sm font-semibold leading-tight tracking-tight text-envrt-brand-black sm:text-base lg:text-xl">
          {stop.title}
        </h3>
        <p className="mt-1 max-w-md text-[11px] leading-relaxed text-envrt-brand-black/65 sm:mt-1.5 sm:text-xs lg:text-sm">
          {stop.body}
        </p>
      </div>
    </motion.div>
  );
}

function ActiveNumber({
  index,
  active,
}: {
  index: number;
  active: MotionValue<boolean>;
}) {
  const [on, setOn] = useState(false);
  useEffect(() => active.on("change", setOn), [active]);
  return (
    <p
      className={`font-display pl-2 text-base font-semibold leading-none tracking-[-0.02em] transition-colors duration-300 sm:pl-2.5 sm:text-xl lg:text-3xl ${
        on ? "text-envrt-brand-ultramarine" : "text-envrt-brand-black/15"
      }`}
    >
      {String(index + 1).padStart(2, "0")}
    </p>
  );
}

// ─── DPP skeleton ─────────────────────────────────────────────────────────

// Plausible DPP layout silhouette (hero block, headline metrics, list rows).
// Sits behind the iframe at full phone-screen size so the phone never
// shows white during the cross-origin iframe fetch.
function DppSkeleton({ hidden }: { hidden: boolean }) {
  return (
    <div
      aria-hidden
      className={`absolute inset-0 bg-white transition-opacity duration-500 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex h-full flex-col gap-3 p-3 sm:p-4 lg:gap-4 lg:p-6">
        <div className="h-[40%] animate-pulse rounded-lg bg-envrt-brand-black/8" />
        <div className="flex gap-2 lg:gap-3">
          <div className="h-10 flex-1 animate-pulse rounded-md bg-envrt-brand-black/6 lg:h-14" />
          <div className="h-10 flex-1 animate-pulse rounded-md bg-envrt-brand-black/6 lg:h-14" />
        </div>
        <div className="space-y-2 lg:space-y-3">
          <div className="h-3 w-3/4 animate-pulse rounded bg-envrt-brand-black/6 lg:h-4" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-envrt-brand-black/6 lg:h-4" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-envrt-brand-black/6 lg:h-4" />
        </div>
      </div>
    </div>
  );
}

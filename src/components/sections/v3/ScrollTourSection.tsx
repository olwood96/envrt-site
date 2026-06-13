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

export function ScrollTourSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const { scrollYProgress: rawProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Spring-smoothed scroll progress. Restoring this fixes the jitter
  // I'd previously caused by removing it. Raw scrollYProgress from
  // useScroll has sub-frame noise (Lenis updates many times per
  // frame, browsers have sub-pixel scroll quirks). useSpring filters
  // that noise before it drives the iframe Y transform, which is why
  // the other v3 scroll-pinned sections (Scatter, Anatomy) — which
  // never lost their spring — stayed smooth while this one visibly
  // oscillated.
  const scrollYProgress = useSpring(rawProgress, SECTION_SPRING);

  // Pan curve calibrated against the real DPP section positions (see the
  // stops table above and measurements.json). Lands the care section
  // dead-centre in the phone window at p=0.79 (mid stop 06), then holds
  // at -78% during the 0.85→1.0 dwell so care + actions stay readable
  // before the section unpins.
  const dppY = useTransform(scrollYProgress, [0, 0.85], ["0%", "-78%"]);

  return (
    <section
      ref={sectionRef}
      className="scroll-pinned relative bg-envrt-brand-vista text-envrt-brand-black"
      style={{ height: "500vh", overflowX: "clip" }}
    >
      <div className="sticky top-0 flex h-screen items-center bg-envrt-brand-vista">
        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-[1fr_140px] items-center gap-3 px-5 sm:grid-cols-[1fr_180px] sm:gap-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-16">
          <div className="relative min-w-0">
            <FadeUp>
              <Eyebrow>Tour · the passport</Eyebrow>
              <h2 className="mt-3 max-w-xl font-display text-[1.05rem] font-medium leading-[1.15] tracking-[-0.02em] text-envrt-brand-black sm:mt-4 sm:text-2xl lg:text-[2.5rem]">
                Scroll through a live passport.
              </h2>
              <p className="mt-2 hidden max-w-md text-xs leading-relaxed text-envrt-brand-black/60 sm:block sm:text-sm">
                Five moments of a real DPP. The phone tracks your scroll.
              </p>
            </FadeUp>

            <div className="mt-5 space-y-4 sm:mt-8 sm:space-y-6 lg:space-y-7">
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

          {/* Right: pinned phone. On mobile it's small (140px) and overlaps
              the right edge of the viewport for a "peeking" effect. On
              desktop it grows back to a normal phone size. */}
          <div className="relative mx-auto w-full max-w-[140px] translate-x-3 sm:max-w-[180px] sm:translate-x-4 lg:max-w-[310px] lg:translate-x-0">
            {/* Halo removed. Phone shell carries enough visual weight on its
                own; the previous radial wash read as accent noise. */}

            {/* Phone shell — borders slimmed so the screen content reads
                bigger inside the same outer phone footprint. Rounded
                corners also tightened slightly to match the thinner
                bezel. */}
            <div className="relative overflow-hidden rounded-[1.4rem] border-[4px] border-envrt-brand-black bg-envrt-brand-black shadow-[0_20px_40px_-12px_rgba(14,14,14,0.4)] sm:rounded-[1.8rem] sm:border-[5px] lg:rounded-[2.4rem] lg:border-[6px]">
              {/* Screen window — fixed visible height, overflow clipped.
                  The iframe inside is rendered at IFRAME_W (414px, a real
                  mobile viewport width so the DPP's responsive layout reads
                  correctly), then scaled down per breakpoint to fit the
                  phone frame. */}
              <div className="relative h-[268px] overflow-hidden bg-white sm:h-[370px] lg:h-[600px]">
                {/* Skeleton placeholder. Renders behind the iframe so the
                    phone never shows a blank white screen during the iframe
                    fetch. Hidden once the iframe finishes loading. */}
                <DppSkeleton hidden={iframeLoaded} />

                {/* Scale wrapper: explicit width matching iframe's natural
                    width. Scale factor = inner phone width / 414, where
                    inner width = phone outer width - (2 * border width).
                    Mobile: (140 - 8) / 414 = 0.319
                    sm:     (180 - 10) / 414 = 0.411
                    lg:     (310 - 12) / 414 = 0.720 */}
                <div
                  className="origin-top-left scale-[0.319] will-change-transform sm:scale-[0.411] lg:scale-[0.720]"
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

                {/* Top + bottom fade masks */}
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

      {/* Mobile-only "open the live passport" CTA below the sticky tour.
          Renders once at the end of the scroll-tour scroll range. */}
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
    </section>
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

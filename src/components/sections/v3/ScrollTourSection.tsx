"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";
import { Eyebrow, LivePill } from "./_shared";

const DPP_URL = "https://dpp.envrt.com/envrt/demo-garments/hoodie-0509-1882";

type Stop = {
  title: string;
  body: string;
  /* Scroll progress (0–1) where this stop is "active". */
  range: [number, number];
};

const stops: Stop[] = [
  {
    title: "The scan moment",
    body: "Customer scans the QR on the care label. They land on a hosted page with the garment's hero image and brand voice.",
    range: [0.0, 0.18],
  },
  {
    title: "Headline impact",
    body: "CO₂e, water scarcity and data depth, calculated per garment with EU PEF and ISO 14040 methodology.",
    range: [0.18, 0.36],
  },
  {
    title: "Materials and journey",
    body: "Every fibre, every tier, every country mapped. Customers see provenance, regulators see traceability.",
    range: [0.36, 0.60],
  },
  {
    title: "Recognised standards",
    body: "French Eco-Score, EU PEF, ISO 14040, AWARE water stress. Certifications listed with issuing bodies and expiry dates.",
    range: [0.60, 0.80],
  },
  {
    title: "Care and end of life",
    body: "Repair guidance, washing instructions, take-back and recycling options. The story doesn't stop at the till.",
    range: [0.80, 1.0],
  },
];

export function ScrollTourSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Pan the iframe top → bottom across the section.
  const dppY = useTransform(scrollYProgress, [0, 1], ["0%", "-82%"]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-envrt-brand-vista text-envrt-brand-black"
      style={{ height: "500vh", overflowX: "clip" }}
    >
      <div className="sticky top-0 flex h-screen items-center bg-envrt-brand-vista">
        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-[1fr_140px] items-center gap-3 px-5 sm:grid-cols-[1fr_180px] sm:gap-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-16">
          <div className="relative min-w-0">
            <FadeUp>
              <Eyebrow>Tour · the passport</Eyebrow>
              <h2 className="mt-3 max-w-xl font-display text-[1.35rem] font-medium leading-[1.1] tracking-[-0.02em] text-envrt-brand-black sm:mt-4 sm:text-3xl lg:text-[2.5rem]">
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

            {/* Phone shell */}
            <div className="relative overflow-hidden rounded-[1.6rem] border-[6px] border-envrt-brand-black bg-envrt-brand-black shadow-[0_20px_40px_-12px_rgba(14,14,14,0.4)] sm:rounded-[2rem] sm:border-[7px] lg:rounded-[2.6rem] lg:border-[10px]">
              {/* Screen window — fixed visible height, overflow clipped.
                  The iframe inside is rendered at IFRAME_W (414px, a real
                  mobile viewport width so the DPP's responsive layout reads
                  correctly), then scaled down per breakpoint to fit the
                  phone frame. */}
              <div className="relative h-[260px] overflow-hidden bg-white sm:h-[360px] lg:h-[580px]">
                {/* Scale wrapper: explicit width matching iframe's natural
                    width. Scale factor = inner phone width / 414, where
                    inner width = phone outer width - (2 * border width).
                    Mobile: (140 - 12) / 414 = 0.309
                    sm:     (180 - 14) / 414 = 0.401
                    lg:     (310 - 20) / 414 = 0.700 */}
                <div
                  className="origin-top-left scale-[0.309] sm:scale-[0.401] lg:scale-[0.700]"
                  style={{ width: "414px" }}
                >
                  <motion.div style={{ y: dppY }}>
                    <iframe
                      src={DPP_URL}
                      title="Live ENVRT Digital Product Passport"
                      style={{ width: "414px", height: "4700px" }}
                      className="pointer-events-none block border-0"
                      loading="lazy"
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

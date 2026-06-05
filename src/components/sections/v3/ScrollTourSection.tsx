"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";

// Scroll-pinned DPP tour. Section is 5 viewport heights tall. The phone is
// pinned; as the user scrolls, the live DPP iframe inside it pans from top to
// bottom, and the active stop on the left rail highlights when its DPP
// section is in view. Stop ranges are derived from real DPP section positions
// captured in public/screenshots/dpp/measurements.json.

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

  // Pan the live DPP iframe inside its phone frame from top to (almost)
  // bottom over the section. -82% maps to ~95% of DPP content reaching the
  // bottom of the phone screen, which leaves a tiny "more below" hint.
  const dppY = useTransform(scrollYProgress, [0, 1], ["0%", "-82%"]);

  // Halo intensity follows scroll: alive at the start, settled by the end.
  const haloOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.18, 0.28, 0.12]);

  return (
    // No overflow-hidden on the section — that would break sticky inside.
    <section
      ref={sectionRef}
      className="relative bg-envrt-offwhite text-envrt-ink"
      style={{ height: "500vh" }}
    >
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 items-center gap-8 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-16">
          {/* Left: narrative rail */}
          <div className="relative">
            <FadeUp>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-aqua sm:text-[11px]">
                Tour · the passport
              </p>
              <h2 className="mt-4 max-w-xl font-manrope text-[1.6rem] font-semibold leading-[1.1] tracking-[-0.02em] text-envrt-ink sm:mt-5 sm:text-3xl lg:text-[2.5rem]">
                Scroll through a live passport.
              </h2>
              <p className="mt-3 max-w-md text-xs leading-relaxed text-envrt-charcoal/60 sm:text-sm">
                Five moments of a real DPP. The phone tracks your scroll.
              </p>
            </FadeUp>

            <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-7">
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

          {/* Right: pinned phone with live DPP iframe */}
          <div className="relative mx-auto w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[310px]">
            {/* Aqua halo */}
            <motion.div
              aria-hidden
              style={{ opacity: haloOpacity }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-envrt-aqua blur-3xl"
            />

            {/* Phone shell */}
            <div className="relative overflow-hidden rounded-[2.4rem] border-[9px] border-envrt-ink bg-envrt-ink shadow-[0_30px_60px_-15px_rgba(14,14,14,0.35)] sm:rounded-[2.6rem] sm:border-[10px]">
              {/* Screen — iframe is positioned absolute and translated upward by
                  dppY so the phone reveals different DPP sections as the page
                  scrolls. pointer-events-none keeps page scroll from being
                  hijacked by iframe interaction. */}
              <div className="relative h-[440px] overflow-hidden bg-white sm:h-[520px] lg:h-[580px]">
                <motion.div
                  style={{ y: dppY }}
                  className="absolute inset-x-0 top-0 h-[600vh] w-full"
                >
                  <iframe
                    src={DPP_URL}
                    title="Live ENVRT Digital Product Passport"
                    className="pointer-events-none h-full w-full border-0"
                    loading="lazy"
                  />
                </motion.div>

                {/* Top + bottom fade masks */}
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

            {/* Caption + open-live link */}
            <div className="mt-5 flex flex-col items-center gap-2 sm:mt-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-envrt-charcoal/60 sm:text-[11px]">
                dpp.envrt.com · live
              </p>
              <a
                href={DPP_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-envrt-ink underline-offset-4 hover:text-envrt-aqua hover:underline"
              >
                Open the live passport
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stop ─────────────────────────────────────────────────────────────────
// A single tour stop on the left rail. Highlights when the scroll is within
// its progress range. Uses function-form useTransform to derive opacity from
// the section's scrollYProgress without invoking the Web Animations API.

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
    <motion.div style={{ opacity }} className="relative grid grid-cols-[40px_1fr] gap-3 sm:grid-cols-[56px_1fr] sm:gap-4">
      <motion.span
        aria-hidden
        style={{ opacity: indicatorOpacity }}
        className="absolute left-0 top-1 h-6 w-[2px] bg-envrt-aqua"
      />
      <ActiveNumber index={index} active={isActive} />
      <div>
        <h3 className="font-manrope text-base font-semibold leading-snug tracking-tight text-envrt-ink sm:text-xl">
          {stop.title}
        </h3>
        <p className="mt-1.5 max-w-md text-xs leading-relaxed text-envrt-charcoal/65 sm:mt-2 sm:text-sm">
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
      className={`font-manrope pl-2 text-xl font-semibold leading-none tracking-[-0.02em] transition-colors duration-300 sm:pl-3 sm:text-3xl ${
        on ? "text-envrt-aqua" : "text-envrt-ink/15"
      }`}
    >
      {String(index + 1).padStart(2, "0")}
    </p>
  );
}

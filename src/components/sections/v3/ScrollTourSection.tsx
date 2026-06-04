"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";

// Scroll-pinned DPP tour. The section is 4 viewport heights tall. The phone
// stays pinned; as the user scrolls, the DPP image inside pans, and the
// active annotation in the side rail highlights. Apple/Stripe pattern.

type Stop = {
  title: string;
  body: string;
  /* Scroll progress (0–1) where this stop is "active". */
  range: [number, number];
};

const stops: Stop[] = [
  {
    title: "The scan moment",
    body: "Customer scans the QR on the care label. They land on a hosted page with the garment's hero photo, brand voice, and the headline impact metrics.",
    range: [0.0, 0.27],
  },
  {
    title: "Audit-grade numbers",
    body: "CO₂e, water scarcity and data depth — calculated per garment with EU PEF and ISO 14040 methodology. Drop into a compliance pack without rework.",
    range: [0.27, 0.5],
  },
  {
    title: "Fibre to finished garment",
    body: "Every stage of the supply chain plotted on a map. Country, factory tier, verification status. Customers see provenance, regulators see traceability.",
    range: [0.5, 0.75],
  },
  {
    title: "Recognised standards",
    body: "French Eco-Score, EU PEF, ISO 14040 / 14067, AWARE water stress. Methodology that passes a regulator's PDF on the first read.",
    range: [0.75, 1.0],
  },
];

export function ScrollTourSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Track section progress 0–1 from when the top hits the top to when the
  // bottom hits the bottom.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // The DPP screenshot is ~9000px tall. We pan it from 0% to -70%, leaving
  // enough at the bottom that the final stop still has content visible.
  const dppY = useTransform(scrollYProgress, [0, 1], ["0%", "-72%"]);

  // Soft halo intensity follows scroll progress — page feels alive at the
  // start, settles by the end.
  const haloOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.18, 0.28, 0.12]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-envrt-ink text-envrt-offwhite"
      style={{ height: "400vh" }}
    >
      {/* Subtle background grid for the dark surface */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 items-center gap-12 px-6 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:px-16">
          {/* Left: narrative rail */}
          <div className="relative">
            <FadeUp>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-envrt-teal-light">
                Tour · the passport
              </p>
              <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-envrt-offwhite sm:text-4xl lg:text-[2.75rem]">
                Scroll through a live passport.
              </h2>
            </FadeUp>

            <div className="mt-12 space-y-10">
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

          {/* Right: pinned phone with scrolling DPP */}
          <div className="relative mx-auto w-full max-w-[320px]">
            {/* Teal halo */}
            <motion.div
              aria-hidden
              style={{ opacity: haloOpacity }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-envrt-teal blur-3xl"
            />

            {/* Phone shell */}
            <div className="relative overflow-hidden rounded-[2.6rem] border-[10px] border-envrt-charcoal bg-envrt-charcoal shadow-[0_40px_80px_rgba(0,0,0,0.55)]">
              {/* Screen */}
              <div className="relative h-[600px] overflow-hidden bg-white">
                <motion.div style={{ y: dppY }} className="relative w-full">
                  <Image
                    src="/screenshots/dpp/hoodie-full.png"
                    alt="Live Digital Product Passport — pans as you scroll"
                    width={828}
                    height={9014}
                    sizes="300px"
                    className="block w-full"
                    priority
                  />
                </motion.div>

                {/* Top + bottom fade masks so the edges feel framed */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent"
                />
              </div>
            </div>

            {/* Caption under the phone */}
            <p className="mt-6 text-center text-xs font-medium uppercase tracking-[0.18em] text-envrt-offwhite/50">
              dpp.envrt.com · live example
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stop ─────────────────────────────────────────────────────────────────
// A single tour stop on the left rail. Highlights when the scroll is within
// its progress range. Uses useTransform to derive its own opacity/border
// states from the section's scrollYProgress.

import type { MotionValue } from "framer-motion";

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
  const fadeIn = Math.max(start - 0.05, 0);
  const fadeOut = Math.min(end + 0.05, 1);

  // Active state: full opacity within range, dimmed outside
  const opacity = useTransform(
    progress,
    [fadeIn - 0.04, fadeIn, fadeOut, fadeOut + 0.04],
    [0.32, 1, 1, 0.32],
  );

  // Number colour and border tint mirror the active state
  const numColor = useTransform(
    progress,
    [fadeIn, fadeOut],
    ["#5bbdb6", "#5bbdb6"],
  );

  const borderOpacity = useTransform(
    progress,
    [fadeIn - 0.04, fadeIn, fadeOut, fadeOut + 0.04],
    [0, 1, 1, 0],
  );

  return (
    <motion.div style={{ opacity }} className="relative grid grid-cols-[60px_1fr] gap-5">
      {/* Left edge indicator */}
      <motion.span
        aria-hidden
        style={{ opacity: borderOpacity }}
        className="absolute left-0 top-1 h-7 w-[2px] bg-envrt-teal-light"
      />
      <motion.p
        style={{ color: numColor }}
        className="pl-4 text-3xl font-semibold leading-none tracking-[-0.02em] text-envrt-offwhite/30 sm:text-4xl"
      >
        {String(index + 1).padStart(2, "0")}
      </motion.p>
      <div>
        <h3 className="text-xl font-semibold leading-snug tracking-[-0.01em] text-envrt-offwhite sm:text-2xl">
          {stop.title}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-envrt-offwhite/65 sm:text-base">
          {stop.body}
        </p>
      </div>
    </motion.div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";

type Stat = {
  number: number;
  display: string;
  unit?: string;
  prefix?: string;
  label: string;
  body: string;
};

const stats: Stat[] = [
  {
    number: 30,
    display: "30",
    unit: "min",
    label: "to first DPP",
    body: "Most brands onboard in around 30 minutes. Upload your collection, generate your first passport the same day.",
  },
  {
    number: 68431,
    display: "68,431",
    label: "reference cells per LCA",
    body: "Materials, processes, dyeing, energy grids, transport, AWARE water scarcity, trims. Every passport pulls the same full database.",
  },
  {
    number: 149,
    display: "£149",
    prefix: "£",
    unit: "/mo",
    label: "Starter plan",
    body: "Per-garment DPPs with lifecycle metrics and analytics. Most competitor tooling starts in the tens of thousands per year.",
  },
];

// ─── Smooth count-up using framer-motion's animate() ──────────────────────
// Drives a motion value from 0 to the target with an expo ease-out so the
// final approach is gentle. The wrapper element also rises from below for a
// "flip up" feel. Once the animation completes the formatted display string
// takes over (so "68,431" reads with the comma, "£149" gets its currency
// glyph).

function CountUp({
  to,
  display,
  prefix,
}: {
  to: number;
  display: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const motionVal = useMotionValue(0);
  const formatted = useTransform(motionVal, (v) => {
    const rounded = Math.round(v);
    return prefix ? `${prefix}${rounded.toLocaleString()}` : rounded.toLocaleString();
  });
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, to, {
      duration: 1.8,
      // Expo ease-out — fast start, soft landing
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => setDone(true),
    });
    return controls.stop;
  }, [inView, to, motionVal]);

  // Once done, swap to the pre-formatted display so it can carry commas,
  // currency symbols, etc.
  return (
    <span ref={ref} className="tabular-nums">
      {done ? display : <motion.span>{formatted}</motion.span>}
    </span>
  );
}

// ─── Single stat column with flip-up entrance ────────────────────────────

function StatColumn({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="sm:px-8 sm:first:pl-0 sm:last:pr-0">
      {/* Big numeral with translateY entrance */}
      <motion.p
        initial={{ y: 32, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{
          duration: 0.9,
          delay: index * 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
        // Big stat numerals use N27 — the brand's wordmark font. Its blocky
        // letterforms read as "ENVRT-stamped" at display sizes and give the
        // page's most visible numbers their own voice (vs the generic display
        // font everywhere else).
        className="font-n27 text-[4.5rem] font-bold leading-none tracking-[-0.02em] text-white sm:text-[5.5rem] lg:text-[6.5rem]"
      >
        <CountUp to={stat.number} display={stat.display} prefix={stat.prefix} />
        {stat.unit && (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: 1.4 + index * 0.08,
              ease: "easeOut",
            }}
            className="ml-1 inline-block align-top text-2xl font-medium tracking-normal text-white/45 sm:text-3xl"
          >
            {stat.unit}
          </motion.span>
        )}
      </motion.p>

      {/* Aqua label */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 + index * 0.08, ease: "easeOut" }}
        className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-envrt-brand-ultramarine"
      >
        {stat.label}
      </motion.p>

      {/* Body */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.75 + index * 0.08, ease: "easeOut" }}
        className="mt-3 max-w-sm text-sm leading-relaxed text-white/65"
      >
        {stat.body}
      </motion.p>
    </div>
  );
}

export function NumbersSection() {
  return (
    // Single dark moment in an otherwise light page. The shift to envrt-brand-black
    // creates a scroll heartbeat and lets the big numerals carry real weight.
    <section className="relative overflow-hidden bg-envrt-brand-black py-20 sm:py-24 lg:py-32">
      {/* Subtle aqua wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/3 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-envrt-brand-ultramarine/[0.07] blur-3xl"
      />
      {/* Faint top-left aqua ribbon for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-0 h-[320px] w-[480px] rounded-full bg-envrt-brand-ultramarine/[0.04] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1320px] px-6 sm:px-10 lg:px-16">
        <FadeUp>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine">
            By the numbers
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.75rem]">
            Built for fashion, priced for fashion.
          </h2>
        </FadeUp>

        <div className="mt-14 grid grid-cols-1 gap-y-12 border-t border-white/12 pt-12 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-0 sm:divide-x sm:divide-white/12">
          {stats.map((s, i) => (
            <StatColumn key={s.label} stat={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

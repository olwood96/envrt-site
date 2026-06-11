"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";
import {
  CURRENCY_SYMBOL,
  pricingPlans,
} from "@/lib/config";
import { usePricing } from "@/components/v3/pricing/PricingContext";
import { DotGridBackground, SectionCorners } from "./_shared";

type Stat = {
  number: number;
  display: string;
  unit?: string;
  prefix?: string;
  label: string;
  body: string;
  // Optional formatter for the in-flight count-up. Lets stats with
  // suffix-style display ("167M+") match their final readout during
  // the animation rather than scrolling raw digits.
  formatter?: (v: number) => string;
};

// Starter pricing stat reads from the same source as the pricing page,
// so a currency / billing switch propagates here without a navigation.
const STARTER_PLAN = pricingPlans.find((p) => p.slug === "starter");

// Round to 3sf with M / k suffix. 167,040,071 → "167M". Sub-1k passes
// through unchanged.
function formatBig(n: number): string {
  if (n >= 1_000_000) {
    const millions = n / 1_000_000;
    return `${millions >= 100 ? Math.round(millions) : millions.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const thousands = n / 1_000;
    return `${thousands >= 100 ? Math.round(thousands) : thousands.toFixed(1)}k`;
  }
  return n.toString();
}

function useStats(dataPointsServed: number): Stat[] {
  const { currency, billing } = usePricing();
  const starterPrice = STARTER_PLAN?.prices?.[currency][billing] ?? 149;
  const sym = CURRENCY_SYMBOL[currency];

  return [
    {
      number: 30,
      display: "30",
      unit: "min",
      label: "to first DPP",
      body: "A 30-minute onboarding call walks your team through the platform. Once your data is in, your first passport is generated the same day.",
    },
    {
      number: dataPointsServed,
      display: `${formatBig(dataPointsServed)}+`,
      formatter: (v) => `${formatBig(v)}+`,
      label: "data points served via DPPs",
      body: "Cumulative reference cells delivered to consumers across every DPP scan. Each scan opens the full 68,431-cell calculation behind that garment.",
    },
    {
      number: starterPrice,
      display: `${sym}${starterPrice}`,
      prefix: sym,
      unit: billing === "annual" ? "/mo, annual" : "/mo",
      label: "Starter plan",
      body: "Per-garment DPPs with lifecycle metrics and analytics. Most competitor tooling is priced by quote and tends to be significantly higher.",
    },
  ];
}

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
  formatter,
}: {
  to: number;
  display: string;
  prefix?: string;
  formatter?: (v: number) => string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  // once: false so the count re-fires every time the section enters view
  // (e.g. scrolling back up and down again).
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const motionVal = useMotionValue(0);
  const formatted = useTransform(motionVal, (v) => {
    const rounded = Math.round(v);
    if (formatter) return formatter(rounded);
    return prefix ? `${prefix}${rounded.toLocaleString()}` : rounded.toLocaleString();
  });
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (inView) {
      setDone(false);
      motionVal.set(0);
      const controls = animate(motionVal, to, {
        duration: 1.8,
        // Expo ease-out — fast start, soft landing
        ease: [0.16, 1, 0.3, 1],
        onComplete: () => setDone(true),
      });
      return controls.stop;
    }
    // Out of view: reset so the next entry starts from zero
    setDone(false);
    motionVal.set(0);
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
  // once: false so the column slides back down + fades out when scrolled
  // out, then re-animates in on the next entry.
  const inView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <div ref={ref} className="sm:px-8 sm:first:pl-0 sm:last:pr-0">
      {/* Big numeral with translateY entrance */}
      <motion.p
        initial={{ y: 32, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 32, opacity: 0 }}
        transition={{
          duration: 0.9,
          delay: inView ? index * 0.08 : 0,
          ease: [0.16, 1, 0.3, 1],
        }}
        // Big stat numerals use N27 — the brand's wordmark font. Its blocky
        // letterforms read as "ENVRT-stamped" at display sizes and give the
        // page's most visible numbers their own voice (vs the generic display
        // font everywhere else).
        className="font-n27 text-[4.5rem] font-bold leading-none tracking-[-0.02em] text-white sm:text-[5.5rem] lg:text-[6.5rem]"
      >
        <CountUp
          to={stat.number}
          display={stat.display}
          prefix={stat.prefix}
          formatter={stat.formatter}
        />
        {stat.unit && (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{
              duration: 0.6,
              delay: inView ? 1.4 + index * 0.08 : 0,
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
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{
          duration: 0.5,
          delay: inView ? 0.6 + index * 0.08 : 0,
          ease: "easeOut",
        }}
        className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-envrt-brand-lilac"
      >
        {stat.label}
      </motion.p>

      {/* Body */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{
          duration: 0.5,
          delay: inView ? 0.75 + index * 0.08 : 0,
          ease: "easeOut",
        }}
        className="mt-3 max-w-sm text-sm leading-relaxed text-white/65"
      >
        {stat.body}
      </motion.p>
    </div>
  );
}

export function NumbersSection({
  dataPointsServed,
}: {
  dataPointsServed: number;
}) {
  const stats = useStats(dataPointsServed);
  return (
    <section className="relative overflow-hidden bg-envrt-brand-black py-20 sm:py-24 lg:py-32">
      <DotGridBackground tone="lilac" opacity={0.06} size={26} />
      <SectionCorners tone="dark" left="ENVRT/04" right="By the numbers" />

      <div className="relative mx-auto max-w-[1320px] px-6 sm:px-10 lg:px-16">
        <FadeUp>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-lilac">
            By the numbers
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-3xl font-medium leading-[1.1] tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.75rem]">
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

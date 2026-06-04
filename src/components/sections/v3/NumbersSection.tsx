"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";

type Stat = {
  number: number;
  display: string;
  unit?: string;
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
    unit: "/mo",
    label: "Starter plan",
    body: "Per-garment DPPs with lifecycle metrics and analytics. Most competitor tooling starts in the tens of thousands per year.",
  },
];

// Count-up: animates from 0 to target the first time the section enters view.
function CountUp({ to, display }: { to: number; display: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  // For nice display: when finished, swap to the formatted display string
  // (so "2,400" reads with the comma).
  const shown = inView && val >= to ? display : val.toLocaleString();

  return <span ref={ref}>{shown}</span>;
}

export function NumbersSection() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-10 lg:px-16">
        <FadeUp>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-envrt-teal">
            By the numbers
          </p>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-envrt-ink sm:text-4xl lg:text-[2.75rem]">
            Built for fashion, priced for fashion.
          </h2>
        </FadeUp>

        <div className="mt-14 grid grid-cols-1 gap-y-12 border-t border-envrt-ink/8 pt-12 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-0 sm:divide-x sm:divide-envrt-ink/8">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={0.1 + i * 0.08}>
              <div className="sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <p className="text-[4.5rem] font-semibold leading-none tracking-[-0.04em] text-envrt-ink sm:text-[5.5rem] lg:text-[6.5rem]">
                  <CountUp to={s.number} display={s.display} />
                  {s.unit && (
                    <span className="ml-1 align-top text-2xl font-medium tracking-normal text-envrt-muted sm:text-3xl">
                      {s.unit}
                    </span>
                  )}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-envrt-teal">
                  {s.label}
                </p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-envrt-charcoal/70">
                  {s.body}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

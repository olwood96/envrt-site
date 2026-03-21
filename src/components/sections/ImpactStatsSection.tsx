"use client";

import { useEffect, useRef, useState } from "react";
import type { ImpactStats } from "@/lib/impact-stats";
import { useIntersectionOnce } from "@/hooks/useIntersectionOnce";
import { Container } from "../ui/Container";
import { FadeUp } from "../ui/Motion";

/* ── Count-up hook ── */

function useCountUp(target: number, started: boolean, duration = 2000) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    // After initial animation completes, pass through updates directly
    // (FlipDigit handles the visual transition for incremental changes)
    if (doneRef.current) {
      setValue(target);
      return;
    }

    if (!started || target === 0) {
      setValue(target);
      return;
    }

    // Check reduced motion preference
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(target);
      doneRef.current = true;
      return;
    }

    const t0 = performance.now();
    const animTarget = target;
    function tick() {
      const elapsed = performance.now() - t0;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * animTarget));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        doneRef.current = true;
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, started, duration]);

  return value;
}

/* ── FlipDigit — single character with flip animation ── */

function FlipDigit({ char, isDigit }: { char: string; isDigit: boolean }) {
  const [display, setDisplay] = useState(char);
  const [flipping, setFlipping] = useState(false);
  const prevRef = useRef(char);

  useEffect(() => {
    if (char === prevRef.current) return;
    prevRef.current = char;

    if (!isDigit) {
      setDisplay(char);
      return;
    }

    // Check reduced motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(char);
      return;
    }

    setFlipping(true);
    // After flip-out, swap the digit and flip-in
    const timer = setTimeout(() => {
      setDisplay(char);
      setFlipping(false);
    }, 150); // half of the 300ms flip cycle
    return () => clearTimeout(timer);
  }, [char, isDigit]);

  if (!isDigit) {
    return (
      <span className="mx-[1px] inline-flex items-center text-envrt-charcoal/30">
        {display}
      </span>
    );
  }

  return (
    <span
      className="relative mx-[1px] inline-flex h-[1.4em] w-[0.7em] items-center justify-center overflow-hidden rounded bg-envrt-charcoal/[0.04]"
      style={{ perspective: "200px" }}
    >
      {/* Centre divider line */}
      <span className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px bg-envrt-charcoal/[0.06]" />
      <span
        className={flipping ? "flip-out-anim" : "flip-in-anim"}
        style={{
          display: "inline-block",
          backfaceVisibility: "hidden",
          transformOrigin: "center center",
        }}
      >
        {display}
      </span>
    </span>
  );
}

/* ── Flipcard number display ── */

function FlipNumber({ value }: { value: number }) {
  const formatted = value.toLocaleString("en-GB");
  const chars = formatted.split("");

  return (
    <span className="inline-flex items-center text-3xl font-bold tabular-nums text-envrt-charcoal sm:text-4xl lg:text-5xl">
      {chars.map((char, i) => (
        <FlipDigit key={i} char={char} isDigit={/\d/.test(char)} />
      ))}
    </span>
  );
}

/* ── Stat column ── */

function StatColumn({
  value,
  unit,
  label,
}: {
  value: number;
  unit: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-baseline gap-1.5">
        <FlipNumber value={value} />
        <span className="text-sm font-medium text-envrt-muted sm:text-base">
          {unit}
        </span>
      </div>
      <span className="mt-1.5 text-xs font-medium uppercase tracking-wider text-envrt-muted/70">
        {label}
      </span>
    </div>
  );
}

/* ── Section ── */

interface Props {
  stats: ImpactStats;
}

export function ImpactStatsSection({ stats: initialStats }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const visible = useIntersectionOnce(sectionRef);

  const [co2, setCo2] = useState(initialStats.co2Kg);
  const [water, setWater] = useState(initialStats.waterLitres);
  const [scans, setScans] = useState(initialStats.dppScans);

  const animatedCo2 = useCountUp(co2, visible);
  const animatedWater = useCountUp(water, visible);
  const animatedScans = useCountUp(scans, visible);

  // Poll for updated stats every 30s (server-side fetch, no anon SELECT needed)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/impact-stats");
        if (!res.ok) return;
        const data: ImpactStats = await res.json();
        setCo2(data.co2Kg);
        setWater(data.waterLitres);
        setScans(data.dppScans);
      } catch {
        // Silently ignore — next poll will retry
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  if (initialStats.co2Kg === 0 && initialStats.waterLitres === 0 && initialStats.dppScans === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-12 sm:py-16">
      <Container>
        <FadeUp>
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-envrt-muted/50">
            Platform impact
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-8">
            <StatColumn
              value={animatedCo2}
              unit="kg"
              label="CO₂e impact explored"
            />
            <StatColumn
              value={animatedWater}
              unit="L"
              label="Water impact explored"
            />
            <StatColumn
              value={animatedScans}
              unit=""
              label="DPP scans worldwide"
            />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-envrt-teal opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-envrt-teal" />
            </span>
            <span className="text-[11px] text-envrt-muted/50">
              Live platform data
            </span>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}

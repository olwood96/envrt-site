"use client";

import { useEffect, useRef, useState } from "react";
import type { ImpactStats } from "@/lib/impact-stats";
import { useIntersectionOnce } from "@/hooks/useIntersectionOnce";
import { Container } from "../ui/Container";
import { FadeUp } from "../ui/Motion";
import {
  IMPACT_POLL_INTERVAL_MS,
  IMPACT_MAX_CONSECUTIVE_ERRORS,
} from "@/lib/constants";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/* ── OdometerDigit — single slot-machine column ── */

function OdometerDigit({
  digit,
  started,
  delay,
}: {
  digit: number;
  started: boolean;
  delay: number;
}) {
  // The column shows 0-9 stacked vertically. We translate to show the target digit.
  // translateY(-digit * 10%) scrolls to the right position.
  const targetY = started ? `-${digit * 10}%` : "0%";

  return (
    <span
      className="odometer-slot relative mx-[1px] inline-flex h-[1.4em] w-[0.7em] overflow-hidden rounded bg-envrt-charcoal/[0.04]"
    >
      {/* Centre divider line */}
      <span className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px bg-envrt-charcoal/[0.06]" />

      <span
        className="odometer-strip flex flex-col items-center"
        style={{
          height: "1000%", // 10 digits × 100% each
          transform: `translateY(${targetY})`,
          transitionProperty: "transform",
          transitionDuration: started ? "1.6s" : "0s",
          transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
          transitionDelay: started ? `${delay}s` : "0s",
        }}
      >
        {DIGITS.map((d) => (
          <span
            key={d}
            className="flex h-[10%] w-full items-center justify-center"
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

/* ── Separator (comma / period) ── */

function OdometerSeparator({ char, started, delay }: { char: string; started: boolean; delay: number }) {
  return (
    <span
      className="mx-[1px] inline-flex items-center text-envrt-charcoal/30"
      style={{
        opacity: started ? 1 : 0,
        transition: `opacity 0.4s ease ${delay}s`,
      }}
    >
      {char}
    </span>
  );
}

/* ── OdometerNumber — formats value and renders digit columns ── */

function OdometerNumber({ value, started }: { value: number; started: boolean }) {
  const formatted = value.toLocaleString("en-GB");
  const chars = formatted.split("");

  // Count total digit positions for stagger calculation (right-to-left)
  const digitCount = chars.filter((c) => /\d/.test(c)).length;
  let digitIndex = 0;

  return (
    <span className="inline-flex items-center text-3xl font-bold tabular-nums text-envrt-charcoal sm:text-4xl lg:text-5xl">
      {chars.map((char, i) => {
        if (/\d/.test(char)) {
          const posFromRight = digitCount - 1 - digitIndex;
          // Stagger: rightmost digit has shortest delay, leftmost has longest
          const delay = posFromRight * 0.08;
          digitIndex++;
          return (
            <OdometerDigit
              key={`d-${i}`}
              digit={parseInt(char, 10)}
              started={started}
              delay={delay}
            />
          );
        }
        // Separator — fades in with the delay of the digit to its left
        const delay = (digitCount - digitIndex) * 0.08;
        return (
          <OdometerSeparator key={`s-${i}`} char={char} started={started} delay={delay} />
        );
      })}
    </span>
  );
}

/* ── Stat column ── */

function StatColumn({
  value,
  unit,
  label,
  started,
  showDivider,
}: {
  value: number;
  unit: string;
  label: string;
  started: boolean;
  showDivider?: boolean;
}) {
  return (
    <>
      <div className="flex flex-col items-center text-center py-2 sm:py-0">
        <div className="flex items-baseline gap-1.5">
          <OdometerNumber value={value} started={started} />
          <span className="text-sm font-medium text-envrt-muted sm:text-base">
            {unit}
          </span>
        </div>
        <span className="mt-1.5 text-xs font-medium uppercase tracking-wider text-envrt-muted/70">
          {label}
        </span>
      </div>
      {showDivider && (
        <hr className="mx-auto w-12 border-envrt-charcoal/[0.06] sm:hidden" />
      )}
    </>
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

  // Poll for updated stats with backoff on consecutive failures
  useEffect(() => {
    let errorCount = 0;
    const poll = async () => {
      try {
        const res = await fetch("/api/impact-stats");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ImpactStats = await res.json();
        setCo2(data.co2Kg);
        setWater(data.waterLitres);
        setScans(data.dppScans);
        errorCount = 0; // reset on success
      } catch {
        errorCount++;
        if (errorCount >= IMPACT_MAX_CONSECUTIVE_ERRORS) {
          clearInterval(interval);
        }
      }
    };
    const interval = setInterval(poll, IMPACT_POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  if (initialStats.co2Kg === 0 && initialStats.waterLitres === 0 && initialStats.dppScans === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-12 sm:py-16">
      <Container>
        <FadeUp>
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-envrt-muted/70">
            Platform impact
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
            <StatColumn
              value={co2}
              unit="kg"
              label="CO₂e impact explored"
              started={visible}
              showDivider
            />
            <StatColumn
              value={water}
              unit="L"
              label="Water impact explored"
              started={visible}
              showDivider
            />
            <StatColumn
              value={scans}
              unit=""
              label="DPP scans worldwide"
              started={visible}
            />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="pointer-events-none absolute inline-flex h-full w-full animate-ping rounded-full bg-envrt-teal opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-envrt-teal" />
            </span>
            <span className="text-[11px] text-envrt-muted/70">
              Live platform data
            </span>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}

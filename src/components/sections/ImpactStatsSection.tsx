"use client";

import { useEffect, useRef, useState } from "react";
import type { ImpactStats } from "@/lib/impact-stats";
import { REFERENCES_PER_LCA } from "@/lib/impact-stats";
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
  const targetY = started ? `-${digit * 10}%` : "0%";

  return (
    <span
      className="odometer-slot relative mx-[1px] inline-flex h-[1.4em] w-[0.7em] overflow-hidden rounded bg-envrt-charcoal/[0.04]"
    >
      <span className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px bg-envrt-charcoal/[0.06]" />

      <span
        className="odometer-strip flex flex-col items-center"
        style={{
          height: "1000%",
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

function OdometerSeparator({
  char,
  started,
  delay,
}: {
  char: string;
  started: boolean;
  delay: number;
}) {
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

  const digitCount = chars.filter((c) => /\d/.test(c)).length;
  let digitIndex = 0;

  return (
    <span className="inline-flex items-center text-3xl font-bold tabular-nums text-envrt-charcoal sm:text-4xl lg:text-5xl">
      {chars.map((char, i) => {
        if (/\d/.test(char)) {
          const posFromRight = digitCount - 1 - digitIndex;
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
        const delay = (digitCount - digitIndex) * 0.08;
        return (
          <OdometerSeparator
            key={`s-${i}`}
            char={char}
            started={started}
            delay={delay}
          />
        );
      })}
    </span>
  );
}

/* ── StatBlock — one stat in the strip ── */

function StatBlock({
  liveValue,
  staticValue,
  label,
  started,
}: {
  liveValue?: number;
  staticValue?: string;
  label: string;
  started: boolean;
}) {
  return (
    <div
      data-stat-block
      className="flex flex-col items-center text-center px-4 py-6 sm:px-6 sm:py-0"
    >
      {liveValue !== undefined ? (
        <OdometerNumber value={liveValue} started={started} />
      ) : (
        <span className="inline-flex items-center text-3xl font-bold tabular-nums text-envrt-charcoal sm:text-4xl lg:text-5xl">
          {staticValue}
        </span>
      )}
      <span
        data-stat-label
        className="mt-3 max-w-[220px] text-xs font-medium uppercase tracking-widest text-envrt-muted"
      >
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

  const [scans, setScans] = useState(initialStats.dppScans);

  useEffect(() => {
    let errorCount = 0;
    const poll = async () => {
      try {
        const res = await fetch("/api/impact-stats");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ImpactStats = await res.json();
        setScans(data.dppScans);
        errorCount = 0;
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

  const dataPointsServed = scans * REFERENCES_PER_LCA;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="impact-stats-heading"
      className="py-12 sm:py-16"
    >
      <Container>
        <FadeUp>
          <h2
            id="impact-stats-heading"
            className="text-center text-xs font-medium uppercase tracking-[0.2em] text-envrt-muted/70"
          >
            Platform impact
          </h2>

          <div
            data-impact-stats
            className="mt-10 grid grid-cols-1 divide-y divide-envrt-charcoal/[0.08] sm:mt-12 sm:grid-cols-3 sm:divide-y-0 sm:divide-x sm:divide-envrt-charcoal/[0.08]"
          >
            <StatBlock
              liveValue={dataPointsServed}
              label="Data points served via our DPPs"
              started={visible}
            />
            <StatBlock
              staticValue="75+"
              label="Network of apparel brands and partners"
              started={visible}
            />
            <StatBlock
              staticValue="27"
              label="EU markets aligned with our methodology"
              started={visible}
            />
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}

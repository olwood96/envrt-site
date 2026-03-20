"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ImpactData } from "@/lib/impact-tracker";
import { Container } from "../ui/Container";
import { SectionCard } from "../ui/SectionCard";
import { FadeUp, StaggerChildren, StaggerItem } from "../ui/Motion";
import { ScanMap } from "./ScanMap";

/* ── Intersection hook (same pattern as SupplyChainFlowSection) ── */

function useIntersectionOnce(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

/* ── Animated counter ── */

interface CounterProps {
  label: string;
  value: number;
  suffix?: string;
}

function ImpactCounter({ label, value, suffix }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useIntersectionOnce(ref);
  const [display, setDisplay] = useState(0);

  const animate = useCallback(() => {
    // Respect prefers-reduced-motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(value);
      return;
    }

    const duration = 2000;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [value]);

  useEffect(() => {
    if (visible && value > 0) animate();
  }, [visible, value, animate]);

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <p className="text-sm font-medium uppercase tracking-wider text-white/50">
        {label}
      </p>
      <p
        className="text-4xl font-bold tabular-nums text-envrt-teal sm:text-5xl lg:text-6xl"
        aria-label={`${value.toLocaleString()} ${suffix ?? ""}`}
      >
        {display.toLocaleString()}
        {suffix && (
          <span className="ml-2 text-xl font-medium text-white/40 sm:text-2xl">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

/* ── Section ── */

interface ImpactTrackerSectionProps {
  data: ImpactData;
}

export function ImpactTrackerSection({ data }: ImpactTrackerSectionProps) {
  const { totalCo2Kg, totalWaterL, totalScans, scansByCountry } = data;

  return (
    <div className="px-4 py-8 sm:px-6">
      <SectionCard dark className="mx-auto max-w-[1360px]">
        <Container className="py-16 sm:py-24">
          <FadeUp>
            <p className="text-sm font-medium uppercase tracking-wider text-envrt-teal">
              Platform impact
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Tracking real-world sustainability data.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/50">
              Aggregate environmental data tracked across all brands using the
              envrt platform — based on estimated production volumes.
            </p>
          </FadeUp>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            {/* Counters */}
            <StaggerChildren className="flex flex-col gap-10" staggerDelay={0.12}>
              <StaggerItem>
                <ImpactCounter
                  label="CO₂e tracked"
                  value={totalCo2Kg}
                  suffix="kg"
                />
              </StaggerItem>
              <StaggerItem>
                <ImpactCounter
                  label="Water tracked"
                  value={totalWaterL}
                  suffix="litres"
                />
              </StaggerItem>
              <StaggerItem>
                <ImpactCounter label="DPP scans" value={totalScans} />
              </StaggerItem>
            </StaggerChildren>

            {/* Map */}
            <FadeUp delay={0.2}>
              <ScanMap data={scansByCountry} />
            </FadeUp>
          </div>
        </Container>
      </SectionCard>
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Container } from "../ui/Container";
import { FadeUp } from "../ui/Motion";
import { DppWorldMap } from "./DppWorldMap";

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  if (h === 0) {
    const m = Math.floor(seconds / 60);
    return `over ${m} minutes`;
  }
  return `over ${h} hours`;
}

export function FinalCTASection() {
  const [stats, setStats] = useState<{
    totalDurationSeconds: number;
    countryCount: number;
  } | null>(null);

  const handleStatsLoaded = useCallback(
    (s: { totalDurationSeconds: number; countryCount: number }) => {
      setStats(s);
    },
    []
  );

  const caption =
    stats && stats.totalDurationSeconds > 0 && stats.countryCount > 0
      ? `${formatDuration(stats.totalDurationSeconds)} of consumer engagement across ${stats.countryCount} countries`
      : null;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--envrt-green) 0%, #0f2219 100%)",
      }}
    >
      {/* Map fills the right side on desktop, full width on mobile */}
      <div className="absolute inset-0 lg:left-[40%] overflow-hidden">
        <DppWorldMap onStatsLoaded={handleStatsLoaded} />
      </div>

      {/* Gradient fade from left so text has a clean backdrop */}
      <div
        className="absolute inset-y-0 left-0 w-full lg:w-[55%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, var(--envrt-green) 30%, transparent 100%)",
        }}
      />

      <Container className="relative z-10">
        <div className="flex min-h-[420px] flex-col justify-center py-16 sm:py-20 lg:max-w-[45%] lg:py-28">
          <FadeUp>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white">
              Ready to show the world your impact?
            </h2>
          </FadeUp>

          {/* Stats caption */}
          {caption && (
            <div className="mt-5 flex w-fit items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <p className="text-[11px] font-medium tracking-wide text-white/50 sm:text-xs">
                {caption}
              </p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/contact"
              data-cta="footer-cta-book-demo"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-medium text-envrt-green transition-all duration-300 hover:bg-envrt-cream shadow-sm hover:shadow-md sm:px-8 sm:py-4 sm:text-lg"
            >
              Book a demo
              <span className="ml-2">→</span>
            </Link>
            <Link
              href="/pricing"
              data-cta="footer-cta-view-pricing"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-base font-medium text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10 sm:px-8 sm:py-4 sm:text-lg"
            >
              View pricing
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Container } from "../ui/Container";
import { SectionCard } from "../ui/SectionCard";
import { FadeUp } from "../ui/Motion";
import { DppWorldMap } from "./DppWorldMap";

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m} minutes`;
  if (m === 0) return `${h} hours`;
  return `${h} hours ${m} minutes`;
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
    <div className="px-4 py-8 sm:px-6">
      <SectionCard dark className="mx-auto max-w-[1360px]">
        {/* Ambient map backdrop — pushed down so title has clear space above */}
        <div className="absolute inset-0 top-16 sm:top-20 overflow-hidden">
          <DppWorldMap onStatsLoaded={handleStatsLoaded} />
        </div>

        {/* Title above map, buttons below */}
        <Container className="relative z-10 flex min-h-[380px] flex-col items-center py-10 sm:min-h-[480px] sm:py-14">
          <FadeUp>
            <h2 className="text-2xl font-bold tracking-tight sm:text-4xl sm:whitespace-nowrap lg:text-5xl text-white text-center">
              Ready to show the world your impact?
            </h2>
          </FadeUp>

          {/* Stats caption */}
          {caption && (
            <p className="mt-4 text-xs tracking-wide text-white/40 sm:text-sm">
              {caption}
            </p>
          )}

          <div className="mt-auto pt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 sm:pt-10">
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
        </Container>
      </SectionCard>
    </div>
  );
}

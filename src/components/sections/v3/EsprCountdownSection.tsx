"use client";

import { useEffect, useState } from "react";
import { FadeUp } from "@/components/ui/Motion";

// ESPR textile DPP target. Update when the delegated act lands.
const ESPR_TARGET_ISO = "2027-01-01T00:00:00Z";

function daysUntil(targetIso: string): number {
  const now = new Date();
  const target = new Date(targetIso);
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export function EsprCountdownSection() {
  // null until client mount so SSR/CSR markup matches.
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    setDays(daysUntil(ESPR_TARGET_ISO));
  }, []);

  return (
    <section className="bg-envrt-stone py-12 sm:py-16">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <div className="relative overflow-hidden rounded-3xl border border-envrt-brand-black/8 border-l-[3px] border-l-envrt-brand-crimson bg-white p-6 sm:p-8 lg:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 top-1/2 h-[280px] w-[280px] -translate-y-1/2 rounded-full bg-envrt-brand-crimson/[0.08] blur-3xl"
            />

            <div className="relative grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto] sm:gap-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-crimson sm:text-[11px]">
                  ESPR · Textile DPP
                </p>
                <h3 className="mt-3 font-display text-xl font-medium leading-tight tracking-[-0.01em] text-envrt-brand-black sm:text-2xl lg:text-[1.65rem]">
                  Mandatory passports phase in from 2027.
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-envrt-brand-black/70 sm:text-base">
                  Data infrastructure, supplier onboarding and system
                  integration usually take more than a year. Starting now
                  avoids the scramble.
                </p>
                <a
                  href="/dpp-timeline"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-envrt-brand-crimson underline-offset-4 hover:underline sm:text-sm"
                >
                  See the full timeline
                  <span>→</span>
                </a>
              </div>

              {/* Right: live countdown */}
              <div className="flex flex-col items-start sm:items-end">
                <p
                  aria-live="polite"
                  className="font-display text-5xl font-semibold leading-none tracking-[-0.03em] text-envrt-brand-crimson tabular-nums sm:text-6xl lg:text-7xl"
                >
                  {days === null ? "n/a" : days.toLocaleString()}
                </p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[11px]">
                  Days until 2027-01-01
                </p>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

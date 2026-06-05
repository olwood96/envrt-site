"use client";

import { useEffect, useState } from "react";
import { FadeUp } from "@/components/ui/Motion";

// ESPR textile DPP enforcement target. The delegated act for textiles is
// expected to land mid-2026, with mandatory DPPs phasing in from early 2027.
// Using 2027-01-01 as a defensible visual anchor — when the actual date is
// firmed up, swap this constant.
const ESPR_TARGET_ISO = "2027-01-01T00:00:00Z";

function daysUntil(targetIso: string): number {
  const now = new Date();
  const target = new Date(targetIso);
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export function EsprCountdownSection() {
  // Render 0 on the server to avoid a hydration mismatch, then swap to the
  // live count on the client.
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    setDays(daysUntil(ESPR_TARGET_ISO));
  }, []);

  return (
    <section className="bg-envrt-stone py-12 sm:py-16">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <div className="relative overflow-hidden rounded-3xl border border-envrt-ink/8 bg-white p-6 sm:p-8 lg:p-10">
            {/* Soft aqua wash on the right */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 top-1/2 h-[280px] w-[280px] -translate-y-1/2 rounded-full bg-envrt-aqua/[0.12] blur-3xl"
            />

            <div className="relative grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto] sm:gap-8">
              {/* Left: label + heading + body */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-aqua sm:text-[11px]">
                  ESPR · Textile DPP
                </p>
                <h3 className="mt-3 font-manrope text-xl font-semibold leading-tight tracking-[-0.01em] text-envrt-ink sm:text-2xl lg:text-[1.65rem]">
                  Mandatory passports phase in from 2027.
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-envrt-charcoal/70 sm:text-base">
                  Data infrastructure, supplier onboarding and system
                  integration usually take more than a year. Starting now
                  avoids the scramble.
                </p>
                <a
                  href="/dpp-timeline"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-envrt-ink underline-offset-4 hover:text-envrt-aqua hover:underline sm:text-sm"
                >
                  See the full timeline
                  <span>→</span>
                </a>
              </div>

              {/* Right: live countdown */}
              <div className="flex flex-col items-start sm:items-end">
                <p
                  aria-live="polite"
                  className="font-manrope text-5xl font-semibold leading-none tracking-[-0.03em] text-envrt-ink tabular-nums sm:text-6xl lg:text-7xl"
                >
                  {days === null ? "—" : days.toLocaleString()}
                </p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-charcoal/55 sm:text-[11px]">
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

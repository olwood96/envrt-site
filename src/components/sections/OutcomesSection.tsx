"use client";

import { Container } from "../ui/Container";
import { FadeUp, StaggerChildren, StaggerItem } from "../ui/Motion";
import { outcomeCards } from "@/lib/config";

/* ── SVG Icons ─────────────────────────────────────────────────────────── */

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 006 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

const cardIcons = [ShieldCheckIcon, RocketIcon, BarChartIcon, LightbulbIcon];

/* ── Section ───────────────────────────────────────────────────────────── */

export function OutcomesSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24" id="outcomes">
      <Container>
        <FadeUp>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
              The outcome
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
              From compliance headache to competitive advantage.
            </h2>
          </div>
        </FadeUp>

        <StaggerChildren className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {outcomeCards.map((card, i) => {
            const Icon = cardIcons[i];
            return (
              <StaggerItem key={card.title}>
                <div className="group rounded-2xl border border-envrt-charcoal/5 bg-white p-6 transition-all duration-300 hover:border-envrt-teal/20 hover:shadow-lg hover:shadow-envrt-teal/5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-envrt-teal/[0.07] transition-colors group-hover:bg-envrt-teal/[0.12]">
                    <Icon className="h-5 w-5 text-envrt-teal" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-envrt-charcoal">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-envrt-muted">
                    {card.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </Container>
    </section>
  );
}

"use client";

import { Container } from "../ui/Container";
import { FadeUp, StaggerChildren, StaggerItem } from "../ui/Motion";
import { whyNowCards } from "@/lib/config";

/* ── SVG Icons ─────────────────────────────────────────────────────────── */

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ChartBarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  );
}

const cardIcons = [ClipboardIcon, GlobeIcon, BoltIcon, ChartBarIcon];

/* ── Section ───────────────────────────────────────────────────────────── */

export function WhyNowSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24" id="why-now">
      <Container>
        <FadeUp>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
              The world is changing. Are your products keeping up?
            </h2>
            <p className="mt-4 text-base text-envrt-muted sm:text-lg">
              Fashion brands face new expectations from regulators, retailers and
              consumers. Here&apos;s why acting now matters.
            </p>
          </div>
        </FadeUp>

        <StaggerChildren className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyNowCards.map((card, i) => {
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

"use client";

import { Container } from "../../ui/Container";
import { FadeUp, StaggerChildren, StaggerItem } from "../../ui/Motion";

type Step = {
  id: number;
  title: string;
  body: string;
  Illustration: React.ComponentType<{ className?: string }>;
};

function SpreadsheetIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="18" width="68" height="60" rx="6" />
      <path d="M14 34h68" />
      <path d="M36 18v60" />
      <path d="M58 18v60" />
      <path d="M14 50h68" />
      <path d="M14 64h68" />
      <circle cx="25" cy="42" r="1.5" fill="currentColor" />
      <circle cx="47" cy="42" r="1.5" fill="currentColor" />
      <circle cx="69" cy="42" r="1.5" fill="currentColor" />
    </svg>
  );
}

function GaugeIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 64a30 30 0 0 1 60 0" />
      <path d="M48 64L66 36" />
      <circle cx="48" cy="64" r="3" fill="currentColor" />
      <path d="M26 64v6" />
      <path d="M70 64v6" />
      <path d="M48 28v6" />
    </svg>
  );
}

function TagPhoneIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="48" y="20" width="34" height="56" rx="5" />
      <path d="M56 32h18v18H56z" />
      <path d="M58 34h2v2h-2zM72 34h2v2h-2zM58 48h2v2h-2zM72 48h2v2h-2z" fill="currentColor" />
      <path d="M14 30l24-8 6 14-24 8z" />
      <circle cx="22" cy="30" r="2" fill="currentColor" />
    </svg>
  );
}

const steps: Step[] = [
  {
    id: 1,
    title: "Add your garments",
    body: "You give us your collection data. We do the supply chain legwork.",
    Illustration: SpreadsheetIllustration,
  },
  {
    id: 2,
    title: "We calculate the impact",
    body: "Full LCA per garment, regulation-aligned, ready in hours.",
    Illustration: GaugeIllustration,
  },
  {
    id: 3,
    title: "Customers scan and see it",
    body: "A QR on every tag opens a live Digital Product Passport.",
    Illustration: TagPhoneIllustration,
  },
];

export function HowItWorksV2() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24" id="how-it-works">
      <Container>
        <FadeUp>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
              Three steps from spreadsheet to live DPP.
            </h2>
          </div>
        </FadeUp>

        <StaggerChildren className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {steps.map((step) => (
            <StaggerItem key={step.id}>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-envrt-teal/[0.07]">
                  <step.Illustration className="h-12 w-12 text-envrt-teal" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-envrt-muted/70">
                  Step {step.id}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-envrt-charcoal">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-envrt-muted">
                  {step.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}

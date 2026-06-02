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
    <svg className={className} viewBox="0 0 120 100" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <rect x="18" y="18" width="84" height="68" rx="4" />
      <path d="M18 36h84" />
      <path d="M42 18v68" />
      <path d="M66 18v68" />
      <path d="M90 18v68" />
      <path d="M18 54h84" />
      <path d="M18 72h84" />
      <circle cx="30" cy="45" r="1.5" fill="currentColor" />
      <circle cx="54" cy="45" r="1.5" fill="currentColor" />
      <circle cx="78" cy="45" r="1.5" fill="currentColor" />
      <circle cx="30" cy="63" r="1.5" fill="currentColor" />
      <circle cx="54" cy="63" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CalculationIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 100" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 76a40 40 0 0 1 80 0" />
      <path d="M60 76L82 38" />
      <circle cx="60" cy="76" r="3" fill="currentColor" />
      <path d="M28 76v6" />
      <path d="M92 76v6" />
      <path d="M60 30v6" />
      <path d="M36 50l4 4" />
      <path d="M80 50l4-4" />
    </svg>
  );
}

function ScanIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 100" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <rect x="60" y="20" width="40" height="60" rx="5" />
      <rect x="70" y="32" width="20" height="20" rx="1" />
      <path d="M73 35h2v2h-2zM87 35h2v2h-2zM73 49h2v2h-2zM87 49h2v2h-2z" fill="currentColor" />
      <path d="M72 60h16M72 66h10" />
      <path d="M18 36l28-10 6 16-28 10z" />
      <circle cx="28" cy="36" r="2" fill="currentColor" />
      <path d="M50 50l8 4" strokeDasharray="2 2" />
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
    Illustration: CalculationIllustration,
  },
  {
    id: 3,
    title: "Customers scan and see it",
    body: "A QR on every tag opens a live Digital Product Passport.",
    Illustration: ScanIllustration,
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

        <StaggerChildren className="relative mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8">
          {/* Connector line behind the steps on desktop, sitting at illustration midline */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-[40px] hidden h-px sm:block"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(42,161,152,0.35) 0 4px, transparent 4px 9px)",
            }}
          />
          {steps.map((step) => (
            <StaggerItem key={step.id}>
              <div className="relative flex flex-col items-center text-center">
                {/* Illustration with a small backing circle to mask the dashed connector */}
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-envrt-offwhite">
                  <step.Illustration className="h-16 w-auto text-envrt-teal" />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-envrt-muted/70">
                  Step {String(step.id).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-envrt-charcoal">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-envrt-muted">
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

"use client";

import { Container } from "../../ui/Container";
import { FadeUp, StaggerChildren, StaggerItem } from "../../ui/Motion";

type Deliverable = {
  id: number;
  title: string;
  body: string;
  Icon: React.ComponentType<{ className?: string }>;
};

function PassportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M9 7h6" />
      <circle cx="12" cy="13" r="2.5" />
      <path d="M9.5 17h5" />
    </svg>
  );
}

function QrIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h2v2h-2zM18 14h3M14 18h2v3M19 17v4" />
    </svg>
  );
}

function MetricsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V10" />
      <path d="M10 20V6" />
      <path d="M16 20v-8" />
      <path d="M22 20v-4" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
      <path d="M8 13h8M8 17h6" />
    </svg>
  );
}

const deliverables: Deliverable[] = [
  {
    id: 1,
    title: "Digital Product Passport per garment",
    body: "A live, scannable page for every SKU in your collection.",
    Icon: PassportIcon,
  },
  {
    id: 2,
    title: "QR codes for tags and packaging",
    body: "Print-ready codes that link straight to each passport.",
    Icon: QrIcon,
  },
  {
    id: 3,
    title: "Full impact data",
    body: "Stage-by-stage emissions, water scarcity and Eco-Score for every product.",
    Icon: MetricsIcon,
  },
  {
    id: 4,
    title: "EU-aligned methodology",
    body: "PEF, ISO 14040 and AWARE referenced throughout, so your numbers hold up.",
    Icon: DocumentIcon,
  },
];

export function WhatYouGetSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24" id="what-you-get">
      <Container>
        <FadeUp>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
              What you get
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
              Everything you need to ship a DPP on day one.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-envrt-muted sm:text-lg">
              No consultants, no extra hires. Just the deliverables a fashion brand needs to publish regulation-ready Digital Product Passports.
            </p>
          </div>
        </FadeUp>

        {/* Strip layout: no cards, no borders. Hairline dividers separate items. */}
        <StaggerChildren className="mt-14 grid divide-y divide-envrt-charcoal/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {deliverables.map((d, i) => (
            <StaggerItem
              key={d.id}
              className={[
                "py-8 sm:py-0 sm:px-6 lg:px-8",
                // Vertical dividers between columns on sm+ (skip first)
                i > 0 ? "sm:border-l sm:border-envrt-charcoal/10" : "",
                // Reset the left border at the second row break on sm (2-col)
                "sm:[&:nth-child(2n+1)]:border-l-0 lg:[&:nth-child(2n+1)]:border-l",
                // On lg (4-col) the first column has no left border
                "lg:[&:first-child]:border-l-0",
              ].join(" ")}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold leading-none tracking-tight text-envrt-teal">
                    {String(d.id).padStart(2, "0")}
                  </span>
                  <d.Icon className="h-5 w-5 text-envrt-charcoal/40" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-envrt-charcoal">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-envrt-muted">{d.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}

"use client";

import { Container } from "../../ui/Container";
import { FadeUp, StaggerChildren, StaggerItem } from "../../ui/Motion";

type Deliverable = {
  title: string;
  body: string;
  Icon: React.ComponentType<{ className?: string }>;
};

function PassportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M9 7h6" />
      <circle cx="12" cy="13" r="2.5" />
      <path d="M9.5 17h5" />
    </svg>
  );
}

function QrIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h2v2h-2zM18 14h3M14 18h2v3M19 17v4" />
    </svg>
  );
}

function MetricsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20V10" />
      <path d="M10 20V6" />
      <path d="M16 20v-8" />
      <path d="M22 20v-4" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
      <circle cx="12" cy="15" r="2.5" />
      <path d="M9.5 15h-1M14.5 15h1M12 12.5v-1M12 17.5v1" />
    </svg>
  );
}

const deliverables: Deliverable[] = [
  {
    title: "Digital Product Passport per garment",
    body: "A live, scannable page for every SKU in your collection.",
    Icon: PassportIcon,
  },
  {
    title: "QR codes for tags and packaging",
    body: "Print-ready codes that link straight to each passport.",
    Icon: QrIcon,
  },
  {
    title: "Full impact data",
    body: "Stage-by-stage emissions, water scarcity and Eco-Score for every product.",
    Icon: MetricsIcon,
  },
  {
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

        <StaggerChildren className="mt-14 grid gap-5 sm:grid-cols-2">
          {deliverables.map((d) => (
            <StaggerItem key={d.title}>
              <div className="group flex h-full gap-5 rounded-2xl border border-envrt-charcoal/5 bg-white p-6 transition-all duration-300 hover:border-envrt-teal/20 hover:shadow-lg hover:shadow-envrt-teal/5 sm:p-8">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-envrt-teal/[0.07] transition-colors group-hover:bg-envrt-teal/[0.12]">
                  <d.Icon className="h-6 w-6 text-envrt-teal" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-envrt-charcoal">{d.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-envrt-muted">{d.body}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}

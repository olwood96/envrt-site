"use client";

import { Container } from "../../ui/Container";
import { FadeUp } from "../../ui/Motion";
import { siteConfig } from "@/lib/config";

type Callout = {
  id: number;
  label: string;
  body: string;
  // Position of the dot on the visual (percentages relative to frame).
  // Used on lg+ where callouts are pinned around the visual.
  desktopAnchor: { top: string; left: string };
  // Which side the label sits on (left/right of frame) for desktop layout.
  side: "left" | "right";
};

const callouts: Callout[] = [
  {
    id: 1,
    label: "Scanned from the tag",
    body: "What a customer sees when they scan the QR on the garment label.",
    desktopAnchor: { top: "8%", left: "50%" },
    side: "left",
  },
  {
    id: 2,
    label: "Headline impact",
    body: "CO₂e and water scarcity per garment, calculated using peer-reviewed methods.",
    desktopAnchor: { top: "32%", left: "50%" },
    side: "right",
  },
  {
    id: 3,
    label: "Full supply chain",
    body: "Every stage from fibre to finished garment, mapped and traceable.",
    desktopAnchor: { top: "60%", left: "50%" },
    side: "left",
  },
  {
    id: 4,
    label: "French Eco-Score",
    body: "Regulation-recognised environmental class, calculated to the published methodology.",
    desktopAnchor: { top: "84%", left: "50%" },
    side: "right",
  },
];

export function DppAnatomySection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24" id="what-is-a-dpp">
      <Container>
        <FadeUp>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
              The product
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
              What&apos;s in a Digital Product Passport.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-envrt-muted sm:text-lg">
              Every garment gets a scannable page with regulation-ready impact data, supply chain transparency and your brand&apos;s own story.
            </p>
          </div>
        </FadeUp>

        {/* Desktop: pinned callouts around the visual. Mobile: visual + numbered list below. */}
        <FadeUp delay={0.1}>
          <div className="relative mt-12 sm:mt-16">
            <div className="relative mx-auto grid w-full max-w-[1100px] grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
              {/* Left column: callouts 1 + 3 on desktop */}
              <div className="hidden lg:flex lg:flex-col lg:gap-12 lg:pt-12">
                {callouts.filter((c) => c.side === "left").map((c) => (
                  <DesktopCallout key={c.id} callout={c} align="right" />
                ))}
              </div>

              {/* Visual */}
              <DppVisualFrame src={siteConfig.dppDemoEmbedUrl} />

              {/* Right column: callouts 2 + 4 on desktop */}
              <div className="hidden lg:flex lg:flex-col lg:gap-12 lg:pt-24">
                {callouts.filter((c) => c.side === "right").map((c) => (
                  <DesktopCallout key={c.id} callout={c} align="left" />
                ))}
              </div>
            </div>

            {/* Mobile callouts: numbered list below visual */}
            <ol className="mx-auto mt-10 grid max-w-md gap-5 lg:hidden">
              {callouts.map((c, i) => (
                <FadeUp key={c.id} delay={0.05 * (i + 1)}>
                  <li className="flex gap-4">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-envrt-teal/[0.12] text-xs font-semibold text-envrt-teal">
                      {c.id}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-envrt-charcoal">{c.label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-envrt-muted">{c.body}</p>
                    </div>
                  </li>
                </FadeUp>
              ))}
            </ol>
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="mt-12 text-center sm:mt-14">
            <a
              href={siteConfig.dppDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-envrt-teal transition-colors hover:text-envrt-green"
            >
              Open a live example
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}

function DesktopCallout({ callout, align }: { callout: Callout; align: "left" | "right" }) {
  return (
    <FadeUp delay={0.1 * callout.id}>
      <div className={`flex items-start gap-3 ${align === "right" ? "flex-row-reverse text-right" : "text-left"}`}>
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-envrt-teal/[0.12] text-xs font-semibold text-envrt-teal">
          {callout.id}
        </span>
        <div>
          <p className="text-sm font-semibold text-envrt-charcoal">{callout.label}</p>
          <p className="mt-1 text-sm leading-relaxed text-envrt-muted">{callout.body}</p>
        </div>
      </div>
    </FadeUp>
  );
}

function DppVisualFrame({ src }: { src: string }) {
  // v1 visual: live DPP rendered in a tall frame, interaction disabled so it
  // acts as a static preview. Swap to a captured screenshot once Playwright
  // is wired (`public/screenshots/dpp/hoodie-passport.png`).
  return (
    <div className="relative mx-auto w-full max-w-[320px] lg:max-w-[360px]">
      <div className="relative overflow-hidden rounded-[2rem] border border-envrt-charcoal/10 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "9 / 16" }}>
          <iframe
            src={src}
            title="What's in a Digital Product Passport"
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
          {/* Soft fade at the bottom suggesting more content below the fold */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/60 to-transparent" />
        </div>
      </div>
    </div>
  );
}

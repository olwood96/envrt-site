"use client";

import { Container } from "../../ui/Container";
import { FadeUp } from "../../ui/Motion";
import { siteConfig } from "@/lib/config";

type Callout = {
  id: number;
  label: string;
  body: string;
  side: "left" | "right";
  // Vertical position of the callout block within the 640px stage (0–100).
  calloutY: number;
  // Vertical position of the connector anchor on the visual (0–100 of stage).
  visualY: number;
};

const callouts: Callout[] = [
  {
    id: 1,
    label: "Scanned from the tag",
    body: "What a customer sees when they scan the QR on the garment label.",
    side: "left",
    calloutY: 8,
    visualY: 6,
  },
  {
    id: 2,
    label: "Headline impact",
    body: "CO₂e and water scarcity per garment, calculated using peer-reviewed methods.",
    side: "right",
    calloutY: 30,
    visualY: 26,
  },
  {
    id: 3,
    label: "Full supply chain",
    body: "Every stage from fibre to finished garment, mapped and traceable.",
    side: "left",
    calloutY: 55,
    visualY: 50,
  },
  {
    id: 4,
    label: "French Eco-Score",
    body: "Regulation-recognised environmental class, calculated to the published methodology.",
    side: "right",
    calloutY: 82,
    visualY: 75,
  },
];

// Stage geometry (desktop). The DPP visual sits centred with these edges
// expressed as percentages of stage width — used to anchor connector lines.
const VISUAL_LEFT_EDGE_PCT = 38;
const VISUAL_RIGHT_EDGE_PCT = 62;
const CALLOUT_DOT_X_LEFT = 32;
const CALLOUT_DOT_X_RIGHT = 68;

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

        {/* Desktop: annotated stage with connector lines */}
        <FadeUp delay={0.1}>
          <div className="relative mx-auto mt-16 hidden h-[640px] w-full max-w-[1100px] lg:block">
            {/* Connector overlay (drawn behind callouts so dots and text sit on top) */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {callouts.map((c) => {
                const startX = c.side === "left" ? CALLOUT_DOT_X_LEFT : CALLOUT_DOT_X_RIGHT;
                const endX = c.side === "left" ? VISUAL_LEFT_EDGE_PCT : VISUAL_RIGHT_EDGE_PCT;
                return (
                  <g key={c.id}>
                    <line
                      x1={startX}
                      y1={c.calloutY}
                      x2={endX}
                      y2={c.visualY}
                      stroke="rgba(42, 161, 152, 0.45)"
                      strokeWidth={0.15}
                      strokeDasharray="0.5 0.5"
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle
                      cx={endX}
                      cy={c.visualY}
                      r={0.4}
                      fill="rgb(42, 161, 152)"
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle
                      cx={startX}
                      cy={c.calloutY}
                      r={0.4}
                      fill="rgb(42, 161, 152)"
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Callouts positioned absolutely */}
            {callouts.map((c) => (
              <div
                key={c.id}
                className={`absolute w-[26%] ${c.side === "left" ? "text-right" : "text-left"}`}
                style={{
                  top: `${c.calloutY}%`,
                  [c.side === "left" ? "left" : "right"]: "3%",
                  transform: "translateY(-50%)",
                }}
              >
                <CalloutBlock callout={c} />
              </div>
            ))}

            {/* DPP visual, centred */}
            <div className="absolute left-1/2 top-0 w-[300px] -translate-x-1/2">
              <DppVisualFrame src={siteConfig.dppDemoEmbedUrl} />
            </div>
          </div>
        </FadeUp>

        {/* Mobile: visual then numbered list */}
        <div className="lg:hidden">
          <FadeUp delay={0.1}>
            <div className="mx-auto mt-12 w-full max-w-[300px]">
              <DppVisualFrame src={siteConfig.dppDemoEmbedUrl} />
            </div>
          </FadeUp>
          <ol className="mx-auto mt-12 grid max-w-md gap-7">
            {callouts.map((c, i) => (
              <FadeUp key={c.id} delay={0.05 * (i + 1)}>
                <li className="flex gap-5">
                  <span className="text-2xl font-bold leading-none text-envrt-teal">
                    {String(c.id).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-envrt-charcoal">{c.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-envrt-muted">{c.body}</p>
                  </div>
                </li>
              </FadeUp>
            ))}
          </ol>
        </div>

        <FadeUp delay={0.2}>
          <div className="mt-14 text-center sm:mt-16">
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

function CalloutBlock({ callout }: { callout: Callout }) {
  return (
    <div>
      <p className="text-3xl font-bold leading-none tracking-tight text-envrt-teal sm:text-4xl">
        {String(callout.id).padStart(2, "0")}
      </p>
      <p className="mt-3 text-sm font-semibold text-envrt-charcoal">{callout.label}</p>
      <p className="mt-1 text-sm leading-relaxed text-envrt-muted">{callout.body}</p>
    </div>
  );
}

function DppVisualFrame({ src }: { src: string }) {
  // v1 visual: live DPP rendered with pointer-events off so it acts as a
  // static preview. Swap to a captured screenshot when Playwright is wired.
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-envrt-charcoal/10 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "9 / 16" }}>
        <iframe
          src={src}
          title="What's in a Digital Product Passport"
          loading="lazy"
          className="pointer-events-none absolute inset-0 h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/70 to-transparent" />
      </div>
    </div>
  );
}

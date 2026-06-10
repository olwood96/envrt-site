import type { ReactNode } from "react";
import { FadeUp } from "@/components/ui/Motion";
import {
  DotGridBackground,
  Eyebrow,
  SectionCorners,
  type EyebrowTone,
} from "@/components/sections/v3/_shared";

// Standard v3 page hero. Eyebrow + display heading + body + optional
// action row. Used as the top of every dedicated page.
//
// tone: per-area colour scheme so each navbar group has a distinct
// signature. The body of each page stays in vista + ultramarine; only
// the hero band changes.
//   default  vista bg, ultramarine eyebrow, black ink           (Product, Pricing, Contact)
//   neon     black bg, neon-yellow eyebrow, white ink           (Collective)
//   sunny    vista bg, sunny-yellow eyebrow, black ink          (Resources)
//   lilac    vista bg, lilac eyebrow, black ink                 (Company)

export type PageHeroTone = "default" | "neon" | "sunny" | "lilac";

type Tokens = {
  section: string;
  heading: string;
  headingSpan: string;
  body: string;
  dotTone: "ink" | "lilac";
  dotOpacity: number;
  eyebrowTone: EyebrowTone;
};

const TOKENS: Record<PageHeroTone, Tokens> = {
  default: {
    section: "bg-envrt-brand-vista",
    heading: "text-envrt-brand-black",
    headingSpan: "text-envrt-brand-black/40",
    body: "text-envrt-brand-black/70",
    dotTone: "ink",
    dotOpacity: 0.04,
    eyebrowTone: "default",
  },
  neon: {
    section: "bg-envrt-brand-black",
    heading: "text-white",
    headingSpan: "text-white/45",
    body: "text-white/75",
    dotTone: "lilac",
    dotOpacity: 0.07,
    eyebrowTone: "neon",
  },
  sunny: {
    section: "bg-envrt-brand-vista",
    heading: "text-envrt-brand-black",
    headingSpan: "text-envrt-brand-black/40",
    body: "text-envrt-brand-black/70",
    dotTone: "ink",
    dotOpacity: 0.04,
    eyebrowTone: "sunny",
  },
  lilac: {
    section: "bg-envrt-brand-vista",
    heading: "text-envrt-brand-black",
    headingSpan: "text-envrt-brand-black/40",
    body: "text-envrt-brand-black/70",
    dotTone: "ink",
    dotOpacity: 0.04,
    eyebrowTone: "lilac",
  },
};

export function PageHero({
  eyebrow,
  heading,
  body,
  actions,
  cornerLeft = "ENVRT/01",
  cornerRight,
  children,
  tone = "default",
}: {
  eyebrow: string;
  heading: ReactNode;
  body?: ReactNode;
  actions?: ReactNode;
  cornerLeft?: string;
  cornerRight?: string;
  children?: ReactNode;
  tone?: PageHeroTone;
}) {
  const t = TOKENS[tone];

  return (
    <section
      className={`relative overflow-hidden py-20 sm:py-28 lg:py-32 ${t.section}`}
      data-hero-tone={tone}
    >
      <DotGridBackground opacity={t.dotOpacity} size={22} tone={t.dotTone} />
      {cornerRight && (
        <SectionCorners
          left={cornerLeft}
          right={cornerRight}
          tone={tone === "neon" ? "dark" : "light"}
        />
      )}

      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        <div className="max-w-3xl">
          <FadeUp>
            <Eyebrow tone={t.eyebrowTone}>{eyebrow}</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1
              className={`mt-5 font-display text-[2.25rem] font-medium leading-[1.04] tracking-[-0.025em] sm:text-5xl lg:text-[3.5rem] ${t.heading}`}
            >
              {heading}
            </h1>
          </FadeUp>
          {body && (
            <FadeUp delay={0.16}>
              <p
                className={`mt-5 max-w-2xl text-base leading-relaxed sm:text-lg ${t.body}`}
              >
                {body}
              </p>
            </FadeUp>
          )}
          {actions && (
            <FadeUp delay={0.24}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                {actions}
              </div>
            </FadeUp>
          )}
        </div>

        {children && (
          <FadeUp delay={0.32}>
            <div className="mt-14 sm:mt-16">{children}</div>
          </FadeUp>
        )}
      </div>
    </section>
  );
}

// Expose a helper so pages with custom hero JSX (not the PageHero
// component itself) can still pick up the same heading-span tinting in
// their hero copy without hard-coding the colour.
export function headingSpanClass(tone: PageHeroTone): string {
  return TOKENS[tone].headingSpan;
}

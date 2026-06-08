import type { ReactNode } from "react";
import { FadeUp } from "@/components/ui/Motion";
import {
  DotGridBackground,
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";

// Standard v3 page hero. Eyebrow + display heading + body + optional
// action row. Used as the top of every dedicated page (/pricing,
// /platform, /free-dpp, /contact, etc.).

export function PageHero({
  eyebrow,
  heading,
  body,
  actions,
  cornerLeft = "ENVRT/01",
  cornerRight,
  children,
}: {
  eyebrow: string;
  heading: ReactNode;
  body?: ReactNode;
  actions?: ReactNode;
  cornerLeft?: string;
  cornerRight?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-envrt-brand-vista py-20 sm:py-28 lg:py-32">
      <DotGridBackground opacity={0.04} size={22} />
      {cornerRight && <SectionCorners left={cornerLeft} right={cornerRight} />}

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-16">
        <div className="max-w-3xl">
          <FadeUp>
            <Eyebrow>{eyebrow}</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="mt-5 font-display text-[2.25rem] font-medium leading-[1.04] tracking-[-0.025em] text-envrt-brand-black sm:text-5xl lg:text-[3.5rem]">
              {heading}
            </h1>
          </FadeUp>
          {body && (
            <FadeUp delay={0.16}>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg">
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

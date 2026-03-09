"use client";

import { Container } from "../ui/Container";
import { SectionCard } from "../ui/SectionCard";
import { Button } from "../ui/Button";
import { FadeUp } from "../ui/Motion";

export function ROICTASection() {
  return (
    <div className="px-4 py-8 sm:px-6">
      <SectionCard className="mx-auto max-w-[1360px]">
        <Container className="py-14 sm:py-20">
          <FadeUp>
            <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left lg:gap-16">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
                  ROI calculator
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-envrt-charcoal sm:text-3xl">
                  What does DPP compliance actually cost?
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-envrt-muted">
                  Compare ENVRT against hiring a consultant or building an in-house
                  sustainability team. Get your personalised savings estimate in under
                  3 minutes.
                </p>
              </div>
              <div className="flex flex-shrink-0 flex-col items-center gap-3">
                <Button href="/roi" variant="primary" className="whitespace-nowrap">
                  Calculate your ROI
                </Button>
                <p className="text-xs text-envrt-muted">Free. No signup required.</p>
              </div>
            </div>
          </FadeUp>
        </Container>
      </SectionCard>
    </div>
  );
}

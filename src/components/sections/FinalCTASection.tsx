"use client";

import Link from "next/link";
import { Container } from "../ui/Container";
import { SectionCard } from "../ui/SectionCard";
import { FadeUp } from "../ui/Motion";
import { DppWorldMap } from "./DppWorldMap";

export function FinalCTASection() {
  return (
    <div className="px-4 py-8 sm:px-6">
      <SectionCard dark className="mx-auto max-w-[1360px]">
        {/* Ambient map backdrop */}
        <div className="absolute inset-0 overflow-hidden">
          <DppWorldMap />
        </div>

        {/* Content on top */}
        <Container className="relative z-10 py-20 sm:py-28">
          <FadeUp>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white">
                Ready to show the world your impact?
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/60 sm:text-lg">
                Join the brands turning sustainability data into competitive advantage.
                Onboard in 30 minutes, then generate DPPs whenever you need them.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  data-cta="footer-cta-book-demo"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-medium text-envrt-green transition-all duration-300 hover:bg-envrt-cream shadow-sm hover:shadow-md"
                >
                  Book a demo
                  <span className="ml-2">→</span>
                </Link>
                <Link
                  href="/pricing"
                  data-cta="footer-cta-view-pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10"
                >
                  View pricing
                </Link>
              </div>
            </div>
          </FadeUp>
        </Container>
      </SectionCard>
    </div>
  );
}

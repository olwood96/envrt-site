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
        {/* Ambient map backdrop — shifted up so Europe isn't behind the title */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="-translate-y-12">
            <DppWorldMap />
          </div>
        </div>

        {/* Title pinned to top, buttons pinned to bottom, map fills the middle */}
        <Container className="relative z-10 flex min-h-[420px] flex-col items-center py-12 sm:py-16">
          <FadeUp>
            <h2 className="whitespace-nowrap text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white text-center">
              Ready to show the world your impact?
            </h2>
          </FadeUp>

          <div className="mt-auto pt-10 flex flex-wrap items-center justify-center gap-4">
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
        </Container>
      </SectionCard>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../ui/Container";
import { FadeUp } from "../ui/Motion";
import { PhoneFrame } from "../ui/PhoneFrame";
import { LaptopFrame } from "../ui/LaptopFrame";
import { DppWorldMap } from "./DppWorldMap";
import { DppCarouselCard } from "./DppCarouselCard";
import type { CollectiveCardData } from "@/lib/collective/types";

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  if (h === 0) {
    const m = Math.floor(seconds / 60);
    return `over ${m} minutes`;
  }
  return `over ${h} hours`;
}

/**
 * Reorder cards so consecutive entries come from different brands.
 * Round-robins through brands to maximise variety.
 */
function interleaveByBrand(cards: CollectiveCardData[]): CollectiveCardData[] {
  if (cards.length <= 1) return cards;

  const byBrand = new Map<string, CollectiveCardData[]>();
  for (const card of cards) {
    const key = card.brand.id;
    if (!byBrand.has(key)) byBrand.set(key, []);
    byBrand.get(key)!.push(card);
  }

  const queues = Array.from(byBrand.values());
  const result: CollectiveCardData[] = [];
  let idx = 0;

  while (result.length < cards.length) {
    const queue = queues[idx % queues.length];
    if (queue.length > 0) {
      result.push(queue.shift()!);
    }
    idx++;
    if (idx % queues.length === 0) {
      for (let i = queues.length - 1; i >= 0; i--) {
        if (queues[i].length === 0) queues.splice(i, 1);
      }
      if (queues.length === 0) break;
      idx = 0;
    }
  }

  return result;
}

interface FinalCTASectionProps {
  featuredCards: CollectiveCardData[];
}

export function FinalCTASection({ featuredCards }: FinalCTASectionProps) {
  // ── Stats from DppWorldMap ──
  const [stats, setStats] = useState<{
    totalDurationSeconds: number;
    countryCount: number;
  } | null>(null);

  const handleStatsLoaded = useCallback(
    (s: { totalDurationSeconds: number; countryCount: number }) => {
      setStats(s);
    },
    []
  );

  const caption =
    stats && stats.totalDurationSeconds > 0 && stats.countryCount > 0
      ? `${formatDuration(stats.totalDurationSeconds)} of consumer engagement across ${stats.countryCount} countries`
      : null;

  // ── Carousel: all DPPs, interleaved by brand ──
  const carouselCards = useMemo(
    () => interleaveByBrand(featuredCards),
    [featuredCards]
  );
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (carouselCards.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselCards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselCards.length]);

  const currentCard = carouselCards[activeSlide];

  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* ── Left: CTA text + buttons ── */}
          <div className="max-w-lg">
            <FadeUp>
              <h2 className="text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl lg:text-5xl">
                Ready to show the world your impact?
              </h2>
            </FadeUp>

            {caption && (
              <FadeUp delay={0.1}>
                <div className="mt-5 flex w-fit items-center gap-2.5 rounded-full border border-envrt-charcoal/8 bg-envrt-charcoal/[0.03] px-4 py-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-envrt-teal opacity-50" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-envrt-teal" />
                  </span>
                  <p className="text-[11px] font-medium tracking-wide text-envrt-muted sm:text-xs">
                    {caption}
                  </p>
                </div>
              </FadeUp>
            )}

            {/* Buttons: visible on desktop, hidden on mobile (shown below devices instead) */}
            <FadeUp delay={0.2}>
              <div className="mt-10 hidden flex-wrap items-center gap-3 sm:gap-4 lg:flex">
                <Link
                  href="/contact"
                  data-cta="footer-cta-book-demo"
                  className="inline-flex items-center justify-center rounded-xl bg-envrt-green px-6 py-3 text-base font-medium text-white transition-all duration-300 hover:bg-envrt-green/90 shadow-sm hover:shadow-md sm:px-8 sm:py-4 sm:text-lg"
                >
                  Book a demo
                  <span className="ml-2">→</span>
                </Link>
                <Link
                  href="/pricing"
                  data-cta="footer-cta-view-pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-envrt-charcoal/15 px-6 py-3 text-base font-medium text-envrt-charcoal transition-all duration-300 hover:border-envrt-charcoal/30 hover:bg-envrt-charcoal/[0.03] sm:px-8 sm:py-4 sm:text-lg"
                >
                  View pricing
                </Link>
              </div>
            </FadeUp>
          </div>

          {/* ── Right (desktop) / Middle (mobile): Device mockups ── */}
          <FadeUp delay={0.15}>
            <div className="relative mt-10 w-full max-w-xl mx-auto lg:mt-0 lg:mx-0">
              {/* Laptop */}
              <LaptopFrame>
                <DppWorldMap onStatsLoaded={handleStatsLoaded} />
              </LaptopFrame>

              {/* Phone — overlaps laptop upper-left */}
              {carouselCards.length > 0 && currentCard && (
                <div className="absolute -top-6 -left-2 z-10 w-[120px] sm:-top-8 sm:-left-4 sm:w-[140px] lg:-top-12 lg:-left-8 lg:w-[160px]">
                  <PhoneFrame>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSlide}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{
                          duration: 0.45,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                        className="h-full"
                      >
                        <DppCarouselCard
                          productImageUrl={currentCard.productImageUrl}
                          brandLogoUrl={currentCard.brandLogoUrl}
                          garmentName={currentCard.dpp.garment_name}
                          productSku={currentCard.dpp.product_sku}
                          totalEmissions={currentCard.dpp.total_emissions}
                          totalWater={currentCard.dpp.total_water}
                          totalEmissionsReductionPct={currentCard.dpp.total_emissions_reduction_pct}
                          totalWaterReductionPct={currentCard.dpp.total_water_reduction_pct}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </PhoneFrame>

                  {/* Slide indicators */}
                  {carouselCards.length > 1 && (
                    <div className="mt-2 flex justify-center gap-1">
                      {carouselCards.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveSlide(i)}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            i === activeSlide
                              ? "w-4 bg-envrt-teal"
                              : "w-1 bg-envrt-charcoal/15"
                          }`}
                          aria-label={`Show DPP ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </FadeUp>

          {/* ── Mobile-only buttons (below devices) ── */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:hidden">
            <Link
              href="/contact"
              data-cta="footer-cta-book-demo"
              className="inline-flex items-center justify-center rounded-xl bg-envrt-green px-6 py-3 text-base font-medium text-white transition-all duration-300 hover:bg-envrt-green/90 shadow-sm hover:shadow-md"
            >
              Book a demo
              <span className="ml-2">→</span>
            </Link>
            <Link
              href="/pricing"
              data-cta="footer-cta-view-pricing"
              className="inline-flex items-center justify-center rounded-xl border border-envrt-charcoal/15 px-6 py-3 text-base font-medium text-envrt-charcoal transition-all duration-300 hover:border-envrt-charcoal/30 hover:bg-envrt-charcoal/[0.03]"
            >
              View pricing
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../ui/Container";
import { FadeUp } from "../ui/Motion";
import { PhoneFrame } from "../ui/PhoneFrame";
import { LaptopFrame } from "../ui/LaptopFrame";
import { DppWorldMap, type ActiveCountry } from "./DppWorldMap";
import { DppCarouselCard } from "./DppCarouselCard";
import type { CollectiveCardData } from "@/lib/collective/types";

function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "\u{1F30D}";
  const base = 0x1f1e6;
  return (
    String.fromCodePoint(base + code.charCodeAt(0) - 65) +
    String.fromCodePoint(base + code.charCodeAt(1) - 65)
  );
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  if (h === 0) {
    const m = Math.floor(seconds / 60);
    return `over ${m} minutes`;
  }
  return `over ${h} hours`;
}

/**
 * Sort by newest first (featured_at desc), then interleave so consecutive
 * entries always come from different brands. Newest DPPs appear first,
 * never the same brand twice in a row.
 */
function interleaveByBrand(cards: CollectiveCardData[]): CollectiveCardData[] {
  if (cards.length <= 1) return cards;

  // Sort newest first
  const sorted = [...cards].sort((a, b) => {
    const aDate = a.dpp.featured_at ?? "";
    const bDate = b.dpp.featured_at ?? "";
    return bDate.localeCompare(aDate);
  });

  // Group by brand, preserving age order within each brand
  const byBrand = new Map<string, CollectiveCardData[]>();
  for (const card of sorted) {
    const key = card.brand.id;
    if (!byBrand.has(key)) byBrand.set(key, []);
    byBrand.get(key)!.push(card);
  }

  // Round-robin across brands
  const queues = Array.from(byBrand.values());
  const result: CollectiveCardData[] = [];

  while (queues.length > 0) {
    for (let i = queues.length - 1; i >= 0; i--) {
      if (queues[i].length > 0) {
        result.push(queues[i].shift()!);
      }
      if (queues[i].length === 0) {
        queues.splice(i, 1);
      }
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
  const [activeCountry, setActiveCountry] = useState<ActiveCountry | null>(null);

  const handleStatsLoaded = useCallback(
    (s: { totalDurationSeconds: number; countryCount: number }) => {
      setStats(s);
    },
    []
  );

  const handleCountryActive = useCallback(
    (c: ActiveCountry | null) => { setActiveCountry(c); },
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
          {/* ── Left (desktop) / Top (mobile): CTA text + stats ── */}
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

            {/* Buttons: desktop only (mobile buttons below devices) */}
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
                <DppWorldMap
                  onStatsLoaded={handleStatsLoaded}
                  onCountryActive={handleCountryActive}
                />
              </LaptopFrame>

              {/* Stat box — top-right of laptop */}
              <div className="absolute -top-3 -right-3 z-20 lg:-top-4 lg:-right-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCountry?.code ?? "aggregate"}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl border border-envrt-charcoal/8 bg-white px-3.5 py-2 shadow-lg"
                  >
                    {activeCountry ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{countryFlag(activeCountry.code)}</span>
                        <div>
                          <p className="text-xs font-semibold text-envrt-charcoal">
                            {activeCountry.views.toLocaleString()} views
                          </p>
                          {activeCountry.durationSeconds > 0 && (
                            <p className="text-[10px] text-envrt-muted">
                              {formatDuration(activeCountry.durationSeconds)}
                            </p>
                          )}
                          <p className="text-[10px] text-envrt-muted">
                            {activeCountry.name}
                          </p>
                        </div>
                      </div>
                    ) : caption ? (
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-envrt-teal opacity-50" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-envrt-teal" />
                        </span>
                        <p className="text-[10px] font-medium text-envrt-muted">
                          {caption}
                        </p>
                      </div>
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Phone — overlaps laptop upper-left */}
              {carouselCards.length > 0 && currentCard && (
                <div className="absolute -top-6 -left-8 z-10 w-[120px] sm:-top-8 sm:-left-12 sm:w-[140px] lg:-top-12 lg:-left-20 lg:w-[160px]">
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

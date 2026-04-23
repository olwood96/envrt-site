"use client";

import { useCallback, useEffect, useState } from "react";
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

  // ── Carousel ──
  const carouselCards = featuredCards.slice(0, 5);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (carouselCards.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselCards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselCards.length]);

  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <div className="flex flex-col items-center gap-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* ── Left: CTA text ── */}
          <div className="order-2 max-w-lg lg:order-1">
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

            <FadeUp delay={0.2}>
              <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
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

          {/* ── Right: Device mockups ── */}
          <FadeUp delay={0.15}>
            <div className="order-1 relative w-full max-w-xl mx-auto lg:order-2 lg:mx-0">
              {/* Laptop */}
              <LaptopFrame>
                <DppWorldMap onStatsLoaded={handleStatsLoaded} />
              </LaptopFrame>

              {/* Phone — overlaps laptop upper-left */}
              {carouselCards.length > 0 && (
                <div className="absolute -top-6 -left-2 z-10 w-[120px] sm:-top-8 sm:-left-4 sm:w-[140px] lg:-top-12 lg:-left-8 lg:w-[160px]">
                  <PhoneFrame>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSlide}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                        className="h-full"
                      >
                        <DppCarouselCard
                          productImageUrl={carouselCards[activeSlide].productImageUrl}
                          brandLogoUrl={carouselCards[activeSlide].brandLogoUrl}
                          garmentName={carouselCards[activeSlide].dpp.garment_name}
                          brandName={carouselCards[activeSlide].brand.name}
                          transparencyScore={carouselCards[activeSlide].dpp.transparency_score}
                          totalEmissions={carouselCards[activeSlide].dpp.total_emissions}
                          totalWater={carouselCards[activeSlide].dpp.total_water}
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
        </div>
      </Container>
    </section>
  );
}

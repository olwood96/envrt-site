import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhyNowSection } from "@/components/sections/WhyNowSection";
import { SupplyChainFlowSection } from "@/components/sections/SupplyChainFlowSection";
import { OutcomesSection } from "@/components/sections/OutcomesSection";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { TrustedBySection } from "@/components/sections/TrustedBySection";
import { ImpactStatsSection } from "@/components/sections/ImpactStatsSection";
import { PricingPreviewSection } from "@/components/sections/PricingPreviewSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { StickyNudge } from "@/components/ui/StickyNudge";
import { faqItems } from "@/lib/config";
import { fetchImpactStats } from "@/lib/impact-stats";
import { getFeaturedDpps } from "@/lib/collective/fetch";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://envrt.com",
  },
};

export const revalidate = 3600;

export default async function HomePage() {
  const [impactStats, { cards: featuredCards }] = await Promise.all([
    fetchImpactStats(),
    getFeaturedDpps(),
  ]);

  return (
    <>
      <FAQJsonLd items={faqItems} />
      <HeroSection />
      <WhyNowSection />
      <SupplyChainFlowSection />
      <OutcomesSection />
      <ComparisonSection />
      <TrustedBySection />
      <ImpactStatsSection stats={impactStats} />
      <PricingPreviewSection />
      <FAQSection />
      <FinalCTASection featuredCards={featuredCards} />
      <StickyNudge />
      <div className="h-12" />
    </>
  );
}

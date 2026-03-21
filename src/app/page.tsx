import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhyNowSection } from "@/components/sections/WhyNowSection";
import { SupplyChainFlowSection } from "@/components/sections/SupplyChainFlowSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
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

export const metadata: Metadata = {
  alternates: {
    canonical: "https://envrt.com",
  },
};

export const revalidate = 3600;

export default async function HomePage() {
  const impactStats = await fetchImpactStats();

  return (
    <>
      <FAQJsonLd items={faqItems} />
      <HeroSection />
      <WhyNowSection />
      <SupplyChainFlowSection />
      <HowItWorksSection />
      <OutcomesSection />
      <ComparisonSection />
      <TrustedBySection />
      <ImpactStatsSection stats={impactStats} />
      <PricingPreviewSection />
      <FAQSection />
      <FinalCTASection />
      <StickyNudge />
      <div className="h-12" />
    </>
  );
}

import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { WhyNowSection } from "@/components/sections/WhyNowSection";
import { SupplyChainFlowSection } from "@/components/sections/SupplyChainFlowSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { OutcomesSection } from "@/components/sections/OutcomesSection";
import { TrustedBySection } from "@/components/sections/TrustedBySection";
import { ROICTASection } from "@/components/sections/ROICTASection";
import { PricingPreviewSection } from "@/components/sections/PricingPreviewSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { StickyNudge } from "@/components/ui/StickyNudge";
import { faqItems } from "@/lib/config";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://envrt.com",
  },
};

export default function HomePage() {
  return (
    <>
      <FAQJsonLd items={faqItems} />
      <HeroSection />
      <WhyNowSection />
      <SupplyChainFlowSection />
      <HowItWorksSection />
      <OutcomesSection />
      <TrustedBySection />
      <ROICTASection />
      <PricingPreviewSection />
      <FAQSection />
      <FinalCTASection />
      <StickyNudge />
      <div className="h-12" />
    </>
  );
}

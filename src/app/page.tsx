import { HeroSection } from "@/components/sections/HeroSection";
import { WhyNowSection } from "@/components/sections/WhyNowSection";
import { SupplyChainFlowSection } from "@/components/sections/SupplyChainFlowSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { OutcomesSection } from "@/components/sections/OutcomesSection";
import { TrustedBySection } from "@/components/sections/TrustedBySection";
import { PricingPreviewSection } from "@/components/sections/PricingPreviewSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyNowSection />
      <SupplyChainFlowSection />
      <HowItWorksSection />
      <OutcomesSection />
      <TrustedBySection />
      <PricingPreviewSection />
      <FAQSection />
      <FinalCTASection />
      <div className="h-12" />
    </>
  );
}

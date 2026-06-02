import type { Metadata } from "next";
import { HeroV2 } from "@/components/sections/v2/HeroV2";
import { DppAnatomySection } from "@/components/sections/v2/DppAnatomySection";
import { HowItWorksV2 } from "@/components/sections/v2/HowItWorksV2";
import { WhatYouGetSection } from "@/components/sections/v2/WhatYouGetSection";
import { WhyNowV2 } from "@/components/sections/v2/WhyNowV2";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { ImpactStatsSection } from "@/components/sections/ImpactStatsSection";
import { AlignedWithCarousel } from "@/components/sections/AlignedWithCarousel";
import { PricingPreviewSection } from "@/components/sections/PricingPreviewSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { StickyNudge } from "@/components/ui/StickyNudge";
import { fetchImpactStats } from "@/lib/impact-stats";
import { getFeaturedDpps } from "@/lib/collective/fetch";

export const metadata: Metadata = {
  title: "Homepage v2 preview — ENVRT",
  description: "Internal preview of the redesigned ENVRT homepage. Not for public consumption.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  alternates: {
    canonical: undefined,
  },
};

export const revalidate = 3600;

export default async function HomeV2PreviewPage() {
  const [impactStats, { cards: featuredCards }] = await Promise.all([
    fetchImpactStats(),
    getFeaturedDpps(),
  ]);

  return (
    <>
      <HeroV2 />
      <DppAnatomySection />
      <HowItWorksV2 />
      <WhatYouGetSection />
      <WhyNowV2 />
      <ComparisonSection />
      <ImpactStatsSection stats={impactStats} />
      <AlignedWithCarousel />
      <PricingPreviewSection />
      <FAQSection />
      <FinalCTASection featuredCards={featuredCards} />
      <StickyNudge />
      <div className="h-12" />
    </>
  );
}

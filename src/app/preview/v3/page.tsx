import type { Metadata } from "next";
import { HeroV3 } from "@/components/sections/v3/HeroV3";
import { ManifestoSection } from "@/components/sections/v3/ManifestoSection";
import { EsprCountdownSection } from "@/components/sections/v3/EsprCountdownSection";
import { ScrollTourSection } from "@/components/sections/v3/ScrollTourSection";
import { InTheWildSection } from "@/components/sections/v3/InTheWildSection";
import { CapabilitiesSection } from "@/components/sections/v3/CapabilitiesSection";
import { NumbersSection } from "@/components/sections/v3/NumbersSection";
import { HowItWorksV3 } from "@/components/sections/v3/HowItWorksV3";
import { InsightsTeaseSection } from "@/components/sections/v3/InsightsTeaseSection";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";
import { StickyCta } from "@/components/sections/v3/StickyCta";
import { ScrollProgressBar } from "@/components/sections/v3/ScrollProgressBar";
import { SceneMark } from "@/components/sections/v3/SceneMark";
import { AlignedWithCarouselV3 } from "@/components/sections/v3/AlignedWithCarouselV3";
import { FAQSectionV3 } from "@/components/sections/v3/FAQSectionV3";
import { ScatterToOrderSection } from "@/components/sections/v3/ScatterToOrderSection";
import { PolaroidStackSection } from "@/components/sections/v3/PolaroidStackSection";
import { getAllPostsMeta } from "@/lib/insights";
import { fetchPlatformStats } from "@/lib/impact-stats";
import { getFeaturedDpps } from "@/lib/collective/fetch";

// Root of /preview/v3, the full v3 homepage. Fonts, SmoothScroll, and
// the v3 navbar are mounted by /preview/v3/layout.tsx, so this file
// only renders the section composition.

export const metadata: Metadata = {
  title: "ENVRT v3 preview",
  description:
    "v3 redesign of the ENVRT homepage. Internal preview, not for public consumption.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  alternates: { canonical: undefined },
};

export const revalidate = 3600;

export default async function V3HomePage() {
  const [posts, stats, collective] = await Promise.all([
    Promise.resolve(
      getAllPostsMeta()
        .filter(
          (post) => !post.draft && !Number.isNaN(new Date(post.date).getTime()),
        )
        .slice(0, 3),
    ),
    fetchPlatformStats(),
    // Featured DPP product images feed the "More in The Collective"
    // mosaic in InTheWildSection. Failure-safe: empty array falls
    // through to the static folded-clothes image.
    getFeaturedDpps().catch(() => ({ cards: [] })),
  ]);

  return (
    <>
      <ScrollProgressBar />

      <HeroV3 />
      <ManifestoSection
        stats={{
          dppScans: stats.dppScans,
          countryCount: stats.countryCount,
          co2Kg: stats.co2Kg,
        }}
      />
      <EsprCountdownSection />
      <ScatterToOrderSection />

      <SceneMark index="02" label="The passport" />
      <ScrollTourSection />
      <InTheWildSection collectiveCards={collective.cards.slice(0, 6)} />

      <SceneMark index="03" label="What we do" />
      <CapabilitiesSection />

      <SceneMark index="04" label="The proof" dark />
      <NumbersSection />
      <PolaroidStackSection />
      <HowItWorksV3 />

      <SceneMark index="05" label="Deeper" />
      <AlignedWithCarouselV3 />
      <InsightsTeaseSection posts={posts} />
      <FAQSectionV3 />

      <FinalCtaV3 />
      <StickyCta />
    </>
  );
}

import type { Metadata } from "next";
import dynamic from "next/dynamic";
// Above-the-fold sections — static imports so they ship in the main
// chunk and hydrate immediately.
import { HeroV3 } from "@/components/sections/v3/HeroV3";
import { ProblemSection } from "@/components/sections/v3/ProblemSection";
import { ScrollProgressBar } from "@/components/sections/v3/ScrollProgressBar";
import { SceneMark } from "@/components/sections/v3/SceneMark";

// Below-the-fold sections — code-split into their own chunks so the
// initial JS payload stays lean. Default `ssr: true` keeps the
// server-rendered HTML for SEO; only the client hydration JS is
// deferred until the section enters view.
const ScatterToOrderSection = dynamic(() =>
  import("@/components/sections/v3/ScatterToOrderSection").then(
    (m) => m.ScatterToOrderSection,
  ),
);
const CapabilitiesSection = dynamic(() =>
  import("@/components/sections/v3/CapabilitiesSection").then(
    (m) => m.CapabilitiesSection,
  ),
);
const ScrollTourSection = dynamic(() =>
  import("@/components/sections/v3/ScrollTourSection").then(
    (m) => m.ScrollTourSection,
  ),
);
const InTheWildSection = dynamic(() =>
  import("@/components/sections/v3/InTheWildSection").then(
    (m) => m.InTheWildSection,
  ),
);
const NumbersSection = dynamic(() =>
  import("@/components/sections/v3/NumbersSection").then(
    (m) => m.NumbersSection,
  ),
);
const PolaroidStackSection = dynamic(() =>
  import("@/components/sections/v3/PolaroidStackSection").then(
    (m) => m.PolaroidStackSection,
  ),
);
const HowItWorksV3 = dynamic(() =>
  import("@/components/sections/v3/HowItWorksV3").then(
    (m) => m.HowItWorksV3,
  ),
);
const AlignedWithCarouselV3 = dynamic(() =>
  import("@/components/sections/v3/AlignedWithCarouselV3").then(
    (m) => m.AlignedWithCarouselV3,
  ),
);
const InsightsTeaseSection = dynamic(() =>
  import("@/components/sections/v3/InsightsTeaseSection").then(
    (m) => m.InsightsTeaseSection,
  ),
);
const FAQSectionV3 = dynamic(() =>
  import("@/components/sections/v3/FAQSectionV3").then(
    (m) => m.FAQSectionV3,
  ),
);
const FinalCtaV3 = dynamic(() =>
  import("@/components/sections/v3/FinalCtaV3").then((m) => m.FinalCtaV3),
);
const StickyCta = dynamic(() =>
  import("@/components/sections/v3/StickyCta").then((m) => m.StickyCta),
);
import { getAllPostsMeta } from "@/lib/insights";
import { getFeaturedDpps } from "@/lib/collective/fetch";
import { fetchImpactStats } from "@/lib/impact-stats";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { AlignedWithJsonLd } from "@/components/seo/AlignedWithJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { faqItems } from "@/lib/config";

// Root of /, the full v3 homepage. Fonts and
// the v3 navbar are mounted by //layout.tsx, so this file
// only renders the section composition.

export const metadata: Metadata = {
  title:
    "ENVRT | Environmental software for fashion brands. DPPs, LCA and supply chain.",
  description:
    "Trace every supplier. Calculate every garment. Substantiate every claim. Publish every Digital Product Passport. One platform, end to end, for fashion and apparel brands selling into the EU and UK.",
  alternates: { canonical: "/" },
};

export const revalidate = 3600;

export default async function V3HomePage() {
  const [posts, collective, impactStats] = await Promise.all([
    Promise.resolve(
      getAllPostsMeta()
        .filter(
          (post) => !post.draft && !Number.isNaN(new Date(post.date).getTime()),
        )
        .slice(0, 3),
    ),
    // Featured DPP product images feed the "More in The Collective"
    // mosaic in InTheWildSection. Failure-safe: empty array falls
    // through to the static folded-clothes image.
    getFeaturedDpps().catch(() => ({ cards: [] })),
    // Live cumulative data-points-served count, drives the fourth
    // stat in NumbersSection.
    fetchImpactStats().catch(() => ({ dataPointsServed: 0 })),
  ]);

  return (
    <>
      <SoftwareApplicationJsonLd />
      <AlignedWithJsonLd />
      <FAQJsonLd items={faqItems} />

      <ScrollProgressBar />

      <HeroV3 />
      <ProblemSection />
      <ScatterToOrderSection />

      <SceneMark index="02" label="What we do" />
      <CapabilitiesSection />

      <SceneMark index="03" label="The passport" />
      <ScrollTourSection />
      <InTheWildSection collectiveCards={collective.cards.slice(0, 6)} />

      <SceneMark index="04" label="The proof" dark />
      <NumbersSection dataPointsServed={impactStats.dataPointsServed} />
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

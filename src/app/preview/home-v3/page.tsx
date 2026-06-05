import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { HeroV3 } from "@/components/sections/v3/HeroV3";
import { ManifestoSection } from "@/components/sections/v3/ManifestoSection";
import { EsprCountdownSection } from "@/components/sections/v3/EsprCountdownSection";
import { ScrollTourSection } from "@/components/sections/v3/ScrollTourSection";
import { WhatsInDppV3 } from "@/components/sections/v3/WhatsInDppV3";
import { NumbersSection } from "@/components/sections/v3/NumbersSection";
import { HowItWorksV3 } from "@/components/sections/v3/HowItWorksV3";
import { InsightsTeaseSection } from "@/components/sections/v3/InsightsTeaseSection";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";
import { StickyCta } from "@/components/sections/v3/StickyCta";
import { ScrollProgressBar } from "@/components/sections/v3/ScrollProgressBar";
import { SceneMark } from "@/components/sections/v3/SceneMark";
import { AlignedWithCarousel } from "@/components/sections/AlignedWithCarousel";
import { FAQSection } from "@/components/sections/FAQSection";
import { getAllPostsMeta } from "@/lib/insights";
import { fetchPlatformStats } from "@/lib/impact-stats";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Homepage v3 preview — ENVRT",
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

export default async function HomeV3PreviewPage() {
  // Fetch posts list and platform stats in parallel. revalidate=3600 means
  // both get cached at the page level for 1 hour.
  const [posts, stats] = await Promise.all([
    Promise.resolve(
      getAllPostsMeta()
        .filter(
          (post) => !post.draft && !Number.isNaN(new Date(post.date).getTime()),
        )
        .slice(0, 3),
    ),
    fetchPlatformStats(),
  ]);

  return (
    <div className={`${manrope.variable} font-system bg-envrt-offwhite`}>
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

      <SceneMark index="02" label="The passport" />
      <ScrollTourSection />
      <WhatsInDppV3 />

      <SceneMark index="03" label="The proof" dark />
      <NumbersSection />
      <HowItWorksV3 />

      <SceneMark index="04" label="Deeper" />
      <AlignedWithCarousel />
      <InsightsTeaseSection posts={posts} />
      <FAQSection />

      <FinalCtaV3 />
      <StickyCta />
    </div>
  );
}

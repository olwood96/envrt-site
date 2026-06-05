import type { Metadata } from "next";
import { Big_Shoulders_Text, Karla, Manrope } from "next/font/google";
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
import { SmoothScroll } from "@/components/sections/v3/SmoothScroll";
import { AlignedWithCarousel } from "@/components/sections/AlignedWithCarousel";
import { FAQSection } from "@/components/sections/FAQSection";
import { getAllPostsMeta } from "@/lib/insights";
import { fetchPlatformStats } from "@/lib/impact-stats";

// Brand fonts per 2022 ENVRT brand guidelines (scoped to v3 only via CSS
// variable). Big Shoulders Text = display, Karla = body.
const display = Big_Shoulders_Text({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Karla({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
  display: "swap",
});

// Manrope kept as a fallback for any v3 component still referencing the
// previous display family while the brand sweep lands.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
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
    <SmoothScroll>
      <div
        className={`${display.variable} ${body.variable} ${manrope.variable} font-karla bg-envrt-brand-vista text-envrt-brand-black`}
      >
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
        <InTheWildSection />

        <SceneMark index="03" label="What we do" />
        <CapabilitiesSection />

        <SceneMark index="04" label="The proof" dark />
        <NumbersSection />
        <HowItWorksV3 />

        <SceneMark index="05" label="Deeper" />
        <AlignedWithCarousel />
        <InsightsTeaseSection posts={posts} />
        <FAQSection />

        <FinalCtaV3 />
        <StickyCta />
      </div>
    </SmoothScroll>
  );
}

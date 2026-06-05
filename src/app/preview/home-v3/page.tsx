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
import { AlignedWithCarousel } from "@/components/sections/AlignedWithCarousel";
import { FAQSection } from "@/components/sections/FAQSection";
import { getAllPostsMeta } from "@/lib/insights";

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

export default function HomeV3PreviewPage() {
  const posts = getAllPostsMeta().slice(0, 3);

  return (
    <div className={`${manrope.variable} font-system bg-envrt-offwhite`}>
      <HeroV3 />
      <ManifestoSection />
      <EsprCountdownSection />
      <ScrollTourSection />
      <WhatsInDppV3 />
      <NumbersSection />
      <HowItWorksV3 />
      <AlignedWithCarousel />
      <InsightsTeaseSection posts={posts} />
      <FAQSection />
      <FinalCtaV3 />
      <StickyCta />
    </div>
  );
}

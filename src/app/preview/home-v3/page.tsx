import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { HeroV3 } from "@/components/sections/v3/HeroV3";
import { ManifestoSection } from "@/components/sections/v3/ManifestoSection";
import { ScrollTourSection } from "@/components/sections/v3/ScrollTourSection";
import { WhatsInDppV3 } from "@/components/sections/v3/WhatsInDppV3";
import { NumbersSection } from "@/components/sections/v3/NumbersSection";
import { HowItWorksV3 } from "@/components/sections/v3/HowItWorksV3";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";
import { AlignedWithCarousel } from "@/components/sections/AlignedWithCarousel";
import { FAQSection } from "@/components/sections/FAQSection";

// Manrope for display headings, paired with SF Pro system stack for body.
// N27 reserved for the brand wordmark only.
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
  return (
    <div className={`${manrope.variable} font-system bg-envrt-offwhite`}>
      <HeroV3 />
      <ManifestoSection />
      <ScrollTourSection />
      <WhatsInDppV3 />
      <NumbersSection />
      <HowItWorksV3 />
      <AlignedWithCarousel />
      <FAQSection />
      <FinalCtaV3 />
    </div>
  );
}

import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { HeroV3 } from "@/components/sections/v3/HeroV3";
import { ManifestoSection } from "@/components/sections/v3/ManifestoSection";
import { WhatsInDppV3 } from "@/components/sections/v3/WhatsInDppV3";
import { NumbersSection } from "@/components/sections/v3/NumbersSection";
import { HowItWorksV3 } from "@/components/sections/v3/HowItWorksV3";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { AlignedWithCarousel } from "@/components/sections/AlignedWithCarousel";
import { FAQSection } from "@/components/sections/FAQSection";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Homepage v3 preview — ENVRT",
  description:
    "Editorial redesign of the ENVRT homepage. Internal preview, not for public consumption.",
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
    <div className={`${fraunces.variable} bg-envrt-offwhite`}>
      <HeroV3 />
      <ManifestoSection />
      <WhatsInDppV3 />
      <NumbersSection />
      <HowItWorksV3 />
      <ComparisonSection />
      <AlignedWithCarousel />
      <FAQSection />
      <FinalCtaV3 />
    </div>
  );
}

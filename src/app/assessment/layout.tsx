import type { Metadata } from "next";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { assessmentFaqItems } from "@/lib/config";

export const metadata: Metadata = {
  title: "DPP Readiness Assessment — Is Your Brand Ready? | ENVRT",
  description:
    "Free DPP readiness assessment for fashion brands. Find out if you're ready for the EU ESPR Digital Product Passport mandate — 10-minute check with instant personalised report.",
  keywords: [
    "DPP readiness assessment",
    "Digital Product Passport compliance",
    "ESPR readiness check",
    "fashion sustainability assessment",
    "DPP mandate UK EU",
    "fashion brand compliance",
  ],
  openGraph: {
    title: "DPP Readiness Assessment — Is Your Brand Ready? | ENVRT",
    description:
      "Free DPP readiness assessment. Find out if your fashion brand is ready for the EU ESPR Digital Product Passport mandate.",
    url: "https://envrt.com/assessment",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DPP Readiness Assessment — Is Your Brand Ready? | ENVRT",
    description:
      "Free DPP readiness assessment for fashion brands. 10 minutes, instant results.",
  },
  alternates: {
    canonical: "https://envrt.com/assessment",
  },
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FAQJsonLd items={assessmentFaqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://envrt.com" },
          { name: "Assessment", url: "https://envrt.com/assessment" },
        ]}
      />
      {children}
    </>
  );
}

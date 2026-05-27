import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { WebApplicationJsonLd } from "@/components/seo/WebApplicationJsonLd";
import { readinessAssessmentFaqItems } from "@/lib/config";

export const metadata: Metadata = {
  title: "DPP Readiness Assessment for Fashion Brands | ENVRT",
  description:
    "Free 10-minute assessment to measure your Digital Product Passport readiness across supply chain, product data, regulatory awareness and infrastructure. Personalised report covering ESPR, UK DMCCA and Green Claims exposure.",
  keywords: [
    "DPP readiness assessment",
    "Digital Product Passport compliance check",
    "ESPR readiness test fashion",
    "fashion compliance assessment",
    "DPP preparedness score",
    "textile regulation readiness",
    "EU Green Claims Directive readiness",
    "fashion brand DPP score",
  ],
  openGraph: {
    title: "DPP Readiness Assessment for Fashion Brands | ENVRT",
    description:
      "Free 10-minute assessment to measure your Digital Product Passport readiness. Personalised compliance report in minutes.",
    url: "https://envrt.com/assessment",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DPP Readiness Assessment for Fashion Brands | ENVRT",
    description:
      "Free 10-minute assessment to measure your Digital Product Passport readiness.",
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
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://envrt.com" },
          { name: "DPP Readiness Assessment", url: "https://envrt.com/assessment" },
        ]}
      />
      <FAQJsonLd items={readinessAssessmentFaqItems} />
      <WebApplicationJsonLd
        name="ENVRT DPP Readiness Assessment"
        url="https://envrt.com/assessment"
        description="Free structured assessment that scores fashion brands on Digital Product Passport readiness across supply chain transparency, product data completeness, regulatory awareness and data infrastructure."
        isQuiz
      />
      {children}
    </>
  );
}

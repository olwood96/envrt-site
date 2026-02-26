import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DPP Readiness Assessment — Is Your Brand Ready? | ENVRT",
  description:
    "Find out if your fashion brand is ready for the EU ESPR Digital Product Passport mandate. Free 10-minute assessment with instant personalised report.",
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
      "Find out if your fashion brand is ready for the EU ESPR Digital Product Passport mandate. Free 10-minute assessment with instant personalised report.",
    url: "https://envrt.com/assessment",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DPP Readiness Assessment — Is Your Brand Ready? | ENVRT",
    description:
      "Find out if your fashion brand is ready for the EU ESPR Digital Product Passport mandate. Free 10-minute assessment with instant personalised report.",
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
  return children;
}

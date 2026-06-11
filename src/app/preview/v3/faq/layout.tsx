import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | ENVRT for fashion brands",
  description:
    "Answers on Digital Product Passports, lifecycle assessment, ESPR readiness, pricing tiers, ROI vs consultants and the ENVRT readiness assessment.",
  alternates: { canonical: "/faq" },
  robots: { index: false, follow: false },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}

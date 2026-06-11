import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DPP timeline | EU ESPR, UK DMCCA and French AGEC for textiles",
  description:
    "Live regulatory timeline for textile Digital Product Passports. EU ESPR delegated act lands mid-2026. Mandatory DPPs phase in from 2027. UK DMCCA and French AGEC apply now.",
  alternates: { canonical: "/dpp-timeline" },
  robots: { index: false, follow: false },
};

export default function DppTimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

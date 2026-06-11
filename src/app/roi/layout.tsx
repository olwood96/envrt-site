import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ROI calculator | ENVRT vs consultants vs in-house",
  description:
    "See what ENVRT saves you per SKU, per garment, per year. Side-by-side with consultants and an in-house hire. EUR, GBP and USD.",
  alternates: { canonical: "/roi" },
};

export default function RoiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

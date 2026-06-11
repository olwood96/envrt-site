import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free DPP | Try ENVRT on one garment",
  description:
    "Submit one garment in three steps. Get a regulation-ready Digital Product Passport back within a day. No card, no commitment.",
  alternates: { canonical: "/free-dpp" },
  robots: { index: false, follow: false },
};

export default function FreeDppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team — Meet the People Behind ENVRT",
  description:
    "Meet the founders and advisors behind ENVRT. Deep expertise in environmental science, AI, astrophysics and fashion technology, building the future of product transparency.",
  keywords: [
    "ENVRT team",
    "Digital Product Passport company",
    "sustainability technology team UK",
  ],
  openGraph: {
    title: "Our Team — Meet the People Behind ENVRT",
    description:
      "Deep expertise in environmental science, AI and fashion technology, building the future of product transparency.",
    url: "https://envrt.com/team",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Team — Meet the People Behind ENVRT",
    description:
      "Deep expertise in environmental science, AI and fashion technology.",
  },
  alternates: {
    canonical: "https://envrt.com/team",
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import { STARTER_MONTHLY_GBP, GROWTH_MONTHLY_GBP } from "@/lib/plan-prices";

export function SoftwareApplicationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ENVRT",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Digital Product Passports, lifecycle metrics and sustainability analytics for fashion brands.",
    url: "https://envrt.com",
    offers: [
      {
        "@type": "Offer",
        name: "Starter",
        price: String(STARTER_MONTHLY_GBP),
        priceCurrency: "GBP",
        priceValidUntil: new Date(
          new Date().getFullYear() + 1,
          0,
          1
        ).toISOString().split("T")[0],
        description:
          "Up to 50 products/SKUs, QR-ready passport pages, transparency scores, CO₂e and water scarcity indicators.",
      },
      {
        "@type": "Offer",
        name: "Growth",
        price: String(GROWTH_MONTHLY_GBP),
        priceCurrency: "GBP",
        priceValidUntil: new Date(
          new Date().getFullYear() + 1,
          0,
          1
        ).toISOString().split("T")[0],
        description:
          "Up to 250 products/SKUs, core LCA metrics, hotspot detection, product comparisons, and priority support.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

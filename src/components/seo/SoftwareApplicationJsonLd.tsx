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
        price: "149",
        priceCurrency: "GBP",
        priceValidUntil: new Date(
          new Date().getFullYear() + 1,
          0,
          1
        ).toISOString().split("T")[0],
        description:
          "Up to 25 DPP pages, QR-ready passport pages, transparency scores, CO₂e and water scarcity indicators.",
      },
      {
        "@type": "Offer",
        name: "Growth",
        price: "495",
        priceCurrency: "GBP",
        priceValidUntil: new Date(
          new Date().getFullYear() + 1,
          0,
          1
        ).toISOString().split("T")[0],
        description:
          "Up to 100 DPP pages, core LCA metrics, hotspot detection, product comparisons, and priority support.",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "1295",
        priceCurrency: "GBP",
        priceValidUntil: new Date(
          new Date().getFullYear() + 1,
          0,
          1
        ).toISOString().split("T")[0],
        description:
          "Custom DPP allocation, complete PEF-aligned metrics, advanced modelling, dedicated account specialist.",
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

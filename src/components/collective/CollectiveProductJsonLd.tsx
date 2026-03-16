import type { CollectiveCardData } from "@/lib/collective/types";

interface Props {
  card: CollectiveCardData;
  url: string;
}

export function CollectiveProductJsonLd({ card, url }: Props) {
  const { dpp, brand, productImageUrl } = card;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: dpp.garment_name,
    description: `Digital Product Passport for ${dpp.garment_name} by ${brand.name}. ${dpp.collection_name} collection.`,
    url,
    brand: {
      "@type": "Brand",
      name: brand.name,
    },
    category: dpp.garment_type ?? "Apparel",
    sku: dpp.product_sku,
  };

  if (productImageUrl) {
    jsonLd.image = productImageUrl;
  }

  if (dpp.purchase_url) {
    jsonLd.offers = {
      "@type": "Offer",
      url: dpp.purchase_url,
      availability: "https://schema.org/InStock",
    };
  }

  // Material composition
  if (dpp.constituents.length > 0) {
    jsonLd.material = dpp.constituents
      .map((c) => `${c.material} ${c.pct}%`)
      .join(", ");
  }

  // Weight
  if (dpp.garment_mass_g) {
    jsonLd.weight = {
      "@type": "QuantitativeValue",
      value: dpp.garment_mass_g,
      unitCode: "GRM",
    };
  }

  // Sustainability metrics as additional properties
  const additionalProperties: Record<string, unknown>[] = [];

  if (dpp.total_emissions != null) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "Carbon Footprint",
      value: dpp.total_emissions,
      unitText: "kg CO₂e",
    });
  }

  if (dpp.total_water != null) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "Water Usage",
      value: dpp.total_water,
      unitText: "litres",
    });
  }

  if (dpp.transparency_score != null) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "Transparency Score",
      value: dpp.transparency_score,
      unitText: "percent",
    });
  }

  if (additionalProperties.length > 0) {
    jsonLd.additionalProperty = additionalProperties;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

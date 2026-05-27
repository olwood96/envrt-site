import { ALIGNED_WITH_ALL } from "@/lib/aligned-with";

export function AlignedWithJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Standards and frameworks ENVRT methodology aligns with",
    description:
      "Open international and EU regulatory frameworks, ISO standards and scientific bodies whose methodologies the ENVRT lifecycle assessment platform follows.",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: ALIGNED_WITH_ALL.length,
    itemListElement: ALIGNED_WITH_ALL.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": entry.schemaType,
        name: entry.fullName,
        description: entry.description,
        url: entry.url,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Schema.org ItemList block. Used on /platform (nine capabilities) and
// any list-of-things surface where each item is independently linkable.
// AI Overviews use ItemList to render "Here are the capabilities" style
// answers with linked items.

type ListItem = {
  name: string;
  url?: string;
  description?: string;
};

export function ItemListJsonLd({
  name,
  description,
  items,
  url,
}: {
  name: string;
  description: string;
  items: ListItem[];
  url: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    url,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.description ? { description: it.description } : {}),
      ...(it.url ? { url: it.url } : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

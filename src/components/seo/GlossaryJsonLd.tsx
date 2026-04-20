interface GlossaryTerm {
  term: string;
  definition: string;
}

export function GlossaryJsonLd({ terms }: { terms: GlossaryTerm[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Fashion Sustainability Glossary",
    description:
      "Definitions of key terms in fashion sustainability, Digital Product Passports, Life Cycle Assessment and environmental regulation.",
    url: "https://envrt.com/glossary",
    hasDefinedTerm: terms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definition,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

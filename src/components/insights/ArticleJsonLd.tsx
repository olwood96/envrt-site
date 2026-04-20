import type { InsightsPostMeta } from "@/lib/insights";

interface ArticleJsonLdProps {
  post: InsightsPostMeta;
  url: string;
}

// ─── Founder Person schema ──────────────────────────────────────────────────

const FOUNDERS = [
  {
    "@type": "Person" as const,
    name: "Charles Woolwich",
    jobTitle: "Co-Founder & CEO",
    url: "https://envrt.com/team",
    worksFor: { "@type": "Organization" as const, name: "ENVRT" },
    alumniOf: {
      "@type": "EducationalOrganization" as const,
      name: "MSc Environmental Science with Distinction",
    },
    description:
      "Former Environmental Lead at Gordon Ingram Associates. Expert in translating complex environmental data into actionable strategy. Now leading ENVRT's commercial mission to bring compliance infrastructure to fashion.",
    knowsAbout: [
      "Environmental Science",
      "Sustainability Strategy",
      "Life Cycle Assessment",
      "Digital Product Passports",
      "Fashion Sustainability Compliance",
    ],
  },
  {
    "@type": "Person" as const,
    name: "Oliver Woodcock",
    jobTitle: "Co-Founder & CTO",
    url: "https://envrt.com/team",
    worksFor: { "@type": "Organization" as const, name: "ENVRT" },
    alumniOf: {
      "@type": "EducationalOrganization" as const,
      name: "Imperial College London",
    },
    description:
      "Astrophysicist trained at Imperial College London. Published in peer-reviewed Astronomy and Astrophysics journals at Masters level, University of Manchester. A decade building production-grade data pipelines. Now powering ENVRT's sustainability intelligence engine.",
    knowsAbout: [
      "Data Engineering",
      "Life Cycle Assessment Automation",
      "Environmental Data Pipelines",
      "Digital Product Passports",
      "Software Architecture",
    ],
  },
];

// ─── Entity mapping for about/mentions ──────────────────────────────────────

interface SchemaEntity {
  "@type": string;
  name: string;
  url?: string;
  sameAs?: string;
}

/**
 * Maps keywords and tags to known schema.org entities so search engines and
 * LLMs can connect articles to the broader knowledge graph.
 *
 * Keys are ordered longest-first so "pefcr" matches before "pef" and
 * "green claims" matches before partial substrings.
 */
const KNOWN_ENTITIES: [string, SchemaEntity][] = [
  [
    "carbon footprint",
    {
      "@type": "Thing",
      name: "Carbon Footprint",
      sameAs: "https://en.wikipedia.org/wiki/Carbon_footprint",
    },
  ],
  [
    "water scarcity",
    {
      "@type": "Thing",
      name: "Water Scarcity",
      sameAs: "https://en.wikipedia.org/wiki/Water_scarcity",
    },
  ],
  [
    "green claims",
    {
      "@type": "Thing",
      name: "EU Green Claims Directive",
    },
  ],
  [
    "supply chain",
    {
      "@type": "Thing",
      name: "Supply Chain Transparency",
    },
  ],
  [
    "aware method",
    {
      "@type": "Thing",
      name: "AWARE Method (Available WAter REmaining)",
    },
  ],
  [
    "iso 14040",
    {
      "@type": "Thing",
      name: "ISO 14040",
      sameAs: "https://www.iso.org/standard/37456.html",
    },
  ],
  [
    "greenwashing",
    {
      "@type": "Thing",
      name: "Greenwashing",
      sameAs: "https://en.wikipedia.org/wiki/Greenwashing",
    },
  ],
  [
    "scope 3",
    {
      "@type": "Thing",
      name: "Scope 3 Emissions (GHG Protocol)",
      sameAs: "https://ghgprotocol.org/scope-3-technical-calculation-guidance",
    },
  ],
  [
    "pefcr",
    {
      "@type": "Thing",
      name: "PEFCR for Apparel and Footwear",
    },
  ],
  [
    "espr",
    {
      "@type": "Thing",
      name: "Ecodesign for Sustainable Products Regulation (ESPR)",
    },
  ],
  [
    "csrd",
    {
      "@type": "Thing",
      name: "Corporate Sustainability Reporting Directive (CSRD)",
    },
  ],
  [
    "pef",
    {
      "@type": "Thing",
      name: "Product Environmental Footprint (PEF)",
    },
  ],
  [
    "dpp",
    {
      "@type": "Thing",
      name: "Digital Product Passport",
      sameAs: "https://en.wikipedia.org/wiki/Digital_product_passport",
    },
  ],
  [
    "lca",
    {
      "@type": "Thing",
      name: "Life Cycle Assessment",
      sameAs: "https://en.wikipedia.org/wiki/Life-cycle_assessment",
    },
  ],
];

function resolveEntities(keywords: string[], tags: string[]): SchemaEntity[] {
  const combined = [...keywords, ...tags].map((k) => k.toLowerCase());
  const matched = new Map<string, SchemaEntity>();

  for (const token of combined) {
    // Iterate in order (longest keys first) to prefer specific matches
    for (const [key, entity] of KNOWN_ENTITIES) {
      if (token.includes(key) && !matched.has(entity.name)) {
        matched.set(entity.name, entity);
      }
    }
  }

  return Array.from(matched.values());
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ArticleJsonLd({ post, url }: ArticleJsonLdProps) {
  const entities = resolveEntities(post.keywords, post.tags);

  // First 3 matched entities as "about", remainder as "mentions"
  const aboutEntities = entities.slice(0, 3);
  const mentionEntities = entities.slice(3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: FOUNDERS,
    publisher: {
      "@type": "Organization",
      name: "ENVRT",
      url: "https://envrt.com",
      logo: {
        "@type": "ImageObject",
        url: "https://envrt.com/brand/envrt-logo.png",
      },
      founder: FOUNDERS,
    },
    url,
    datePublished: post.date,
    ...(post.updated && { dateModified: post.updated }),
    ...(post.ogImage && {
      image: `https://envrt.com${post.ogImage}`,
    }),
    keywords: post.keywords.join(", "),
    wordCount: post.readingTime * 230,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [
        "article h1",
        "article .mt-8 > p:first-of-type",
        "article .mt-8 > p:nth-of-type(2)",
      ],
    },
    ...(aboutEntities.length > 0 && { about: aboutEntities }),
    ...(mentionEntities.length > 0 && { mentions: mentionEntities }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Curated topic groups for the insights index. Each topic folds in one or
// more raw frontmatter tags so the browse UI shows a tidy editorial set
// instead of every long-tail tag. Source of truth for topic chips, topic
// breadcrumbs on tag pages and the insights search experience.

export interface InsightTopic {
  slug: string;
  label: string;
  description: string;
  tags: string[];
}

export const INSIGHT_TOPICS: InsightTopic[] = [
  {
    slug: "dpp",
    label: "Digital Product Passports",
    description:
      "Implementation, scope, cost and timeline for the EU DPP under ESPR.",
    tags: [
      "DPP",
      "ESPR",
      "Textiles",
      "Implementation",
      "Comparison",
      "Procurement",
      "Circularity",
    ],
  },
  {
    slug: "lca-and-data",
    label: "LCA and impact data",
    description:
      "Methodology, hotspots, water and emissions data for fashion brands.",
    tags: ["LCA", "Data", "Sustainability", "Hotspots", "Water", "Emissions"],
  },
  {
    slug: "regulation",
    label: "Regulation and compliance",
    description:
      "Compliance, regulatory landscape and reporting obligations across EU and US.",
    tags: ["Regulation", "Compliance", "Reporting", "US"],
  },
  {
    slug: "supply-chain",
    label: "Supply chain",
    description:
      "Supplier data collection, traceability and supply chain transparency.",
    tags: ["Supply Chain", "Traceability", "Transparency"],
  },
  {
    slug: "green-claims",
    label: "Green claims",
    description:
      "Substantiating sustainability marketing claims and avoiding greenwashing.",
    tags: ["Green Claims", "Marketing", "Greenwashing"],
  },
  {
    slug: "business-and-pricing",
    label: "Business and pricing",
    description:
      "Business cases, ROI and pricing breakdowns for sustainability investment.",
    tags: ["Strategy", "Business", "Pricing", "ROI", "Business Case"],
  },
];

const TAG_TO_TOPICS = (() => {
  const map = new Map<string, InsightTopic[]>();
  for (const topic of INSIGHT_TOPICS) {
    for (const tag of topic.tags) {
      const key = tag.toLowerCase();
      const list = map.get(key) ?? [];
      list.push(topic);
      map.set(key, list);
    }
  }
  return map;
})();

export function getTopicBySlug(slug: string): InsightTopic | undefined {
  return INSIGHT_TOPICS.find((t) => t.slug === slug);
}

export function getTopicsForTag(tag: string): InsightTopic[] {
  return TAG_TO_TOPICS.get(tag.toLowerCase()) ?? [];
}

export function postMatchesTopic(
  postTags: string[],
  topicSlug: string,
): boolean {
  const topic = getTopicBySlug(topicSlug);
  if (!topic) return false;
  const lower = topic.tags.map((t) => t.toLowerCase());
  return postTags.some((tag) => lower.includes(tag.toLowerCase()));
}

export function countPostsByTopic(
  posts: { tags: string[] }[],
  topicSlug: string,
): number {
  return posts.filter((p) => postMatchesTopic(p.tags, topicSlug)).length;
}

import { Container } from "@/components/ui/Container";
import { InsightsCard } from "@/components/insights/InsightCard";
import { Accordion } from "@/components/ui/Accordion";
import { NewsletterSubscribe } from "@/components/insights/NewsletterSubscribe";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { getAllPostsMeta } from "@/lib/insights";
import type { Metadata } from "next";

// ─── Insights-specific FAQs (broad topic questions, not ENVRT-specific) ──────

const insightsFaqItems = [
  {
    question: "Do I need a Digital Product Passport for my fashion brand?",
    answer:
      "If you sell apparel or textiles into the EU market, the Digital Product Passport will apply to your products under the ESPR framework. Textiles are a priority product group with a delegated act expected in 2027. The requirement applies regardless of where your brand is based.",
  },
  {
    question: "What environmental data will the EU require for textiles?",
    answer:
      "The exact data fields will be defined in the textile delegated act. Based on the JRC\u2019s published DPP data specification methodology, the categories will include environmental footprint (climate and water impact), material composition, substances of concern, durability and repairability information and end-of-life guidance.",
  },
  {
    question: "What is the difference between a carbon footprint and an environmental footprint?",
    answer:
      "A carbon footprint measures greenhouse gas emissions only, expressed in kg CO\u2082e. An environmental footprint covers multiple impact categories including climate change, water use, acidification, resource depletion and others. The EU PEF method defines 16 impact categories. Regulatory frameworks are increasingly requiring multi-indicator assessment, not carbon alone.",
  },
  {
    question: "Why does water scarcity matter for fashion brands?",
    answer:
      "Cotton cultivation and wet processing (dyeing, finishing) are water-intensive. The environmental impact depends on where the water is consumed. Water used in a severely stressed basin like Pakistan\u2019s Punjab province has a fundamentally different impact from the same volume used in a rain-fed region. The AWARE method captures this difference and is the recommended approach under the EU PEF framework.",
  },
  {
    question: "How can fashion brands substantiate green claims?",
    answer:
      "Green claims need to be specific, measurable and supported by product-level evidence using a recognised methodology such as ISO 14040 LCA. The EU Green Claims Directive and UK CMA Green Claims Code both require this. Generic terms like \u201csustainable\u201d or \u201ceco-friendly\u201d need to be backed by verified performance data at the product level.",
  },
  {
    question: "What is Scope 3 and why does it dominate in fashion?",
    answer:
      "Scope 3 covers indirect emissions across a company\u2019s value chain. For fashion brands, Scope 3 typically accounts for over 90% of total greenhouse gas emissions because most brands do not own their factories, grow their raw materials or operate their logistics networks. Product-level LCA data is what makes Scope 3 reporting actionable.",
  },
];

export const metadata: Metadata = {
  title: "Insights — DPP Guides & Sustainability Articles | ENVRT",
  description:
    "Guides and articles on Digital Product Passports, sustainability data, supply chain transparency, and fashion transparency. Expert insights from the ENVRT team.",
  keywords: [
    "fashion sustainability insights",
    "digital product passport guide",
    "fashion LCA articles",
    "sustainability data fashion",
    "DPP compliance guide",
    "green claims fashion",
  ],
  openGraph: {
    title: "Insights — DPP Guides & Sustainability Articles | ENVRT",
    description:
      "Guides and articles on Digital Product Passports, sustainability data, supply chain transparency, and fashion transparency.",
    url: "https://envrt.com/insights",
    type: "website",
  },
  alternates: {
    canonical: "https://envrt.com/insights",
  },
};

export default function InsightsIndexPage() {
  const posts = getAllPostsMeta();

  return (
    <div className="pt-28 pb-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://envrt.com" },
          { name: "Insights", url: "https://envrt.com/insights" },
        ]}
      />
      <FAQJsonLd items={insightsFaqItems} />
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-envrt-charcoal sm:text-5xl">
            Insights
          </h1>
          <p className="mt-4 text-base text-envrt-muted sm:text-lg">
            Insights on sustainability, transparency, and the future of fashion
            transparency.
          </p>

          {posts.length === 0 ? (
            <p className="mt-16 text-center text-envrt-muted">
              No posts yet. Check back soon.
            </p>
          ) : (
            <div className="mt-12 space-y-6">
              {posts.map((post) => (
                <InsightsCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {/* Newsletter signup */}
          <NewsletterSubscribe variant="card" />

          {/* Topic FAQs */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold tracking-tight text-envrt-charcoal">
              Common questions
            </h2>
            <p className="mt-2 text-sm text-envrt-muted">
              Quick answers to the questions fashion brands ask most about DPPs,
              LCA and sustainability data.
            </p>
            <div className="mt-6">
              <Accordion items={insightsFaqItems} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

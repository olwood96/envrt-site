import { Container } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import Link from "next/link";
import type { Metadata } from "next";

// ─── FAQ data (unique to this page — process, onboarding, practical questions) ─

const faqSections = [
  {
    heading: "Getting started",
    items: [
      {
        question: "How long does it take to onboard with ENVRT?",
        answer:
          "Most brands onboard in around 30 minutes. You upload your collection data through the ENVRT Dashboard and can generate your first Digital Product Passport the same day.",
      },
      {
        question: "What data do I need to provide to get started?",
        answer:
          "At minimum, your garment's material composition (fibre types and percentages), garment weight and country of manufacture. The more supply chain detail you can provide, such as fibre origin, dyeing process and assembly location, the richer your assessment will be.",
      },
      {
        question: "Do I need to have complete supply chain data before starting?",
        answer:
          "No. ENVRT's smart gap filler uses a materials database with fuzzy matching to fill in missing data points automatically. You can start with what you have and improve data quality over time as supplier information becomes available.",
      },
      {
        question: "Can I try ENVRT before committing to a plan?",
        answer:
          "Yes. You can request a free eco-score DPP for one product with no account required, or book a demo and we will walk you through the platform with your own product data. No commitment needed.",
      },
    ],
  },
  {
    heading: "How it works",
    items: [
      {
        question: "How does ENVRT calculate the environmental impact of a garment?",
        answer:
          "ENVRT uses ISO 14040/14044 compliant Life Cycle Assessment on a cradle-to-gate basis, aligned with the PEFCR for apparel and footwear. Each garment is individually assessed to produce climate impact (CO\u2082e) and water scarcity impact (AWARE method), attributed across six life cycle stages: fibre production, yarn production, fabric production, dyeing and finishing, assembly and transport.",
      },
      {
        question: "What is the AWARE method for water scarcity?",
        answer:
          "AWARE (Available WAter REmaining) is the recommended water scarcity method under the EU Product Environmental Footprint (PEF) framework. It weights water consumption against regional scarcity factors to produce a figure that reflects actual environmental stress, not just volume consumed. ENVRT uses the AWARE method for every product assessed.",
      },
      {
        question: "What is the difference between ENVRT and a traditional LCA consultancy?",
        answer:
          "Traditional consultancies charge per study, take weeks to months and deliver PDF reports. ENVRT delivers product-level LCA across entire collections in days through an automated platform. The methodology is the same (ISO 14040, PEFCR), but the delivery is faster, more scalable and significantly less expensive.",
      },
      {
        question: "Does ENVRT only measure carbon?",
        answer:
          "No. ENVRT generates both climate impact (CO\u2082e) and water scarcity impact using the AWARE method for every product assessed. The EU PEF framework identifies water use as one of the most relevant impact categories for apparel, so measuring carbon alone does not satisfy multi-indicator regulatory requirements.",
      },
    ],
  },
  {
    heading: "Digital Product Passports",
    items: [
      {
        question: "What is included in an ENVRT Digital Product Passport?",
        answer:
          "Each DPP contains the garment's environmental footprint (CO\u2082e and water scarcity), material composition, a transparency score, brand and product information, and supply chain details where available. It is linked to the physical garment via QR code.",
      },
      {
        question: "Can I embed DPPs on my own website?",
        answer:
          "Yes. On Growth and Pro plans, you get embeddable widgets that display sustainability metrics directly on your product pages, styled to match your brand.",
      },
      {
        question: "Are ENVRT DPPs compliant with EU regulations?",
        answer:
          "ENVRT DPPs are built against the ESPR framework and use the same ISO 14040 and PEFCR methodology that the EU\u2019s DPP data specification methodology references. The exact textile DPP requirements will be defined in the delegated act expected in 2027. Brands building product-level data now using these methods are preparing with the right foundation.",
      },
    ],
  },
  {
    heading: "Pricing and plans",
    items: [
      {
        question: "How much does ENVRT cost?",
        answer:
          "ENVRT offers three plans: Starter at \u00a3149/month for up to 50 products, Growth at \u00a3495/month for up to 250 products with full LCA metrics, and Pro at \u00a31,295/month with custom allocation and dedicated support. Annual billing saves 15%.",
      },
      {
        question: "Can I switch plans?",
        answer:
          "Yes, you can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.",
      },
      {
        question: "What is included in each plan?",
        answer:
          "Starter includes DPP creation, QR-ready passport pages, transparency scores, CO\u2082e indicators, French Eco-Score ratings and scan analytics. Growth adds full LCA metrics, AI-powered data ingestion, hotspot detection and product comparisons. Pro includes complete PEF-aligned metrics, advanced modelling, seasonal reports, eco-design strategy and a dedicated account specialist.",
      },
    ],
  },
  {
    heading: "Compliance and regulation",
    items: [
      {
        question: "When will the EU Digital Product Passport be required for textiles?",
        answer:
          "The textile-specific delegated act is expected in 2027, with practical implementation likely from 2028 onward. The preparatory study is already active. Brands building product-level environmental data now are preparing ahead of the requirement.",
      },
      {
        question: "Does ENVRT support French Eco-Score ratings?",
        answer:
          "Yes. All plans include French Eco-Score ratings calculated using the official environmental labelling methodology. You can calculate scores for your garments and display them on your DPPs.",
      },
      {
        question: "Can ENVRT data be used for CSRD Scope 3 reporting?",
        answer:
          "Yes. The product-level emissions data ENVRT generates provides the building blocks for corporate Scope 3 reporting. The same dataset that supports DPP disclosure also feeds corporate emissions calculations, following the \u201cmeasure once, report everywhere\u201d principle.",
      },
      {
        question: "Can ENVRT help substantiate green claims?",
        answer:
          "Yes. ENVRT provides per-garment environmental data assessed using ISO 14040 and PEFCR methodology. This gives brands documented, product-specific evidence to back up sustainability marketing claims, aligned with the methodologies that the EU Green Claims Directive and UK CMA Green Claims Code reference.",
      },
    ],
  },
];

// Flatten for schema
const allFaqItems = faqSections.flatMap((s) => s.items);

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Frequently Asked Questions | ENVRT",
  description:
    "Answers to common questions about ENVRT, Digital Product Passports, product-level LCA, pricing, onboarding and EU textile compliance.",
  keywords: [
    "ENVRT FAQ",
    "digital product passport FAQ",
    "fashion LCA questions",
    "DPP compliance questions",
    "ENVRT pricing",
    "sustainability data FAQ",
  ],
  openGraph: {
    title: "Frequently Asked Questions | ENVRT",
    description:
      "Answers to common questions about ENVRT, Digital Product Passports, product-level LCA, pricing, onboarding and EU textile compliance.",
    url: "https://envrt.com/faq",
    type: "website",
  },
  alternates: {
    canonical: "https://envrt.com/faq",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FAQPage() {
  return (
    <div className="pt-28 pb-16">
      <FAQJsonLd items={allFaqItems} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://envrt.com" },
          { name: "FAQ", url: "https://envrt.com/faq" },
        ]}
      />

      <Container>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-envrt-charcoal sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-base text-envrt-muted sm:text-lg">
            Everything you need to know about ENVRT, Digital Product Passports
            and product-level sustainability data.
          </p>

          {faqSections.map((section) => (
            <div key={section.heading} className="mt-12">
              <h2 className="text-xl font-semibold text-envrt-charcoal">
                {section.heading}
              </h2>
              <div className="mt-4">
                <Accordion items={section.items} />
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="mt-16 rounded-2xl border border-envrt-teal/10 bg-envrt-teal/5 p-6 text-center sm:p-8">
            <p className="text-lg font-semibold text-envrt-charcoal">
              Still have questions?
            </p>
            <p className="mt-2 text-sm text-envrt-muted">
              Get in touch and we will walk you through the platform.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-block rounded-full bg-envrt-teal px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-envrt-teal/90"
            >
              Contact us
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

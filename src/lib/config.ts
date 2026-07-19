export const siteConfig = {
  name: "ENVRT",
  tagline: "Digital Product Passports in minutes, not months.",
  description:
    "Digital Product Passports, lifecycle metrics and sustainability analytics, all in one place. Fast and simple.",
  url: "https://envrt.com",
  dashboardUrl: "https://dashboard.envrt.com",
  dppDemoUrl: "https://dpp.envrt.com/envrt/demo-garments/hoodie-0509-1882",
  dppDemoEmbedUrl: "https://dpp.envrt.com/envrt/demo-garments/hoodie-0509-1882/embed",
  contact: {
    email: "info@envrt.com",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/envrt/",
    instagram: "https://www.instagram.com/weareenvrt/",
  },
};

export const navLinks = [
  { label: "Are you ready?", href: "/assessment" },
  { label: "Collective", href: "/collective" },
  { label: "Why ENVRT?", href: "/roi" },
  { label: "Free DPP", href: "/free-dpp" },
  { label: "Pricing", href: "/pricing" },
  { label: "Insights", href: "/insights" },
];

export const heroContent = {
  badge: "Onboard in 30 minutes. Generate DPPs today.",
  headline: "Your GARMENTS.\nTheir IMPACT.\nOne PLATFORM.",
  subheadline:
    "Create regulation-ready Digital Product Passports. Calculate emissions, water scarcity and French Eco-Score ratings. Share it all with your customers.",
  ctaPrimary: { label: "Book a demo", href: "/contact" },
  ctaSecondary: { label: "View example DPP", href: "/collective" },
};

export const whyNowCards = [
  {
    icon: "📋",
    title: "Regulation is here",
    description:
      "The EU Digital Product Passport mandate is rolling out. Brands need to be ready now, not next year.",
  },
  {
    icon: "🌍",
    title: "Consumers demand transparency",
    description:
      "Consumers increasingly say they are willing to pay more for sustainably produced or sourced goods. Give them clear, evidence-backed product information.",
  },
  {
    icon: "⚡",
    title: "Complex doesn't mean slow",
    description:
      "Lifecycle assessments used to take months. With ENVRT, brands onboard in under 30 minutes and can generate their first DPP the same day.",
  },
  {
    icon: "📊",
    title: "Data you can actually use",
    description:
      "Turn raw supply chain data into compelling, shareable sustainability metrics your customers understand.",
  },
];

export const howItWorksSteps = [
  {
    id: "collect",
    verb: "Collect",
    title: "Gather your supply chain data",
    description:
      "Input your garment details: materials, suppliers and manufacturing processes. Our guided forms make it straightforward.",
    bullets: [
      "Guided data entry with smart defaults",
      "Support for complex multi-material garments",
      "Supply chain reconstruction from your existing data",
    ],
    mockImage: "/mock/howitworks-collect.png",
  },
  {
    id: "assess",
    verb: "Assess",
    title: "Assess data and evidence",
    description:
      "Assess submitted product data and supporting evidence uploads for completeness and consistency. We flag gaps and anomalies, so your DPP outputs are built on strong foundations.",
    bullets: [
      "Automated completeness checks",
      "Anomaly detection and flagging",
      "Clear guidance on missing data",
    ],
    mockImage: "/mock/howitworks-assess.png",
  },
  {
    id: "calculate",
    verb: "Calculate",
    title: "Environmental metrics, calculated",
    description:
      "We compute CO₂e emissions and water scarcity footprints across the full garment lifecycle, from fibre to finished product.",
    bullets: [
      "Full lifecycle CO\u2082e assessment",
      "Water scarcity (AWARE method)",
      "French Eco-Score (co\u00fbt environnemental)",
      "Comparison against category benchmarks",
    ],
    mockImage: "/mock/howitworks-calculate.png",
  },
  {
    id: "publish",
    verb: "Publish",
    title: "Share with the world",
    description:
      "Generate regulation-ready Digital Product Passports and embed sustainability widgets on your product pages.",
    bullets: [
      "Regulation-ready DPP generation",
      "Embeddable product widgets",
      "Shareable sustainability reports",
    ],
    mockImage: "/mock/howitworks-publish.png",
  },
];

export const outcomeCards = [
  {
    stat: "100%",
    title: "Regulation-ready from day one",
    description:
      "Your DPPs are aligned with the EU ESPR framework and include French Eco-Score ratings as standard.",
    cta: { label: "Read the FAQ", href: "/faq" },
  },
  {
    stat: "< 1 day",
    title: "Your first DPP can be live today",
    description:
      "No consultants and no months of setup. Our streamlined process means your first passport can be live the same day you start.",
    cta: { label: "Get a free DPP", href: "/free-dpp" },
  },
  {
    stat: "Product-level",
    title: "Metrics your customers can see",
    description:
      "CO₂e, water scarcity and transparency data attached to the product itself. Not buried in a brand report nobody reads.",
    cta: { label: "See live examples", href: "/collective" },
  },
  {
    stat: "Beyond the tick-box",
    title: "Turn data into decisions",
    description:
      "Compare materials, spot hotspots and benchmark products. Use the same data that powers your DPPs to make smarter sourcing choices.",
    cta: { label: "Try the ROI calculator", href: "/roi" },
  },
];

import { PRICING_CONFIG, type PlanName as ConfigPlanName, type Currency as ConfigCurrency } from "../../config/pricing";
import { PLAN_PRICES, SITE_COMPARISON, SITE_PLAN_CARDS } from "./plans.generated";

export type PlanSlug = "starter" | "growth" | "pro";

export type Currency = "EUR" | "GBP" | "USD";
export type BillingPeriod = "monthly" | "annual";

// Per-currency monthly and "annual billing \u2014 per month equivalent" prices.
// Annual is the per-month-when-billed-annually figure, so the displayed
// amount on the pricing page card is consistent regardless of the toggle.
export type PriceMatrix = Record<
  Currency,
  { monthly: number; annual: number }
>;

/**
 * Build a display PriceMatrix for a plan by deriving from the canonical
 * Stripe amounts in config/pricing.ts. This guarantees the pricing page
 * shows exactly what Stripe will charge \u2014 no drift between marketing
 * copy and checkout.
 *
 * Stripe stores integer minor units (pence/cents), divide by 100 for
 * whole units. Annual rounds the per-month-when-billing-annually figure.
 */
function displayPricesFor(plan: ConfigPlanName): PriceMatrix {
  const cfg = PRICING_CONFIG.prices[plan];
  const map: { display: Currency; cfg: ConfigCurrency }[] = [
    { display: "EUR", cfg: "eur" },
    { display: "GBP", cfg: "gbp" },
    { display: "USD", cfg: "usd" },
  ];
  return map.reduce((acc, { display, cfg: c }) => {
    acc[display] = {
      monthly: Math.round(cfg.monthly[c] / 100),
      annual: Math.round(cfg.annual[c] / 100 / 12),
    };
    return acc;
  }, {} as PriceMatrix);
}

export interface PricingPlan {
  slug: PlanSlug;
  name: string;
  subheading: string;
  prices?: PriceMatrix;
  /** Deprecated. Kept for v1 surfaces that still read priceGBP; v3 reads
   *  prices[currency][billing] via the PricingContext. */
  priceGBP?: number;
  customPricing?: boolean;
  customSubline?: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  EUR: "\u20ac",
  GBP: "\u00a3",
  USD: "$",
};

// Default currency for new visitors. EUR \u2014 the largest target market
// for ENVRT post-2027 ESPR.
export const DEFAULT_CURRENCY: Currency = "EUR";
export const DEFAULT_BILLING: BillingPeriod = "monthly";

// Pricing content derived from the canonical plans source of truth
// (envrt-dashboard/lib/plans/plans.ts, synced here as plans.generated.ts).
// To change prices or card content, edit the canonical file and run
// `npm run sync:plans` in envrt-dashboard. Price changes also need
// `npm run stripe:sync` here afterwards.
export const pricingPlans: PricingPlan[] = [
  {
    slug: "starter",
    name: "Starter",
    prices: displayPricesFor("starter"),
    priceGBP: PLAN_PRICES.starter.monthly.gbp / 100,
    ...SITE_PLAN_CARDS.starter,
  },
  {
    slug: "growth",
    name: "Growth",
    prices: displayPricesFor("growth"),
    priceGBP: PLAN_PRICES.growth.monthly.gbp / 100,
    ...SITE_PLAN_CARDS.growth,
  },
  {
    slug: "pro",
    name: "Pro",
    ...SITE_PLAN_CARDS.pro,
  },
];

export const pricingComparison = SITE_COMPARISON;

export const faqItems = [
  {
    question: "How long does it take to create a DPP?",
    answer:
      "Most brands onboard in around 30 minutes. Once set up, generating each DPP takes just minutes. Our guided data entry and automated calculations do the heavy lifting.",
  },
  {
    question: "What data do I need to get started?",
    answer:
      "At minimum, you'll need your garment's material composition and country of manufacture. The more supply chain detail you can provide (fibre origin, dyeing process, assembly location), the richer your DPP will be.",
  },
  {
    question: "Can I embed DPPs on my own website?",
    answer:
      "Yes. On Growth and Pro plans, you get embeddable widgets that display sustainability metrics directly on your product pages, styled to match your brand.",
  },
  {
    question: "How are the environmental metrics calculated?",
    answer:
      "We use established lifecycle assessment (LCA) methodologies. CO₂e is calculated across the full garment lifecycle. Water scarcity uses the AWARE characterisation method with region-specific factors.",
  },
  {
    question: "Can I try ENVRT before committing?",
    answer:
      "Absolutely. Book a demo and we'll walk you through the platform with your own product data. No commitment required.",
  },
];

export const pricingFaqItems = [
  {
    question: "How much does a Digital Product Passport cost?",
    answer:
      "ENVRT offers three plans: Starter at £149/month for up to 50 products/SKUs, Growth at £495/month for up to 250 products/SKUs with LCA metrics, and Pro on custom pricing for brands needing more than 250 SKUs, advanced PEF-aligned metrics or dedicated support. Contact sales for a Pro quote.",
  },
  {
    question: "What's included in each ENVRT plan?",
    answer:
      "Starter includes 1 team seat, DPP creation, QR-ready passport pages, transparency scores, CO\u2082e and AWARE water indicators, French Eco-Score ratings and compliance exports. Growth adds 5 team seats, expanded product data, core LCA metrics, AI-powered data ingestion, hotspot detection, product comparisons, DPP scan and engagement analytics and metrics exports. Pro includes unlimited team seats, complete PEF-aligned metrics, advanced modelling, seasonal reports, eco-design strategy and a dedicated account specialist.",
  },
  {
    question: "Can I switch plans?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    question: "Can I see a demo before signing up?",
    answer:
      "Yes, book a demo and we'll walk you through the platform with your own product data. No commitment required.",
  },
  {
    question: "Do you offer annual billing?",
    answer:
      "Yes, annual billing saves 15% on Starter and Growth compared to monthly pricing.",
  },
  {
    question: "Do you support the French Eco-Score (affichage environnemental)?",
    answer:
      "Yes. All plans include French Eco-Score ratings calculated following the official co\u00fbt environnemental methodology. You can calculate scores for your garments and display them on your DPPs.",
  },
];

export const roiFaqItems = [
  {
    question: "How much does DPP compliance cost?",
    answer:
      "The cost depends on your approach. Hiring a sustainability consultant typically starts from £30,000 per year. Building an in-house team starts from £80,000 annually. ENVRT provides DPP creation, lifecycle metrics and sustainability analytics from £149 per month.",
  },
  {
    question: "How long does it take to see ROI with ENVRT?",
    answer:
      "Most brands see value quickly. ENVRT's guided data entry and automated calculations mean you can generate your first DPP in minutes, reducing the cost and time of compliance.",
  },
  {
    question: "Can ENVRT replace a sustainability consultant?",
    answer:
      "For DPP creation, lifecycle assessment metrics and supply chain transparency, ENVRT covers what most brands would otherwise pay a consultant for. The Pro plan includes a dedicated account specialist, supplier follow-up assistance and eco-design strategy support.",
  },
  {
    question: "How does the ROI calculator work?",
    answer:
      "Input your current team size, product volume and approach to sustainability reporting. The calculator instantly compares your costs against ENVRT's plans and shows your potential savings over 12 months.",
  },
];

export const freeDppFaqItems = [
  {
    question: "What is the free eco-score DPP?",
    answer:
      "It's a real Digital Product Passport for one of your products showing its environmental score. Free, no account needed.",
  },
  {
    question: "What do I need to fill in?",
    answer:
      "Basic product details: garment type, main material, weight and where it's assembled. Takes about 2 minutes.",
  },
  {
    question: "How do I receive my DPP?",
    answer:
      "We'll email you a link to your live eco-score DPP within 24 hours of submitting.",
  },
  {
    question: "What does the eco-score show?",
    answer:
      "A standardised environmental impact score based on your product's materials and manufacturing, following the official French environmental labelling methodology.",
  },
  {
    question: "What if I want full DPPs for my whole collection?",
    answer:
      "Get in touch after receiving your trial DPP. We offer full lifecycle DPPs with supply chain mapping, emissions data and water impact at collection level.",
  },
];

/** @deprecated Use freeDppFaqItems */
export const assessmentFaqItems = freeDppFaqItems;

export const readinessAssessmentFaqItems = [
  {
    question: "What is the ENVRT DPP Readiness Assessment?",
    answer:
      "A free 10-minute structured assessment that scores your brand across four dimensions of Digital Product Passport readiness: supply chain transparency, product data completeness, regulatory awareness and data infrastructure. It produces a personalised report covering your overall readiness, dimension-specific scores, timeline risk and recommended next steps.",
  },
  {
    question: "Who should take the DPP Readiness Assessment?",
    answer:
      "Any apparel, footwear or textile brand selling into the EU, UK or US that needs to understand its exposure to the ESPR, UK DMCCA sustainability provisions or the EU Green Claims Directive. The assessment is calibrated for SME and mid-market fashion brands but works for any brand size.",
  },
  {
    question: "How long does the assessment take to complete?",
    answer:
      "Around 10 minutes for 25 questions across five sections. Results are generated immediately and a full report is emailed within minutes.",
  },
  {
    question: "Is the DPP Readiness Assessment free?",
    answer:
      "Yes. The assessment is free and does not require an account. An email address is required so the personalised report can be sent.",
  },
  {
    question: "How is the readiness score calculated?",
    answer:
      "Each answer carries a weighted score across four dimensions. Supply chain transparency and product data completeness each weight 30 per cent of the overall score. Regulatory awareness and data infrastructure each weight 20 per cent. The overall score is mapped to one of five bands from Critical Exposure to Advanced.",
  },
  {
    question: "What do I receive after completing the assessment?",
    answer:
      "An on-screen results page with your overall score, dimension scores, timeline risk note and prioritised recommended actions, plus a full HTML report by email. The report includes a green claims risk flag if your brand markets sustainability claims without verified product-level data.",
  },
];

export const teamMembers = [
  {
    name: "Charles Woolwich",
    role: "Founder & CEO",
    type: "founder" as const,
    email: "charlie@envrt.com",
    photoPath: "/v3-assets/team/charlie.jpg",
    bullets: [
      "Environmental systems specialist with experience leading sustainability strategy across large-scale infrastructure",
      "Former Environmental Lead for large-scale, multidisciplinary developments across Europe",
      "Expert in implementing data-driven sustainability strategies for complex, high-impact projects",
      "Now driving ENVRT's mission to bring data-backed sustainability to fashion",
    ],
  },
  {
    name: "Oliver Woodcock",
    role: "Founder & CTO",
    type: "founder" as const,
    email: "oliver@envrt.com",
    photoPath: "/v3-assets/team/oliver.jpg",
    bullets: [
      "Astrophysicist and published researcher with over a decade of programming experience",
      "Specialist in building advanced data pipelines and extracting insights from complex datasets",
      "Formerly focused on large-scale scientific computing and machine learning in academic and technical environments",
      "Now leading ENVRT's sustainability engine to transform how fashion measures impact",
    ],
  },
  {
    name: "Dr Edward Hirst",
    role: "AI Methodology Advisor",
    type: "advisor" as const,
    bullets: [
      "Academic research fellow in applied artificial intelligence",
      "Over 10 years of peer-reviewed research focused on novel AI methodologies",
      "Expertise in advanced analytical frameworks, including information-geometric methods",
      "Advises ENVRT on AI methodology, model foundations and long-term technical robustness",
    ],
  },
  {
    name: "Dr Matthew Cheng",
    role: "AI & Product Intelligence Advisor",
    type: "advisor" as const,
    bullets: [
      "Space physicist and data scientist with academic and industry publications",
      "Specialist in machine-learning models for customer behaviour, personalisation and product intelligence",
      "Experience designing and deploying applied AI systems across multiple commercial sectors",
      "Advises ENVRT on applied AI, intelligent product systems and platform-level analytics",
    ],
  },
];

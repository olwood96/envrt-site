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
};

export const navLinks = [
  { label: "Product", href: "/#how-it-works" },
  { label: "Collective", href: "/collective" },
  { label: "Why ENVRT?", href: "/roi" },
  { label: "Assessment", href: "/assessment" },
  { label: "Pricing", href: "/pricing" },
  { label: "Insights", href: "/insights" },
];

export const heroContent = {
  badge: "Onboard in 30 minutes. Generate DPPs today.",
  headline: "Your GARMENTS.\nTheir IMPACT.\nOne PLATFORM.",
  subheadline:
    "Create regulation-ready Digital Product Passports, calculate CO₂e and water scarcity metrics and share sustainability data with your customers, all in one place.",
  ctaPrimary: { label: "Book a demo", href: "/contact" },
  ctaSecondary: { label: "View example DPP", href: "/demo" },
  videoLabel: "Example Digital Product Passport",
  videoSrc: "/videos/dpp-demo.mp4",
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
      "Consumers say they will pay an average of 9.7% more for sustainably produced or sourced goods. Give them clear, evidence-backed product information.",
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
      "Bulk upload for large collections",
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
      "Full lifecycle CO₂e assessment",
      "Water scarcity (AWARE method)",
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
      "Your DPPs meet EU ESPR requirements out of the box. No second-guessing whether you're compliant.",
    cta: { label: "See how it works", href: "/#how-it-works" },
  },
  {
    stat: "< 1 day",
    title: "Your first DPP can be live today",
    description:
      "No consultants and no months of setup. Our streamlined process means your first passport can be live the same day you start.",
    cta: { label: "Take the assessment", href: "/assessment" },
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
    cta: { label: "See pricing", href: "/pricing" },
  },
];

export type PlanSlug = "starter" | "growth" | "pro";

export interface PricingPlan {
  slug: PlanSlug;
  name: string;
  subheading: string;
  priceGBP: number;
  description: string;
  features: string[];
  highlighted: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    slug: "starter",
    name: "Starter",
    subheading: "Your DPP Hub",
    priceGBP: 149,
    description: "Regulation-ready Digital Product Passports. Perfect for getting started with trusted product disclosure.",
    features: [
      "Up to 50 products/SKUs",
      "QR-ready passport pages",
      "Transparency score per product",
      "Evidence uploads and product documentation",
      "Auto-generated disclosures and templates",
      "CO\u2082e and AWARE water scarcity indicators",
      "Fibre-to-assembly supply chain reconstruction",
      "DPP scan and engagement analytics",
      "Email support with onboarding call",
    ],
    highlighted: false,
  },
  {
    slug: "growth",
    name: "Growth",
    subheading: "Your Impact Analyst",
    priceGBP: 495,
    description: "Sustainability metrics and insights. Built for brands that need credible lifecycle outputs.",
    features: [
      "Up to 250 products/SKUs",
      "Expanded product data in DPP",
      "Core LCA metrics beyond indicators",
      "Process-level supply chain reconstruction",
      "Hotspot detection across lifecycle stages",
      "Product comparisons",
      "AI-powered data ingestion",
      "Entry-level decarbonisation guidance",
      "Stage-linked evidence library",
      "Hotspot insights with reduction opportunities",
      "Collection summaries with CSV/PDF exports",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    slug: "pro",
    name: "Pro",
    subheading: "Your Sustainability Team",
    priceGBP: 1295,
    description:
      "A hands-on plan that replaces the need for an internal sustainability team. Built for scale and supplier complexity.",
    features: [
      "Custom product/SKU allocation",
      "Complete PEF-aligned metrics",
      "Advanced modelling and optimisation frameworks",
      "Seasonal product-line impact reports",
      "Eco-design strategy and claims support",
      "Dedicated account specialist",
      "Supplier follow-up and data-chasing assistance",
      "Fast-response SLA with weekly reviews",
    ],
    highlighted: false,
  },
];

export const pricingComparison = {
  categories: [
    {
      name: "DPP Creation",
      features: [
        { name: "Product/SKU allocation", starter: "Up to 50", growth: "Up to 250", pro: "Custom" },
        { name: "QR-ready passport pages", starter: true, growth: true, pro: true },
        { name: "Multi-language DPP pages", starter: true, growth: true, pro: true },
        { name: "Expanded product data in DPP", starter: false, growth: true, pro: true },
        { name: "Auto-generated disclosures and templates", starter: true, growth: true, pro: true },
        { name: "AI-powered data ingestion", starter: false, growth: true, pro: true },
      ],
    },
    {
      name: "Transparency and Evidence",
      features: [
        { name: "Transparency score per product", starter: true, growth: true, pro: true },
        { name: "Evidence uploads and product documentation", starter: true, growth: true, pro: true },
        { name: "Stage-linked evidence library", starter: false, growth: true, pro: true },
      ],
    },
    {
      name: "Supply Chain Modelling",
      features: [
        { name: "Fibre-to-assembly supply chain reconstruction", starter: true, growth: true, pro: true },
        { name: "Process-level supply chain reconstruction", starter: false, growth: true, pro: true },
        { name: "Advanced modelling and optimisation frameworks", starter: false, growth: false, pro: true },
      ],
    },
    {
      name: "Metrics",
      features: [
        { name: "CO\u2082e indicators", starter: true, growth: true, pro: true },
        { name: "AWARE water scarcity indicators", starter: true, growth: true, pro: true },
        { name: "Core LCA metrics beyond indicators", starter: false, growth: true, pro: true },
        { name: "Complete PEF-aligned metrics", starter: false, growth: false, pro: true },
      ],
    },
    {
      name: "Dashboard and Insights",
      features: [
        { name: "DPP scan and engagement analytics", starter: true, growth: true, pro: true },
        { name: "Hotspot detection across lifecycle stages", starter: false, growth: true, pro: true },
        { name: "Hotspot insights with reduction opportunities", starter: false, growth: true, pro: true },
        { name: "Product comparisons", starter: false, growth: true, pro: true },
        { name: "Collection summaries with CSV/PDF exports", starter: false, growth: true, pro: true },
        { name: "Seasonal product-line impact reports", starter: false, growth: false, pro: true },
      ],
    },
    {
      name: "Strategy and Decarbonisation",
      features: [
        { name: "Entry-level decarbonisation guidance", starter: false, growth: true, pro: true },
        { name: "Eco-design strategy and claims support", starter: false, growth: false, pro: true },
      ],
    },
    {
      name: "Support",
      features: [
        { name: "Email support", starter: true, growth: true, pro: true },
        { name: "Onboarding call", starter: true, growth: true, pro: true },
        { name: "Priority support", starter: false, growth: true, pro: true },
        { name: "Supplier follow-up and data-chasing assistance", starter: false, growth: false, pro: true },
        { name: "Dedicated account specialist", starter: false, growth: false, pro: true },
        { name: "Weekly reviews", starter: false, growth: false, pro: true },
        { name: "Fast-response SLA", starter: false, growth: false, pro: true },
      ],
    },
  ],
} as const;

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
      "ENVRT offers three plans: Starter at £149/month for up to 50 products/SKUs, Growth at £495/month for up to 250 products/SKUs with LCA metrics, and Pro at £1,295/month with custom allocation and dedicated support.",
  },
  {
    question: "What's included in each ENVRT plan?",
    answer:
      "Starter includes DPP creation, QR-ready passport pages, transparency scores, CO₂e indicators, and DPP scan analytics. Growth adds expanded product data, core LCA metrics, AI-powered data ingestion, hotspot detection, and product comparisons. Pro includes complete PEF-aligned metrics, advanced modelling, seasonal reports, eco-design strategy, and a dedicated account specialist.",
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
      "Yes, annual billing saves you 15% compared to monthly pricing across all plans.",
  },
];

export const roiFaqItems = [
  {
    question: "How much does DPP compliance cost?",
    answer:
      "The cost depends on your approach. Hiring a sustainability consultant typically costs £30,000 or more per year. Building an in-house team starts at around £80,000 annually. ENVRT provides DPP creation, lifecycle metrics, and sustainability analytics from just £149 per month.",
  },
  {
    question: "How long does it take to see ROI with ENVRT?",
    answer:
      "Most brands see value within the first month. ENVRT's guided data entry and automated calculations mean you can generate your first DPP in minutes rather than weeks, dramatically reducing the cost and time of compliance.",
  },
  {
    question: "What's the cost of non-compliance with DPP regulations?",
    answer:
      "Non-compliance with the EU Ecodesign for Sustainable Products Regulation (ESPR) could mean loss of EU market access, financial penalties, and reputational damage. Preparing now avoids last-minute costs and positions your brand as a transparency leader.",
  },
  {
    question: "Can ENVRT replace a sustainability consultant?",
    answer:
      "For DPP creation, lifecycle assessment metrics, and supply chain transparency, yes. The Pro plan includes a dedicated account specialist, supplier follow-up assistance, and eco-design strategy support, covering much of what an external consultant would provide.",
  },
  {
    question: "How does the ROI calculator work?",
    answer:
      "Input your current team size, product volume, and approach to sustainability reporting. The calculator instantly compares your costs against ENVRT's plans and shows your potential savings over 12 months.",
  },
];

export const assessmentFaqItems = [
  {
    question: "How long does the DPP readiness assessment take?",
    answer:
      "The assessment takes approximately 10 minutes to complete. You'll receive an instant personalised report with your DPP readiness score and recommended next steps.",
  },
  {
    question: "What do I need to complete the assessment?",
    answer:
      "Just a basic understanding of your supply chain and current sustainability practices. No detailed data or technical knowledge is required.",
  },
  {
    question: "Is the DPP readiness assessment free?",
    answer:
      "Yes, the assessment is completely free with no obligation. You'll receive an instant personalised report highlighting your readiness level, key gaps, and actionable next steps.",
  },
  {
    question: "What will I learn from the assessment?",
    answer:
      "You'll receive a DPP readiness score, a breakdown of where your brand stands across key compliance areas, identification of gaps in your current processes, and prioritised recommendations for getting regulation-ready.",
  },
  {
    question: "Do I need to share sensitive business data?",
    answer:
      "No. The assessment only asks for high-level information about your processes and supply chain approach. No proprietary supplier details or financial data is required.",
  },
];

export const teamMembers = [
  {
    name: "Charles Woolwich",
    role: "Founder & CEO",
    type: "founder" as const,
    email: "charlie@envrt.com",
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

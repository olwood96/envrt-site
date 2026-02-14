export const siteConfig = {
  name: "ENVRT",
  tagline: "Sustainability intelligence for fashion.",
  description:
    "Digital Product Passports, lifecycle metrics and sustainability analytics, all in one place. Fast and simple.",
  url: "https://envrt.com",
  contact: {
    email: "hello@envrt.com",
  },
};

export const navLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Demo", href: "/demo" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

export const heroContent = {
  badge: "The Infrastructure Layer For Product Transparency",
  headline: "Your GARMENTS.\nTheir IMPACT.\nOne PLATFORM.",
  subheadline:
    "Create regulation-ready Digital Product Passports, calculate CO₂e and water scarcity metrics and share sustainability data with your customers, all in one place.",
  ctaPrimary: { label: "Book a demo", href: "/contact" },
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
      "Lifecycle assessments used to take months. We've reduced that to under an hour per product.",
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
    mockImage: "/mock/howitworks-collect.mp4",
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
    mockImage: "/mock/howitworks-calculate.mp4",
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
    title: "Regulation-ready product passports",
    description:
      "Prepare for upcoming EU requirements with Digital Product Passports built for the latest data standards.",
    icon: "✓",
  },
  {
    title: "Clear environmental metrics",
    description:
      "Understand the true CO₂e and water footprint of every garment, from raw fibre to finished product.",
    icon: "◎",
  },
  {
    title: "Stories that sell",
    description:
      "Turn sustainability data into compelling narratives your customers can see right on the product page.",
    icon: "◈",
  },
  {
    title: "Faster decision-making",
    description:
      "Compare materials, suppliers and processes at a glance to make smarter sourcing decisions.",
    icon: "↗",
  },
];

export interface PricingPlan {
  name: string;
  subheading: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    subheading: "Your DPP Hub",
    price: "£299",
    period: "/month",
    description: "Everything you need to create and manage Digital Product Passports.",
    features: [
      "Up to 50 DPPs per month",
      "CO₂e & water metrics",
      "Standard DPP templates",
      "CSV data upload",
      "Email support",
      "1 team member",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Growth",
    subheading: "Your Impact Analyst",
    price: "£699",
    period: "/month",
    description: "Advanced analytics and comparison tools for growing brands.",
    features: [
      "Up to 250 DPPs per month",
      "CO₂e & water metrics",
      "Custom DPP branding",
      "Bulk data upload & API access",
      "Category benchmarking",
      "Embeddable product widgets",
      "Priority support",
      "5 team members",
    ],
    cta: "Get started",
    highlighted: true,
  },
  {
    name: "Pro",
    subheading: "Your Sustainability Team",
    price: "£1,499",
    period: "/month",
    description:
      "A dedicated sustainability partnership. We handle complexity so you can focus on your brand.",
    features: [
      "Unlimited DPPs",
      "Full lifecycle analysis",
      "Custom DPP branding & white-label",
      "Dedicated onboarding & data ingestion",
      "Advanced sourcing comparisons",
      "Custom reporting & exports",
      "Dedicated account manager",
      "Unlimited team members",
      "SLA & priority support",
    ],
    cta: "Talk to us",
    highlighted: false,
  },
];

export const pricingComparison = {
  categories: [
    {
      name: "DPP Creation",
      features: [
        { name: "Monthly DPP limit", starter: "50", growth: "250", pro: "Unlimited" },
        { name: "Custom branding", starter: false, growth: true, pro: true },
        { name: "White-label DPPs", starter: false, growth: false, pro: true },
        { name: "DPP templates", starter: "Standard", growth: "Standard + Custom", pro: "Fully custom" },
      ],
    },
    {
      name: "Analytics",
      features: [
        { name: "CO₂e metrics", starter: true, growth: true, pro: true },
        { name: "Water scarcity (AWARE)", starter: true, growth: true, pro: true },
        { name: "Category benchmarking", starter: false, growth: true, pro: true },
        { name: "Sourcing comparisons", starter: false, growth: false, pro: true },
        { name: "Custom reports", starter: false, growth: false, pro: true },
      ],
    },
    {
      name: "Integration",
      features: [
        { name: "CSV upload", starter: true, growth: true, pro: true },
        { name: "Bulk upload", starter: false, growth: true, pro: true },
        { name: "API access", starter: false, growth: true, pro: true },
        { name: "Embeddable widgets", starter: false, growth: true, pro: true },
        { name: "Dedicated data ingestion", starter: false, growth: false, pro: true },
      ],
    },
    {
      name: "Support",
      features: [
        { name: "Email support", starter: true, growth: true, pro: true },
        { name: "Priority support", starter: false, growth: true, pro: true },
        { name: "Dedicated account manager", starter: false, growth: false, pro: true },
        { name: "SLA", starter: false, growth: false, pro: true },
        { name: "Team members", starter: "1", growth: "5", pro: "Unlimited" },
      ],
    },
  ],
};

export const faqItems = [
  {
    question: "How long does it take to create a DPP?",
    answer:
      "Most brands can go from raw supply chain data to a published Digital Product Passport in under an hour. Our guided data entry and automated calculations do the heavy lifting.",
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

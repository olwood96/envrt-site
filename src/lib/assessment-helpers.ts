export type ReadinessDimension =
  | "supplyChain"
  | "productData"
  | "regulatory"
  | "infrastructure";

export type ReadinessBand =
  | "critical"
  | "early"
  | "developing"
  | "compliance-ready"
  | "advanced";

export interface DimensionScores {
  supplyChain: number;
  productData: number;
  regulatory: number;
  infrastructure: number;
}

export interface RecommendedLink {
  title: string;
  href: string;
  description: string;
}

const READING_BY_DIMENSION: Record<ReadinessDimension, RecommendedLink[]> = {
  supplyChain: [
    {
      title: "Supply Chain Intelligence: Turning Supplier Data Into Action",
      href: "/insights/supply-chain-intelligence-turning-data-into-action",
      description:
        "How to structure supplier data so it actually feeds product-level disclosure.",
    },
    {
      title: "Scope 3 Emissions in Fashion: Why Your Supply Chain Is 90% of the Problem",
      href: "/insights/scope-3-emissions-fashion-supply-chain",
      description:
        "Where supply chain emissions actually concentrate, and how to address them.",
    },
  ],
  productData: [
    {
      title: "Product-Level Data Is Now the EU's Default",
      href: "/insights/product-level-data-dpp-requirement",
      description:
        "Why brand-level claims will not satisfy the DPP framework and what product-level data looks like.",
    },
    {
      title: "Life Cycle Assessment for Fashion Brands: A Practical Guide",
      href: "/insights/life-cycle-assessment-guide-for-brands",
      description:
        "The methodology that turns raw supplier data into structured product-level outputs.",
    },
  ],
  regulatory: [
    {
      title: "EU Digital Product Passport for Textiles: What Fashion Brands Need to Know",
      href: "/insights/digital-product-passport-textiles-guide",
      description: "Timeline, scope and what the DPP will actually require.",
    },
    {
      title: "The EU Just Published Its DPP Data Methodology",
      href: "/insights/eu-dpp-data-methodology-fashion-brands",
      description:
        "Plain-English breakdown of the JRC methodology that shapes the textile delegated act.",
    },
  ],
  infrastructure: [
    {
      title: "Building a Business Case for Sustainability Data",
      href: "/insights/business-case-sustainability-data-fashion",
      description:
        "How to justify the platform investment internally and what the cost of waiting looks like.",
    },
    {
      title: "A DPP Without Credible Data Is Just a QR Code",
      href: "/insights/dpp-without-lca-data-quality",
      description:
        "Why the assessment methodology behind your DPP matters more than the QR code itself.",
    },
  ],
};

const GREEN_CLAIMS_READING: RecommendedLink[] = [
  {
    title: "What Is Greenwashing in Fashion? A Brand's Guide to Avoiding It",
    href: "/insights/greenwashing-in-fashion",
    description:
      "The claim types that carry the most regulatory risk and how to substantiate them.",
  },
  {
    title: "Green Claims in Fashion: How to Make Sustainability Marketing Credible",
    href: "/insights/green-claims-sustainability-marketing-fashion",
    description:
      "Practical framework for green claims under the EU Green Claims Directive and UK DMCCA.",
  },
];

const DIMENSION_LABEL_FOR_RECOMMENDATION: Record<ReadinessDimension, string> = {
  supplyChain: "supply chain transparency",
  productData: "product data completeness",
  regulatory: "regulatory awareness",
  infrastructure: "data infrastructure",
};

export function getReadingForWeakestDimension(
  scores: DimensionScores
): { dimension: ReadinessDimension; label: string; links: RecommendedLink[] } {
  const dims: { key: ReadinessDimension; score: number }[] = [
    { key: "supplyChain", score: scores.supplyChain },
    { key: "productData", score: scores.productData },
    { key: "regulatory", score: scores.regulatory },
    { key: "infrastructure", score: scores.infrastructure },
  ];
  const weakest = dims.reduce((acc, d) => (d.score < acc.score ? d : acc), dims[0]);
  return {
    dimension: weakest.key,
    label: DIMENSION_LABEL_FOR_RECOMMENDATION[weakest.key],
    links: READING_BY_DIMENSION[weakest.key],
  };
}

export function getGreenClaimsReading(): RecommendedLink[] {
  return GREEN_CLAIMS_READING;
}

export function bandFromOverall(overall: number): ReadinessBand {
  if (overall <= 25) return "critical";
  if (overall <= 45) return "early";
  if (overall <= 65) return "developing";
  if (overall <= 80) return "compliance-ready";
  return "advanced";
}

export interface BandCta {
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  framing: string;
}

export function getBandCta(band: ReadinessBand): BandCta {
  switch (band) {
    case "critical":
      return {
        primaryLabel: "Book an urgent compliance call",
        primaryHref: "/contact?topic=urgent-compliance",
        secondaryLabel: "Read the DPP guide",
        secondaryHref: "/insights/digital-product-passport-textiles-guide",
        framing:
          "Your exposure is significant. The fastest way to close the gap is a direct conversation about your specific products and timeline.",
      };
    case "early":
      return {
        primaryLabel: "See how to start with DPP",
        primaryHref: "/contact?topic=getting-started",
        secondaryLabel: "Read our practical guides",
        secondaryHref: "/insights",
        framing:
          "You have a workable starting point. The next step is structured data collection across your top products before scaling out.",
      };
    case "developing":
      return {
        primaryLabel: "Get a tailored DPP plan",
        primaryHref: "/contact?topic=tailored-plan",
        secondaryLabel: "Compare to ENVRT Collective brands",
        secondaryHref: "/collective",
        framing:
          "You are further along than most SMEs in fashion. A targeted plan will close the remaining gaps without unnecessary rework.",
      };
    case "compliance-ready":
      return {
        primaryLabel: "Talk to us about scaling",
        primaryHref: "/contact?topic=scaling",
        secondaryLabel: "See live DPPs on the Collective",
        secondaryHref: "/collective",
        framing:
          "Strong foundations. The opportunity now is to formalise and scale your DPP output without rebuilding what already works.",
      };
    case "advanced":
      return {
        primaryLabel: "Join the ENVRT Collective",
        primaryHref: "/collective",
        secondaryLabel: "Talk to our team",
        secondaryHref: "/contact?topic=collective",
        framing:
          "You are ahead of the curve. Joining the ENVRT Collective publishes your live product-level data alongside other leading brands.",
      };
  }
}

export interface BenchmarkContext {
  text: string;
  caveat: string;
}

export function getBenchmarkContext(band: ReadinessBand): BenchmarkContext {
  const caveat =
    "Indicative benchmark based on internal positioning of SME fashion brands; absolute percentile depends on cohort.";
  switch (band) {
    case "critical":
      return {
        text: "Your score sits in the lower band relative to SME fashion brands we have assessed. This is common for brands that have not yet started structured DPP preparation.",
        caveat,
      };
    case "early":
      return {
        text: "Your score sits below the typical SME fashion brand at this stage of DPP preparation, but the gap closes quickly with structured data work.",
        caveat,
      };
    case "developing":
      return {
        text: "Your score is broadly in line with the median SME fashion brand we have assessed. The dimensions where you scored lowest are where most brands at this stage benefit from targeted intervention.",
        caveat,
      };
    case "compliance-ready":
      return {
        text: "Your score is above the typical SME fashion brand. You are positioned ahead of most of the market on DPP readiness.",
        caveat,
      };
    case "advanced":
      return {
        text: "Your score is well above the typical SME fashion brand. You are positioned in the leading group on DPP readiness.",
        caveat,
      };
  }
}

export interface ShareableResult {
  overall: number;
  supplyChain: number;
  productData: number;
  regulatory: number;
  infrastructure: number;
  greenClaimsFlag: boolean;
}

export function encodeResultsToUrl(result: ShareableResult): string {
  const params = new URLSearchParams();
  params.set("o", String(result.overall));
  params.set("sc", String(result.supplyChain));
  params.set("pd", String(result.productData));
  params.set("ra", String(result.regulatory));
  params.set("in", String(result.infrastructure));
  if (result.greenClaimsFlag) params.set("gc", "1");
  return params.toString();
}

export function decodeResultsFromUrl(search: string): ShareableResult | null {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const keys = ["o", "sc", "pd", "ra", "in"] as const;
  if (keys.some((k) => params.get(k) === null)) return null;
  const parsed = keys.map((k) => Number(params.get(k)));
  if (parsed.some((n) => !Number.isFinite(n))) return null;
  if (parsed.some((n) => n < 0 || n > 100)) return null;
  const [o, sc, pd, ra, ins] = parsed;
  return {
    overall: o,
    supplyChain: sc,
    productData: pd,
    regulatory: ra,
    infrastructure: ins,
    greenClaimsFlag: params.get("gc") === "1",
  };
}

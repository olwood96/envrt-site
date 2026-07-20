// src/lib/plans.generated.ts
//
// ═══ GENERATED FILE — DO NOT EDIT ═══
//
// Canonical source: envrt-dashboard/lib/plans/plans.ts
// To change anything here, edit the canonical file and run
// `npm run sync:plans` in envrt-dashboard, then commit both repos.
// CI drift checks fail when the copies diverge.
//
// content-hash: 0c2aea02fe12ac07

// lib/plans/plans.ts
//
// ═══════════════════════════════════════════════════════════════════════════
// CANONICAL PLANS SOURCE OF TRUTH
// ═══════════════════════════════════════════════════════════════════════════
//
// One file declares what ENVRT sells: tiers, prices, limits, feature flags
// and the site's marketing rows. Everything that expresses plan reality reads
// from here:
//   - dashboard gating + billing UI  (via lib/billing/features.ts, a shim)
//   - agreement PDFs and invoices    (custom deals workflow)
//   - envrt-site pricing cards, comparison matrix and Stripe amounts
//     (via src/lib/plans.generated.ts, produced by `npm run sync:plans`)
//
// RULES
//   1. Change plan reality HERE first. Never edit the site's generated copy.
//   2. This file must stay dependency-free (no imports) so the sync script
//      can copy it verbatim into the site repo. A test enforces this.
//   3. Price fields changed? Run `npm run stripe:sync` in envrt-site after
//      syncing. Feature/tier changes need no Stripe work.
//   4. Mirror any structural change on the Notion page
//      "🎚️ Feature × Tier source of truth" (Engineering Conventions).
//
// Human-readable mirror: Notion → 📐 Engineering Conventions →
// 🎚️ Feature × Tier source of truth.

export const PLANS_VERSION = "2026-07-19";

// ── Tiers ─────────────────────────────────────────────────────────────────

export type Tier = "starter" | "growth" | "pro" | "custom";

export const TIER_VALUES: Tier[] = ["starter", "growth", "pro", "custom"];

export const TIER_LABELS: Record<Tier, string> = {
  starter: "Starter",
  growth: "Growth",
  pro: "Pro",
  custom: "Custom",
};

/**
 * Tier ordering. Tiers are strictly nested — Growth includes everything
 * Starter unlocks, Pro includes everything Growth unlocks — so a feature
 * belongs to a tier whenever that tier ranks at or above the feature's
 * `unlockedAt`. `custom` ranks with Starter: a custom brand starts from the
 * Starter baseline and an admin turns on whatever the deal includes.
 */
export const TIER_RANK: Record<Tier, number> = {
  starter: 0,
  growth: 1,
  pro: 2,
  custom: 0,
};

// ── Feature flags ─────────────────────────────────────────────────────────

export type FeatureCategory = "core" | "depth" | "strategic";

export interface FeatureDefinition {
  /** Label shown in admin editor and on lock screens */
  label: string;
  /** One-line description for context, shown as hover text or beneath the label */
  description: string;
  /** Used to group flags in admin editor and lock-screen messaging */
  category: FeatureCategory;
  /** Lowest tier that includes this feature in its default mix. Used for
   *  generating upgrade CTAs (e.g. "Upgrade to Growth to unlock metrics").
   *  null means "no standard tier includes this; only custom deals unlock it". */
  unlockedAt: Tier | null;
}

export const FEATURES = {
  show_overview: {
    label: "Overview dashboard",
    description: "Home dashboard with collection summary, key stats and recent activity.",
    category: "core",
    unlockedAt: "starter",
  },
  show_garments: {
    label: "Product catalogue",
    description: "Full SKU management: add, edit and review garments with per-product detail.",
    category: "core",
    unlockedAt: "starter",
  },
  show_dpps: {
    label: "DPP creation",
    description: "Publish QR-ready Digital Product Passport pages with auto-generated disclosures and transparency scores.",
    category: "core",
    unlockedAt: "starter",
  },
  show_evidence: {
    label: "Evidence library",
    description: "Upload and manage certifications, audit reports and supporting product documentation.",
    category: "core",
    unlockedAt: "starter",
  },
  show_collection_form: {
    label: "Data submission form",
    description: "Bulk SKU input via the structured collection submission form.",
    category: "core",
    unlockedAt: "starter",
  },
  show_metrics: {
    label: "LCA metrics",
    description: "Full lifecycle CO₂e, water scarcity and waste impact per garment, beyond the basic DPP indicators.",
    category: "depth",
    unlockedAt: "growth",
  },
  show_metrics_lifecycle: {
    label: "Lifecycle breakdown and hotspot detection",
    description: "Per-stage impact drilldown with hotspot identification and reduction opportunities across the supply chain.",
    category: "depth",
    unlockedAt: "growth",
  },
  show_suppliers: {
    label: "Supplier intelligence",
    description: "Process-level supply chain reconstruction with mapped suppliers and country-level breakdown.",
    category: "depth",
    unlockedAt: "growth",
  },
  show_analytics: {
    label: "DPP scan and engagement analytics",
    description: "Scan rate, dwell time, engagement depth and attribution data per DPP.",
    category: "depth",
    unlockedAt: "growth",
  },
  show_feedback: {
    label: "Customer feedback",
    description: "Post-scan brand ratings and qualitative feedback submitted by DPP end-users.",
    category: "depth",
    unlockedAt: "growth",
  },
  show_sustainability_report: {
    label: "Metrics and analytics exports",
    description: "Export LCA metrics, scan analytics and sustainability performance data as branded reports.",
    category: "depth",
    unlockedAt: "growth",
  },
  show_ai_ingestion: {
    label: "AI data ingestion",
    // Each extraction run has a real per-action cost (Claude API), so this
    // is enforced at Growth+, decided 18 July 2026. Admin callers bypass.
    description: "AI-powered autofill: extract garment data from product URLs and uploaded files in the collection form.",
    category: "depth",
    unlockedAt: "growth",
  },
  show_reports: {
    label: "Strategic reports",
    description: "Board-level summaries, seasonal product-line analysis and multi-year trend outputs.",
    category: "strategic",
    unlockedAt: "pro",
  },
  show_compliance_france: {
    label: "Regulatory compliance: France (AGEC)",
    // French Eco-Score ratings appear on all DPP pages regardless of this flag.
    // This flag gates the deeper AGEC compliance dashboard module (audit pack,
    // export tools). Manual rollout only until legal position is confirmed — ADR-2026-006.
    description: "AGEC compliance dashboard module with audit pack and compliance exports.",
    category: "strategic",
    unlockedAt: null,
  },
} as const satisfies Record<string, FeatureDefinition>;

export type FeatureFlag = keyof typeof FEATURES;

/** All feature flag keys, ordered for stable iteration */
export const FEATURE_KEYS: FeatureFlag[] = Object.keys(FEATURES) as FeatureFlag[];

export type BrandFeatures = Record<FeatureFlag, boolean>;

/** Build a tier's default feature set from the single `unlockedAt` source. */
export function defaultsForTier(tier: Tier): BrandFeatures {
  const out = {} as BrandFeatures;
  for (const key of FEATURE_KEYS) {
    const at = FEATURES[key].unlockedAt;
    out[key] = at !== null && TIER_RANK[tier] >= TIER_RANK[at];
  }
  return out;
}

/**
 * What each tier includes by default, derived from FEATURES[*].unlockedAt.
 * To move a feature between plans, change that feature's `unlockedAt` — the
 * defaults, upgrade CTAs, lock screens and the site matrix all update
 * together. Custom resolves to the Starter baseline; admin then turns on
 * whatever the deal includes.
 */
export const TIER_DEFAULTS: Record<Tier, BrandFeatures> = {
  starter: defaultsForTier("starter"),
  growth: defaultsForTier("growth"),
  pro: defaultsForTier("pro"),
  custom: defaultsForTier("custom"),
};

// ── Limits ────────────────────────────────────────────────────────────────

/**
 * A product/SKU and the DPP it generates are 1:1, so one ceiling per tier
 * governs both. `null` means unlimited and must be a DELIBERATE setting
 * (Pro, or a custom deal) — never an accident.
 */
export const TIER_PRODUCT_LIMITS: Record<Tier, number | null> = {
  starter: 50,
  growth: 250,
  pro: null, // unlimited (intentional)
  custom: null, // admin sets the per-brand override directly
};

export const TIER_SEAT_LIMITS: Record<Tier, number | null> = {
  starter: 1,
  growth: 5,
  pro: null,
  custom: null,
};

/**
 * The one rule every limit check should go through. A per-brand override
 * always wins; when it is absent (null/undefined) we fall back to the tier
 * baseline rather than treating "unset" as unlimited. A `null` return means
 * genuinely unlimited (both tier and override unset).
 */
export function effectiveLimit(
  tierLimit: number | null,
  override: number | null | undefined,
): number | null {
  return override === undefined || override === null ? tierLimit : override;
}

// ── Pricing (canonical Stripe amounts, integer minor units) ───────────────
//
// CHANGING A PRICE? Follow docs/pricing-change-runbook.md, one edit here,
// then sync:plans, stripe:sync and the Vercel env block. Every price claim
// on the site derives from these numbers, nothing is hardcoded elsewhere.
//
// Pro is NOT priced here. Pro is a custom-only tier handled via
// metadata.tier on bespoke Stripe products, not the self-serve price map.
//
// Annual is monthly x 12 x (1 - ANNUAL_DISCOUNT), pre-rounded so the
// displayed amount and the Stripe-charged amount always match exactly.
// EUR/USD monthly amounts are hand-rounded to clean figures near the
// GBP_TO_EUR / GBP_TO_USD guides; the annual relation then holds exactly
// per currency (a test enforces it).

export type PlanName = "starter" | "growth";
export type BillingInterval = "monthly" | "annual";
export type PriceCurrency = "gbp" | "eur" | "usd";

export const ANNUAL_DISCOUNT = 0.15;
/** Display-conversion guides, not exact multipliers (amounts are hand-rounded). */
export const GBP_TO_EUR = 1.18;
export const GBP_TO_USD = 1.27;

export interface StripeProductConfig {
  name: string;
  description: string;
  // metadata.plan is how the sync script identifies which Stripe product
  // belongs to which plan, instead of relying on names that can drift.
  metadata: { plan: PlanName };
}

export const STRIPE_PRODUCTS: Record<PlanName, StripeProductConfig> = {
  starter: {
    name: "ENVRT Starter",
    description: "Starter plan for fashion brands building their first DPPs.",
    metadata: { plan: "starter" },
  },
  growth: {
    name: "ENVRT Growth",
    description: "Growth plan for scaling fashion brands across collections.",
    metadata: { plan: "growth" },
  },
};

export const PLAN_PRICES: Record<PlanName, Record<BillingInterval, Record<PriceCurrency, number>>> = {
  starter: {
    // EUR-anchored at €249; GBP/USD hold the house conversion exactly
    // (EUR = GBP × 1.18 → 211 × 1.18 = 248.98 → 249; USD = GBP × 1.27 → 268).
    monthly: {
      gbp: 21100, // £211.00
      eur: 24900, // €249.00 (anchor)
      usd: 26800, // $268.00
    },
    annual: {
      gbp: 215220, // £2,152.20
      eur: 253980, // €2,539.80
      usd: 273360, // $2,733.60
    },
  },
  growth: {
    monthly: {
      gbp: 49500, // £495.00
      eur: 58500, // €585.00
      usd: 62900, // $629.00
    },
    annual: {
      gbp: 504900, // £5,049.00
      eur: 596700, // €5,967.00
      usd: 641580, // $6,415.80
    },
  },
};

// ── Site marketing content ────────────────────────────────────────────────
//
// The pricing-page tier cards and the feature comparison matrix. Marketing
// rows are promises, so they live beside the flags they promise: rows that
// map 1:1 to a dashboard flag carry a `flag` annotation (a test checks the
// reference is real). Rows without a flag are either delivered outside the
// dashboard (support, DPP page capabilities) or not yet enforced in code.

export interface SitePlanCard {
  subheading: string;
  description: string;
  features: string[];
  highlighted: boolean;
  customPricing?: boolean;
  customSubline?: string;
}

export const SITE_PLAN_CARDS: Record<"starter" | "growth" | "pro", SitePlanCard> = {
  starter: {
    subheading: "Your DPP Hub",
    description:
      "Regulation-ready Digital Product Passports. Perfect for getting started with trusted product disclosure.",
    features: [
      "Up to 50 products/SKUs",
      "1 team seat",
      "QR-ready passport pages",
      "Embeddable DPP widgets",
      "Transparency score per product",
      "Evidence uploads and product documentation",
      "Auto-generated disclosures and templates",
      "CO₂e and AWARE water scarcity indicators",
      "Fibre-to-assembly supply chain reconstruction",
      "DPP disclosure pack export",
      "Email support with onboarding call",
    ],
    highlighted: false,
  },
  growth: {
    subheading: "Your Impact Analyst",
    description:
      "Sustainability metrics and insights. Built for brands that need credible lifecycle outputs.",
    features: [
      "Up to 250 products/SKUs",
      "5 team seats",
      "Everything in Starter, plus:",
      "Expanded product data in DPP",
      "Core LCA metrics beyond indicators",
      "Process-level supply chain reconstruction",
      "Hotspot detection across lifecycle stages",
      "Impact comparisons across your products",
      "AI-powered data ingestion",
      "French Eco-Score display",
      "Entry-level decarbonisation guidance",
      "Stage-linked evidence library",
      "Hotspot insights with reduction opportunities",
      "DPP scan and engagement analytics",
      "Customer feedback from DPP scans",
      "Metrics and analytics report exports",
      "Priority support",
    ],
    highlighted: true,
  },
  pro: {
    subheading: "Your Sustainability Team",
    description:
      "A hands-on plan that replaces the need for an internal sustainability team. Built for scale and supplier complexity.",
    customPricing: true,
    customSubline: "Tailored to your SKU count, supplier complexity and support needs",
    features: [
      "Custom product/SKU allocation",
      "Unlimited team seats",
      "Everything in Growth, plus:",
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
};

/**
 * Rendered on the pricing page near the comparison matrix. Carries the
 * custom-plans message (tier-agnostic, descriptive language): plans flex,
 * and France-legal brands can arrange Eco-Score display on any plan.
 */
export const SITE_PLAN_FLEXIBILITY_NOTE =
  "Every plan is a starting point. Individual features, SKU allowances and seats can be arranged on any plan, including French Eco-Score display for brands selling into France. Get in touch and we will shape it around you.";

export interface SiteComparisonRow {
  name: string;
  starter: boolean | string;
  growth: boolean | string;
  pro: boolean | string;
  /** Dashboard flag this row promises, when the mapping is 1:1. */
  flag?: FeatureFlag;
}

export interface SiteComparisonCategory {
  name: string;
  features: SiteComparisonRow[];
}

export const SITE_COMPARISON: { categories: SiteComparisonCategory[] } = {
  categories: [
    {
      name: "Team and Access",
      features: [
        { name: "Team seats", starter: "1", growth: "5", pro: "Unlimited" },
      ],
    },
    {
      name: "DPP Creation",
      features: [
        { name: "Product/SKU allocation", starter: "Up to 50", growth: "Up to 250", pro: "Custom" },
        { name: "QR-ready passport pages", starter: true, growth: true, pro: true, flag: "show_dpps" },
        { name: "Embeddable DPP widgets", starter: true, growth: true, pro: true },
        { name: "Multi-language DPP pages", starter: true, growth: true, pro: true },
        { name: "Expanded product data in DPP", starter: false, growth: true, pro: true },
        { name: "Auto-generated disclosures and templates", starter: true, growth: true, pro: true },
        { name: "AI-powered data ingestion", starter: false, growth: true, pro: true, flag: "show_ai_ingestion" },
      ],
    },
    {
      name: "Transparency and Evidence",
      features: [
        { name: "Transparency score per product", starter: true, growth: true, pro: true },
        { name: "Evidence uploads and product documentation", starter: true, growth: true, pro: true, flag: "show_evidence" },
        { name: "Multi-level supply chain verification", starter: true, growth: true, pro: true },
        { name: "Stage-linked evidence library", starter: false, growth: true, pro: true },
      ],
    },
    {
      name: "Supply Chain Modelling",
      features: [
        { name: "Fibre-to-assembly supply chain reconstruction", starter: true, growth: true, pro: true },
        { name: "Process-level supply chain reconstruction", starter: false, growth: true, pro: true, flag: "show_suppliers" },
        { name: "Advanced modelling and optimisation frameworks", starter: false, growth: false, pro: true },
      ],
    },
    {
      name: "Metrics",
      features: [
        { name: "CO₂e indicators", starter: true, growth: true, pro: true },
        { name: "AWARE water scarcity indicators", starter: true, growth: true, pro: true },
        // Growth+ by default; brands selling into France can arrange it on
        // any plan (see the flexibility note rendered on the pricing page).
        { name: "French Eco-Score (coût environnemental)", starter: false, growth: true, pro: true },
        { name: "Core LCA metrics beyond indicators", starter: false, growth: true, pro: true, flag: "show_metrics" },
        { name: "Complete PEF-aligned metrics", starter: false, growth: false, pro: true },
      ],
    },
    {
      name: "Dashboard and Insights",
      features: [
        { name: "DPP scan and engagement analytics", starter: false, growth: true, pro: true, flag: "show_analytics" },
        { name: "Hotspot detection across lifecycle stages", starter: false, growth: true, pro: true, flag: "show_metrics_lifecycle" },
        { name: "Hotspot insights with reduction opportunities", starter: false, growth: true, pro: true, flag: "show_metrics_lifecycle" },
        { name: "Impact comparisons in your dashboard", starter: false, growth: true, pro: true, flag: "show_metrics" },
        { name: "Customer feedback from DPP scans", starter: false, growth: true, pro: true, flag: "show_feedback" },
        { name: "Seasonal product-line impact reports", starter: false, growth: false, pro: true, flag: "show_reports" },
      ],
    },
    {
      name: "Exports and Reporting",
      features: [
        // "Disclosure pack", never "full ESPR compliance", until the ESPR
        // capture fields exist (see Compliance generation roadmap in Notion).
        { name: "DPP disclosure pack export", starter: true, growth: true, pro: true },
        { name: "Metrics and analytics exports", starter: false, growth: true, pro: true, flag: "show_sustainability_report" },
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
};

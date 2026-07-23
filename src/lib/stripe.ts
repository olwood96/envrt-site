import Stripe from "stripe";

// Server-side Stripe client — never import this on the client
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  _stripe = new Stripe(key);
  return _stripe;
}

// ── Plan ↔ Stripe Price ID mapping ──────────────────────────────────────
// Set price IDs in env vars. Format: STRIPE_PRICE_{PLAN}_{INTERVAL}_{CURRENCY}
// e.g. STRIPE_PRICE_STARTER_MONTHLY_GBP=price_xxx

export type PlanName = "starter" | "growth" | "pro";
export type BillingInterval = "monthly" | "annual";
export type Currency = "gbp" | "eur" | "usd";

/**
 * Look up the Stripe Price ID for a (plan, interval, currency) tuple.
 * Used by the checkout route to create the right Stripe Checkout Session.
 */
export function getStripePriceId(
  plan: PlanName,
  interval: BillingInterval,
  currency: Currency
): string | null {
  const envKey = `STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}_${currency.toUpperCase()}`;
  return process.env[envKey] || null;
}

export function isValidPlan(plan: string): plan is PlanName {
  return ["starter", "growth", "pro"].includes(plan);
}

export function isValidInterval(interval: string): interval is BillingInterval {
  return ["monthly", "annual"].includes(interval);
}

export function isValidCurrency(currency: string): currency is Currency {
  return ["gbp", "eur", "usd"].includes(currency);
}

// ── Webhook signature verification ──────────────────────────────────────

export function verifyWebhookSignature(
  body: string,
  signature: string
): Stripe.Event | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return null;
  }

  try {
    return getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return null;
  }
}

// ── Plan resolution from Stripe subscription ────────────────────────────
// Two paths, checked in order:
//   1. product.metadata.tier  → custom agreements (admin set metadata on Stripe
//      product, e.g. metadata.tier = "growth")
//   2. PRICE_TO_PLAN[priceId] → self-serve, mapped from the env-configured
//      Stripe price IDs

/**
 * Reverse lookup: given a Stripe price ID env var, return the corresponding
 * (plan, interval, currency) tuple. Built lazily at first call.
 */
let _priceToPlanCache: Record<string, PlanName> | null = null;

function buildPriceToPlanMap(): Record<string, PlanName> {
  if (_priceToPlanCache) return _priceToPlanCache;

  const map: Record<string, PlanName> = {};
  // Pro is custom-only — not in the public self-serve map.
  const plans: PlanName[] = ["starter", "growth"];
  const intervals: BillingInterval[] = ["monthly", "annual"];
  const currencies: Currency[] = ["gbp", "eur", "usd"];

  for (const plan of plans) {
    for (const interval of intervals) {
      for (const currency of currencies) {
        const priceId = getStripePriceId(plan, interval, currency);
        if (priceId) map[priceId] = plan;
      }
    }
  }

  _priceToPlanCache = map;
  return map;
}

export type SubscriptionSource = "self_serve" | "custom" | "manual";

export interface ResolvedPlan {
  plan: PlanName;
  source: Extract<SubscriptionSource, "self_serve" | "custom">;
}

/**
 * Resolve a Stripe Subscription to a plan + source.
 *
 * Returns null when the price ID is unknown AND the product has no metadata.tier.
 * In that case the caller should leave the brand untouched and alert admin.
 */
export async function resolvePlanFromSubscription(
  subscription: Stripe.Subscription
): Promise<ResolvedPlan | null> {
  const item = subscription.items.data[0];
  if (!item) return null;

  const price = item.price;
  const productId =
    typeof price.product === "string" ? price.product : price.product?.id;

  // Path 1: custom agreement — metadata.tier on Stripe product
  if (productId) {
    try {
      const product = await getStripe().products.retrieve(productId);
      const metaTier = product.metadata?.tier?.toLowerCase();
      if (metaTier && isValidPlan(metaTier)) {
        return { plan: metaTier as PlanName, source: "custom" };
      }
    } catch (err) {
      console.error("Failed to retrieve Stripe product:", err);
    }
  }

  // Path 2: self-serve via subscription metadata. Set at checkout
  // (subscription_data.metadata.plan), this is how inline-priced self-serve
  // subs resolve, since their ad-hoc price is not in any env map.
  const metaPlan = subscription.metadata?.plan?.toLowerCase();
  if (metaPlan && isValidPlan(metaPlan)) {
    return { plan: metaPlan as PlanName, source: "self_serve" };
  }

  // Path 3: legacy self-serve — env-configured price ID (pre-inline subs).
  const priceToPlan = buildPriceToPlanMap();
  if (priceToPlan[price.id]) {
    return { plan: priceToPlan[price.id], source: "self_serve" };
  }

  return null;
}

// ── Tier → feature-flag mapping ─────────────────────────────────────────
// Cached on brands.features so the dashboard doesn't have to re-derive on
// every read. Must stay in sync with envrt-dashboard/lib/subscription/tiers.ts.
// If you change feature flags in the dashboard, mirror the change here.

export type BrandFeatures = {
  show_overview: boolean;
  show_garments: boolean;
  show_metrics: boolean;
  show_metrics_lifecycle: boolean;
  show_dpps: boolean;
  show_suppliers: boolean;
  show_evidence: boolean;
  show_collection_form: boolean;
  show_reports: boolean;
  show_analytics: boolean;
  show_feedback: boolean;
  show_sustainability_report: boolean;
  show_compliance_france: boolean;
};

export const TIER_FEATURES: Record<PlanName, BrandFeatures> = {
  starter: {
    show_overview: true,
    show_garments: true,
    show_metrics: false,
    show_metrics_lifecycle: false,
    show_dpps: true,
    show_suppliers: false,
    show_evidence: true,
    show_collection_form: true,
    show_reports: false,
    show_analytics: false,
    show_feedback: false,
    show_sustainability_report: false,
    show_compliance_france: false,
  },
  growth: {
    show_overview: true,
    show_garments: true,
    show_metrics: true,
    show_metrics_lifecycle: true,
    show_dpps: true,
    show_suppliers: true,
    show_evidence: true,
    show_collection_form: true,
    show_reports: false,
    show_analytics: true,
    show_feedback: true,
    show_sustainability_report: true,
    show_compliance_france: false,
  },
  pro: {
    show_overview: true,
    show_garments: true,
    show_metrics: true,
    show_metrics_lifecycle: true,
    show_dpps: true,
    show_suppliers: true,
    show_evidence: true,
    show_collection_form: true,
    show_reports: true,
    show_analytics: true,
    show_feedback: true,
    show_sustainability_report: true,
    show_compliance_france: false,
  },
};

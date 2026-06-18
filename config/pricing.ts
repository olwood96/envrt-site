/**
 * Single source of truth for ENVRT pricing.
 *
 * Edit the amounts here, then run `npm run stripe:sync` to push changes
 * to Stripe. The script creates new Stripe prices for any changed amount
 * and archives the old ones (Stripe prices are immutable). Existing
 * subscriptions stay on their original price (grandfathered automatically).
 *
 * Amounts are integers in minor units (pence for GBP, cents for EUR/USD).
 * No floats, no surprises.
 *
 * Pro is NOT included here. Pro is a custom-only tier handled via
 * metadata.tier on bespoke Stripe products, not the self-serve price map.
 */

export type PlanName = "starter" | "growth";
export type Interval = "monthly" | "annual";
export type Currency = "gbp" | "eur" | "usd";

export interface ProductConfig {
  name: string;
  description: string;
  // metadata.plan is how the sync script identifies which Stripe product
  // belongs to which plan, instead of relying on names that can drift.
  metadata: { plan: PlanName };
}

export interface PricingConfig {
  products: Record<PlanName, ProductConfig>;
  // prices[plan][interval][currency] = unit_amount in minor units
  prices: Record<PlanName, Record<Interval, Record<Currency, number>>>;
}

/**
 * Annual is monthly x 12 x 0.85 (15% discount), pre-rounded so the
 * displayed amount and the Stripe-charged amount always match exactly.
 *
 * EUR uses GBP x 1.18, USD uses GBP x 1.27. Match
 * envrt-site/src/lib/constants.ts:GBP_TO_EUR if you change one.
 */
export const PRICING_CONFIG: PricingConfig = {
  products: {
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
  },
  prices: {
    starter: {
      monthly: {
        gbp: 14900,    // £149.00
        eur: 17500,    // €175.00
        usd: 18900,    // $189.00
      },
      annual: {
        gbp: 151980,   // £1,519.80
        eur: 178500,   // €1,785.00
        usd: 192780,   // $1,927.80
      },
    },
    growth: {
      monthly: {
        gbp: 49500,    // £495.00
        eur: 58500,    // €585.00
        usd: 62900,    // $629.00
      },
      annual: {
        gbp: 504900,   // £5,049.00
        eur: 596700,   // €5,967.00
        usd: 641580,   // $6,415.80
      },
    },
  },
};

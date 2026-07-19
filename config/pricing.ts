/**
 * Stripe-facing pricing config.
 *
 * The AMOUNTS are no longer declared here. They live in the canonical plans
 * source of truth (envrt-dashboard/lib/plans/plans.ts), synced into this repo
 * as src/lib/plans.generated.ts. To change a price:
 *
 *   1. Edit envrt-dashboard/lib/plans/plans.ts
 *   2. Run `npm run sync:plans` there (updates src/lib/plans.generated.ts here)
 *   3. Run `npm run stripe:sync` here to push the new amounts to Stripe
 *      (creates new Stripe prices, archives old ones — existing subscriptions
 *      stay on their original price, grandfathered automatically)
 *
 * This file keeps its original exported shape so the sync script and the
 * pricing page wiring are unchanged. Amounts are integers in minor units.
 *
 * Pro is NOT included here. Pro is a custom-only tier handled via
 * metadata.tier on bespoke Stripe products, not the self-serve price map.
 */

import {
  PLAN_PRICES,
  STRIPE_PRODUCTS,
  type BillingInterval,
  type PlanName as CanonicalPlanName,
  type PriceCurrency,
  type StripeProductConfig,
} from "../src/lib/plans.generated";

export type PlanName = CanonicalPlanName;
export type Interval = BillingInterval;
export type Currency = PriceCurrency;

export type ProductConfig = StripeProductConfig;

export interface PricingConfig {
  products: Record<PlanName, ProductConfig>;
  // prices[plan][interval][currency] = unit_amount in minor units
  prices: Record<PlanName, Record<Interval, Record<Currency, number>>>;
}

export const PRICING_CONFIG: PricingConfig = {
  products: STRIPE_PRODUCTS,
  prices: PLAN_PRICES,
};

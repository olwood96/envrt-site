// src/lib/plan-prices.ts
//
// Display-price constants derived from the canonical plans source of truth
// (plans.generated.ts, synced from envrt-dashboard/lib/plans/plans.ts).
//
// Use these in prose, FAQs and calculators instead of literal price strings,
// so a price change in the canonical file updates every claim on the site.
// The full change procedure lives in envrt-dashboard/docs/
// pricing-change-runbook.md.

import { PLAN_PRICES, TIER_PRODUCT_LIMITS } from "./plans.generated";

/** Whole-pound monthly prices (e.g. 211). */
export const STARTER_MONTHLY_GBP = Math.round(PLAN_PRICES.starter.monthly.gbp / 100);
export const GROWTH_MONTHLY_GBP = Math.round(PLAN_PRICES.growth.monthly.gbp / 100);

/** Full-price annual equivalent (monthly x 12, the "sticker" comparison
 *  figure, not the 15%-discounted annual billing amount). */
export const STARTER_ANNUAL_STICKER_GBP = STARTER_MONTHLY_GBP * 12;

/** SKU boundaries, from the same source the dashboard enforces. */
export const STARTER_SKU_LIMIT = TIER_PRODUCT_LIMITS.starter ?? 50;
export const GROWTH_SKU_LIMIT = TIER_PRODUCT_LIMITS.growth ?? 250;

/** Ready-made labels for prose ("£211"). */
export const STARTER_PRICE_LABEL = `£${STARTER_MONTHLY_GBP}`;
export const GROWTH_PRICE_LABEL = `£${GROWTH_MONTHLY_GBP}`;

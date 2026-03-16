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
// Set these in your environment variables.
// Format: STRIPE_PRICE_{PLAN}_{INTERVAL}_{CURRENCY}
// e.g. STRIPE_PRICE_STARTER_MONTHLY_GBP=price_xxx

export type PlanName = "starter" | "growth" | "pro";
export type BillingInterval = "monthly" | "annual";
export type Currency = "gbp" | "eur";

/**
 * Get the Stripe Price ID for a given plan, interval, and currency.
 * Price IDs are stored as environment variables to keep them out of code
 * and allow easy updates when EUR prices change.
 */
export function getStripePriceId(
  plan: PlanName,
  interval: BillingInterval,
  currency: Currency
): string | null {
  const envKey = `STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}_${currency.toUpperCase()}`;
  return process.env[envKey] || null;
}

/**
 * Validate that a plan/interval/currency combination is valid.
 */
export function isValidPlan(plan: string): plan is PlanName {
  return ["starter", "growth", "pro"].includes(plan);
}

export function isValidInterval(interval: string): interval is BillingInterval {
  return ["monthly", "annual"].includes(interval);
}

export function isValidCurrency(currency: string): currency is Currency {
  return ["gbp", "eur"].includes(currency);
}

/**
 * Verify a Stripe webhook signature.
 * Returns the parsed event or null if verification fails.
 */
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

/**
 * Sync Stripe products + prices from config/pricing.ts.
 *
 * Usage:
 *   npm run stripe:sync                 (apply changes)
 *   npm run stripe:sync -- --dry-run    (preview, no writes)
 *
 * Requires STRIPE_SECRET_KEY in your local .env.local (test or live key).
 * Mode is inferred from the key prefix (sk_test_ vs sk_live_).
 *
 * What it does, in order:
 *
 *   1. For each plan in config.products, find or create a Stripe product
 *      identified by metadata.plan. Updates name/description if drifted.
 *
 *   2. For each (plan, interval, currency) tuple in config.prices, look
 *      for an active price on the matching product with the same
 *      currency, interval and unit_amount. If found, reuse. If not,
 *      archive any active prices on that (product, currency, interval)
 *      with the wrong amount, then create a new price at the right
 *      amount.
 *
 *   3. Print an env var block ready to paste into Vercel.
 *
 * Stripe rule: prices are immutable, so amount changes always mean
 * "create new, archive old". Existing subscriptions stay on their
 * original price (Stripe grandfathers them automatically). New
 * subscriptions pick up the new price ID via the updated env var.
 *
 * Safe to re-run. No config drift = no Stripe writes.
 */

import Stripe from "stripe";
import * as dotenv from "dotenv";
import * as path from "node:path";

import { PRICING_CONFIG, type PlanName, type Interval, type Currency } from "../config/pricing.js";

// ── Setup ────────────────────────────────────────────────────────────────

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const DRY_RUN = process.argv.includes("--dry-run");
const SECRET = process.env.STRIPE_SECRET_KEY;

if (!SECRET) {
  console.error("STRIPE_SECRET_KEY not set. Add it to .env.local before running.");
  process.exit(1);
}

const MODE: "TEST" | "LIVE" = SECRET.startsWith("sk_test_") ? "TEST" : "LIVE";

if (MODE === "LIVE" && !process.argv.includes("--allow-live")) {
  console.error(
    "Refusing to run against LIVE Stripe without --allow-live flag."
  );
  console.error(
    "First validate in TEST mode, then re-run with --allow-live for live."
  );
  process.exit(1);
}

const stripe = new Stripe(SECRET);

const log = (s: string) => console.log(s);
const banner = (s: string) => log(`\n${"=".repeat(s.length)}\n${s}\n${"=".repeat(s.length)}`);

const INTERVAL_TO_STRIPE: Record<Interval, "month" | "year"> = {
  monthly: "month",
  annual: "year",
};

// ── Products ─────────────────────────────────────────────────────────────

async function syncProducts(): Promise<Record<PlanName, string>> {
  banner(`Syncing products (${MODE} mode${DRY_RUN ? " - DRY RUN" : ""})`);

  // One list call covers both plans
  const existing = await stripe.products.list({ active: true, limit: 100 });

  const productIds: Record<PlanName, string> = {} as Record<PlanName, string>;
  const planNames = Object.keys(PRICING_CONFIG.products) as PlanName[];

  for (const plan of planNames) {
    const config = PRICING_CONFIG.products[plan];
    const matches = existing.data.filter((p) => p.metadata?.plan === plan);

    if (matches.length > 1) {
      throw new Error(
        `Multiple Stripe products have metadata.plan='${plan}': ${matches
          .map((p) => p.id)
          .join(", ")}. Resolve manually before re-running.`
      );
    }

    if (matches[0]) {
      const found = matches[0];
      log(`  exists: ${plan} -> ${found.id}`);
      const needsUpdate =
        found.name !== config.name || found.description !== config.description;
      if (needsUpdate) {
        if (!DRY_RUN) {
          await stripe.products.update(found.id, {
            name: config.name,
            description: config.description,
          });
        }
        log(`    -> updated name/description`);
      }
      productIds[plan] = found.id;
    } else {
      if (!DRY_RUN) {
        const created = await stripe.products.create({
          name: config.name,
          description: config.description,
          metadata: { plan },
        });
        productIds[plan] = created.id;
        log(`  created: ${plan} -> ${created.id}`);
      } else {
        productIds[plan] = `[dry-run-${plan}]`;
        log(`  would create: ${plan}`);
      }
    }
  }

  return productIds;
}

// ── Prices ───────────────────────────────────────────────────────────────

interface SyncedPrice {
  envKey: string;
  priceId: string;
}

async function syncPrices(
  productIds: Record<PlanName, string>
): Promise<SyncedPrice[]> {
  banner(`Syncing prices (${MODE} mode${DRY_RUN ? " - DRY RUN" : ""})`);

  const synced: SyncedPrice[] = [];
  const planNames = Object.keys(PRICING_CONFIG.prices) as PlanName[];

  for (const plan of planNames) {
    const productId = productIds[plan];
    const intervals = PRICING_CONFIG.prices[plan];

    // Fetch existing active prices for this product once
    let existing: Stripe.Price[] = [];
    if (!productId.startsWith("[dry-run")) {
      const res = await stripe.prices.list({
        product: productId,
        active: true,
        limit: 100,
      });
      existing = res.data;
    }

    for (const interval of Object.keys(intervals) as Interval[]) {
      const stripeInterval = INTERVAL_TO_STRIPE[interval];
      const currencies = intervals[interval];

      for (const currency of Object.keys(currencies) as Currency[]) {
        const amount = currencies[currency];
        const envKey = `STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}_${currency.toUpperCase()}`;

        const matchCurrent = existing.find(
          (p) =>
            p.currency === currency &&
            p.recurring?.interval === stripeInterval &&
            p.unit_amount === amount
        );

        if (matchCurrent) {
          log(
            `  exists: ${plan}/${interval}/${currency} @ ${amount} -> ${matchCurrent.id}`
          );
          synced.push({ envKey, priceId: matchCurrent.id });
          continue;
        }

        // Archive any out-of-date prices on this (product, currency, interval)
        const outOfDate = existing.filter(
          (p) =>
            p.currency === currency &&
            p.recurring?.interval === stripeInterval &&
            p.unit_amount !== amount
        );

        for (const old of outOfDate) {
          if (!DRY_RUN) {
            await stripe.prices.update(old.id, { active: false });
          }
          log(
            `    archived old ${plan}/${interval}/${currency} @ ${old.unit_amount} (${old.id})`
          );
        }

        if (!DRY_RUN) {
          const created = await stripe.prices.create({
            product: productId,
            currency,
            unit_amount: amount,
            recurring: { interval: stripeInterval },
            metadata: { plan, interval, currency },
          });
          log(
            `  created: ${plan}/${interval}/${currency} @ ${amount} -> ${created.id}`
          );
          synced.push({ envKey, priceId: created.id });
        } else {
          log(
            `  would create: ${plan}/${interval}/${currency} @ ${amount}`
          );
          synced.push({ envKey, priceId: `[dry-run]` });
        }
      }
    }
  }

  return synced;
}

// ── Output ───────────────────────────────────────────────────────────────

function printEnvBlock(synced: SyncedPrice[]) {
  banner(`Env vars for Vercel (${MODE} mode)`);
  log("");
  log("Paste this into Vercel project env settings,");
  log("Production + Preview, replacing any older STRIPE_PRICE_* keys.");
  log("");
  for (const { envKey, priceId } of synced) {
    log(`${envKey}=${priceId}`);
  }
  log("");
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
  try {
    const productIds = await syncProducts();
    const synced = await syncPrices(productIds);
    printEnvBlock(synced);

    if (DRY_RUN) {
      log("DRY RUN complete. No Stripe writes happened.");
      log("Re-run without --dry-run to apply.");
    } else {
      log("Sync complete.");
    }
  } catch (err) {
    console.error("\nSync failed:", err);
    process.exit(1);
  }
}

main();

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { rateLimit, getClientIp, isValidEmail } from "@/lib/form-security";
import {
  getStripe,
  isValidPlan,
  isValidInterval,
  isValidCurrency,
} from "@/lib/stripe";
import { PLAN_PRICES, STRIPE_PRODUCTS } from "@/lib/plans.generated";

interface CheckoutPayload {
  plan: string;
  interval: string;
  currency: string;
  email?: string;
}

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://envrt.com";

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = getClientIp(request.headers);
  if (!rateLimit(`stripe-checkout:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let data: CheckoutPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Validate inputs
  if (!data.plan || !isValidPlan(data.plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  if (!data.interval || !isValidInterval(data.interval)) {
    return NextResponse.json({ error: "Invalid interval" }, { status: 400 });
  }
  if (!data.currency || !isValidCurrency(data.currency)) {
    return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
  }
  if (data.email && !isValidEmail(data.email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Price is built INLINE from the canonical plans source of truth
  // (plans.generated.ts, synced from the dashboard). No pre-created Stripe
  // Price IDs, no STRIPE_PRICE_* env vars, no stripe:sync: a price change in
  // the plans file flows straight into checkout. Pro is custom-only and has
  // no self-serve amount, so it is rejected here (its CTA goes to /contact).
  const planPrices =
    data.plan === "starter" || data.plan === "growth"
      ? PLAN_PRICES[data.plan]
      : null;
  const unitAmount = planPrices?.[data.interval]?.[data.currency];

  if (!unitAmount) {
    return NextResponse.json(
      { error: "Payment not available for this plan configuration" },
      { status: 500 }
    );
  }

  const effectiveCurrency = data.currency;
  const productName =
    data.plan === "starter" || data.plan === "growth"
      ? STRIPE_PRODUCTS[data.plan].name
      : `ENVRT ${data.plan}`;

  // Clean catalogue: reference a STABLE Stripe Product by ID when configured
  // (STRIPE_PRODUCT_STARTER / STRIPE_PRODUCT_GROWTH, set once from the existing
  // products), so paid subscriptions attach to one product instead of creating
  // a fresh ad-hoc one each time. The price stays inline from the plans file,
  // so it still auto-updates. Falls back to product_data by name when the env
  // var is absent, so checkout keeps working with zero config.
  const stableProductId =
    process.env[`STRIPE_PRODUCT_${data.plan.toUpperCase()}`]?.trim() || null;
  const productField: Pick<Stripe.Checkout.SessionCreateParams.LineItem.PriceData, "product" | "product_data"> =
    stableProductId ? { product: stableProductId } : { product_data: { name: productName } };

  try {
    const stripe = getStripe();

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: effectiveCurrency,
            unit_amount: unitAmount,
            recurring: { interval: data.interval === "annual" ? "year" : "month" },
            ...productField,
          },
          quantity: 1,
        },
      ],
      metadata: {
        plan: data.plan,
        interval: data.interval,
        currency: effectiveCurrency,
        term_months: "12",
      },
      subscription_data: {
        metadata: {
          plan: data.plan,
          interval: data.interval,
          currency: effectiveCurrency,
          term_months: "12",
        },
      },
      success_url: `${SITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/pricing`,
      consent_collection: {
        terms_of_service: "required",
      },
    };

    // Pre-fill email if provided
    if (data.email) {
      params.customer_email = data.email;
    }

    const session = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session creation failed:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

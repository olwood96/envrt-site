import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { rateLimit, getClientIp, isValidEmail } from "@/lib/form-security";
import {
  getStripe,
  getStripePriceId,
  isValidPlan,
  isValidInterval,
  isValidCurrency,
} from "@/lib/stripe";

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

  // Get the Stripe Price ID — fall back to GBP if selected currency isn't configured
  let priceId = getStripePriceId(data.plan, data.interval, data.currency);
  let effectiveCurrency = data.currency;

  if (!priceId && data.currency !== "gbp") {
    priceId = getStripePriceId(data.plan, data.interval, "gbp");
    effectiveCurrency = "gbp";
  }

  if (!priceId) {
    console.error(
      `Missing Stripe price ID for ${data.plan}/${data.interval}/${data.currency} (and GBP fallback)`
    );
    return NextResponse.json(
      { error: "Payment not available for this plan configuration" },
      { status: 500 }
    );
  }

  try {
    const stripe = getStripe();

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
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

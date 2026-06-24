import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";
import {
  getStripe,
  verifyWebhookSignature,
  isValidPlan,
  isValidInterval,
  isValidCurrency,
  resolvePlanFromSubscription,
  TIER_FEATURES,
  type PlanName,
  type SubscriptionSource,
} from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { escapeHtml } from "@/lib/form-security";

// Stripe sends the raw body; read as text for signature verification
export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  const event = verifyWebhookSignature(body, signature);
  if (!event) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Durable idempotency: claim the event ID in Supabase. If another lambda
  // already claimed it, exit early.
  const claimed = await claimEvent(event.id, event.type);
  if (!claimed) {
    return NextResponse.json({ received: true, deduplicated: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`Webhook handler error for ${event.type}:`, err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// ── Idempotency ──────────────────────────────────────────────────────────
// Inserts the event ID into stripe_events. If the row already exists (Postgres
// unique violation 23505), another lambda already claimed it — return false so
// the caller exits early.

async function claimEvent(eventId: string, eventType: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("stripe_events")
    .insert({ event_id: eventId, event_type: eventType });

  if (!error) return true;
  if (error.code === "23505") return false;
  throw error;
}

// ── Brand mirror helper ──────────────────────────────────────────────────
// Lookups the brand linked to a Stripe subscription and patches it. Skips
// brands marked subscription_source='manual' (admin-controlled, never auto-
// overwrite). Silently no-ops if no brand is linked yet (e.g. webhook fires
// before onboarding completes).

interface BrandPatch {
  plan?: PlanName;
  subscription_status?: string;
  subscription_source?: SubscriptionSource;
  stripe_customer_id?: string;
}

async function mirrorToBrand(
  stripeSubscriptionId: string,
  patch: BrandPatch
): Promise<void> {
  const supabase = getSupabaseAdmin();

  // Pull tier alongside source so the new tier-feature decoupling logic
  // (ADR-2026-008) can decide whether features are admin-owned.
  const { data: brand, error: lookupError } = await supabase
    .from("brands")
    .select("id, tier, subscription_source, brand_type")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .maybeSingle();

  if (lookupError) {
    console.error("Brand lookup failed:", lookupError);
    return;
  }
  if (!brand) return; // no brand linked yet, onboarding hasn't run

  // 'manual' source means admin owns everything (internal brands, demos,
  // pre-Stripe legacy). Webhook never touches these.
  if (brand.subscription_source === "manual") {
    console.warn(
      `Skipping brand ${brand.id}: subscription_source=manual (admin-controlled)`
    );
    return;
  }

  // tier === 'custom' means admin has customised the feature mix
  // (goodwill unlocks, bespoke deals). Webhook still mirrors operational
  // state (status, customer/sub IDs, source) but leaves tier + features
  // alone so admin's customisation persists across renewals and events.
  const customTier = brand.tier === "custom";

  const update: Record<string, unknown> = {};
  if (patch.plan && !customTier) {
    update.tier = patch.plan;
    update.features = TIER_FEATURES[patch.plan];
  }
  if (patch.subscription_status !== undefined) {
    update.subscription_status = patch.subscription_status;
    if (patch.subscription_status === "active" && brand.brand_type === "pilot") {
      update.brand_type = "standard";
    }
  }
  if (patch.subscription_source !== undefined) {
    update.subscription_source = patch.subscription_source;
  }
  if (patch.stripe_customer_id !== undefined) {
    update.stripe_customer_id = patch.stripe_customer_id;
  }

  if (Object.keys(update).length === 0) return;

  const { error: updateError } = await supabase
    .from("brands")
    .update(update)
    .eq("id", brand.id);

  if (updateError) {
    console.error(`Failed to mirror to brand ${brand.id}:`, updateError);
  }
}

// ── Handlers ─────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_email || session.customer_details?.email;
  if (!email) {
    console.error("Checkout completed but no email found", session.id);
    return;
  }

  const metadata = session.metadata || {};
  const plan = isValidPlan(metadata.plan || "") ? metadata.plan! : "starter";
  const interval = isValidInterval(metadata.interval || "") ? metadata.interval! : "monthly";
  const currency = isValidCurrency(metadata.currency || "") ? metadata.currency! : "gbp";
  const termMonths = parseInt(metadata.term_months || "12", 10);

  if (isNaN(termMonths) || termMonths < 1 || termMonths > 120) {
    console.error("Invalid term_months in metadata:", metadata.term_months);
    return;
  }

  const stripeCustomerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;
  const stripeSubscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!stripeCustomerId || !stripeSubscriptionId) {
    console.error("Missing customer or subscription ID in checkout session", session.id);
    return;
  }

  const supabase = getSupabaseAdmin();

  const termStart = new Date();
  const termEnd = new Date();
  termEnd.setMonth(termEnd.getMonth() + termMonths);

  const { error: insertError } = await supabase.from("subscriptions").insert({
    email: email.toLowerCase(),
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: stripeSubscriptionId,
    plan,
    interval,
    currency,
    status: "active",
    term_months: termMonths,
    minimum_term_months: 12,
    term_start: termStart.toISOString(),
    term_end: termEnd.toISOString(),
  });

  if (insertError) {
    console.error("Failed to insert subscription:", insertError);
    throw insertError;
  }

  // Try to auto-link a brand via the Stripe Product's metadata.brand_id.
  // This path is used for custom deals created via /admin/billing/deals/new,
  // where admin attached the brand_id when creating the Stripe product.
  // For self-serve subs (no brand_id metadata), the existing onboarding
  // flow handles brand creation + linking via approveOnboardingRequest.
  const autoLinkedBrandId = await autoLinkBrandFromMetadata({
    session,
    stripeCustomerId,
    stripeSubscriptionId,
  });

  // Self-serve only: send the invite + welcome email. For auto-linked
  // custom deals, the brand already exists with brand_users in place so
  // there is no invite path. Admin handles customer comms out-of-band.
  if (!autoLinkedBrandId) {
    const dashboardUrl = process.env.DASHBOARD_URL || "https://dashboard.envrt.com";

    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: "invite",
        email: email.toLowerCase(),
        options: {
          redirectTo: `${dashboardUrl}/auth/callback?next=/auth/set-password`,
        },
      });

    if (linkError) {
      console.error("Failed to generate invite link:", linkError.message);
      await sendAdminNotification(email, plan, interval, currency, false);
      return;
    }

    const inviteUrl = linkData?.properties?.action_link;
    if (inviteUrl) {
      await sendWelcomeEmail(email, plan, inviteUrl);
    }
  }

  await sendAdminNotification(
    email,
    plan,
    interval,
    currency,
    /* inviteSent */ !autoLinkedBrandId
  );
}

// ── Auto-link helpers ────────────────────────────────────────────────────

/**
 * If the checkout session's Stripe Product carries metadata.brand_id,
 * link that brand to the new subscription and flip its brand_agreements
 * row from 'pending' to 'paid'. Returns the brand_id on success, null
 * otherwise (self-serve flow falls back to invite-based onboarding).
 */
async function autoLinkBrandFromMetadata(opts: {
  session: Stripe.Checkout.Session;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
}): Promise<string | null> {
  const { session, stripeCustomerId, stripeSubscriptionId } = opts;
  const stripe = getStripe();
  const supabase = getSupabaseAdmin();

  // Look up the subscription's product to read metadata
  let product: Stripe.Product | null = null;
  try {
    const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId, {
      expand: ["items.data.price.product"],
    });
    const item = sub.items.data[0];
    const priceProduct = item?.price?.product;
    if (typeof priceProduct === "string") {
      product = await stripe.products.retrieve(priceProduct);
    } else if (priceProduct && !priceProduct.deleted) {
      product = priceProduct;
    }
  } catch (err) {
    console.error("Failed to retrieve subscription/product for auto-link:", err);
    return null;
  }

  if (!product) return null;
  const brandId = product.metadata?.brand_id;
  if (!brandId) return null;

  const metaTier = product.metadata?.tier?.toLowerCase();
  const tier = metaTier && isValidPlan(metaTier) ? (metaTier as PlanName) : null;
  const metaTierIsCustom = metaTier === "custom";

  // Check whether admin pre-set tier='custom' on the brand row before the
  // deal was paid (e.g. they set up bespoke features in advance). If so,
  // respect that and don't overwrite tier/features with the product
  // metadata. Same skip applies when the product metadata itself declares
  // tier='custom'.
  const { data: existingBrand } = await supabase
    .from("brands")
    .select("tier")
    .eq("id", brandId)
    .maybeSingle();
  const existingTierIsCustom = existingBrand?.tier === "custom";
  const skipTierAndFeatures = existingTierIsCustom || metaTierIsCustom;

  // Mirror to brand. Use subscription_source = 'custom' so the standard
  // mirrorToBrand guards on the source field don't kick in on subsequent
  // events. Tier + features only get written when neither side has
  // declared the deal 'custom'.
  const update: Record<string, unknown> = {
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: stripeSubscriptionId,
    subscription_status: "active",
    subscription_source: "custom",
  };
  if (tier && !skipTierAndFeatures) {
    update.tier = tier;
    update.features = TIER_FEATURES[tier];
  } else if (metaTierIsCustom && !existingTierIsCustom) {
    // Tag the brand as custom-tier so future events respect it, but leave
    // features alone for admin to set.
    update.tier = "custom";
  }

  const { error: brandUpdateError } = await supabase
    .from("brands")
    .update(update)
    .eq("id", brandId);

  if (brandUpdateError) {
    console.error(
      `Auto-link failed for brand ${brandId}:`,
      brandUpdateError
    );
    return null;
  }

  // Flip the matching brand_agreements row to 'paid'. Filter to pending
  // status so a stray duplicate event doesn't trash already-active deals.
  // Use the most recent pending deal for this brand if multiple exist.
  const { data: pendingDeals } = await supabase
    .from("brand_agreements")
    .select("id, deal_name, amount_minor, currency, tier, interval, client_name, client_registered_office, client_contact_email, client_primary_contact")
    .eq("brand_id", brandId)
    .in("status", ["pending", "sent"])
    .order("created_at", { ascending: false })
    .limit(1);

  const deal = pendingDeals?.[0] ?? null;
  if (deal) {
    await supabase
      .from("brand_agreements")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", deal.id);

    await createInvoiceDraftFromDeal(supabase, brandId, deal, session.id);
  }

  console.log(
    `Auto-linked brand ${brandId} to subscription ${stripeSubscriptionId} via session ${session.id}`
  );
  return brandId;
}

// ── Invoice auto-creation ────────────────────────────────────────────────

type DealForInvoice = {
  id: string;
  deal_name: string;
  amount_minor: number;
  currency: string;
  tier: string;
  interval: string;
  client_name: string | null;
  client_registered_office: string | null;
  client_contact_email: string | null;
  client_primary_contact: string | null;
};

async function createInvoiceDraftFromDeal(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  brandId: string,
  deal: DealForInvoice,
  checkoutSessionId: string
): Promise<void> {
  const now = new Date();
  const tier = deal.tier.charAt(0).toUpperCase() + deal.tier.slice(1);
  let lineDescription: string;
  if (deal.interval === "monthly") {
    const period = now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    lineDescription = `ENVRT Platform Services — ${tier} Plan — ${period}`;
  } else if (deal.interval === "annual") {
    const year = now.getFullYear();
    lineDescription = `ENVRT Annual Platform Services — ${tier} Plan — ${year}/${year + 1}`;
  } else {
    lineDescription = `ENVRT Platform Services — ${tier} Plan`;
  }

  const placeholder = `DRAFT-${Date.now()}`;

  const { data: created, error: createErr } = await supabase
    .from("invoices")
    .insert({
      invoice_number: placeholder,
      brand_id: brandId,
      brand_agreement_id: deal.id,
      status: "draft",
      client_name: deal.client_name?.trim() || "",
      client_address: deal.client_registered_office?.trim() || "",
      client_email: deal.client_contact_email?.trim() || null,
      client_contact_name: deal.client_primary_contact?.trim() || null,
      internal_notes: `Auto-created on deal payment · Stripe session ${checkoutSessionId}`,
      payment_terms_days: 14,
      include_bank_transfer: true,
      include_stripe_link: false,
      subtotal_minor: deal.amount_minor,
      total_minor: deal.amount_minor,
      currency: deal.currency.toUpperCase(),
    })
    .select("id")
    .single();

  if (createErr || !created) {
    console.error("Failed to create invoice draft from deal:", createErr?.message);
    return;
  }

  const { error: lineErr } = await supabase.from("invoice_lines").insert({
    invoice_id: created.id,
    description: lineDescription,
    quantity: 1,
    unit_price_minor: deal.amount_minor,
    amount_minor: deal.amount_minor,
    sort_order: 0,
  });

  if (lineErr) {
    console.error("Failed to insert invoice line:", lineErr.message);
    await supabase.from("invoices").delete().eq("id", created.id);
    return;
  }

  console.log(`Draft invoice ${created.id} created for deal ${deal.id}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const supabase = getSupabaseAdmin();
  const stripeSubId = subscription.id;

  const status = mapStripeStatus(subscription.status);

  // Resolve plan from price (custom via metadata.tier, self-serve via env map)
  const resolved = await resolvePlanFromSubscription(subscription);

  // Update subscriptions table (status always, plan if resolved)
  const subUpdate: Record<string, unknown> = { status };
  if (resolved) subUpdate.plan = resolved.plan;

  const { error: subError } = await supabase
    .from("subscriptions")
    .update(subUpdate)
    .eq("stripe_subscription_id", stripeSubId);

  if (subError) {
    console.error("Failed to update subscription:", subError);
    throw subError;
  }

  // Mirror to brand. If resolver failed, still update status but leave tier.
  if (resolved) {
    await mirrorToBrand(stripeSubId, {
      plan: resolved.plan,
      subscription_status: status,
      subscription_source: resolved.source,
    });
  } else {
    await mirrorToBrand(stripeSubId, { subscription_status: status });
    await alertUnresolvedPrice(subscription);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "cancelled" })
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    console.error("Failed to mark subscription as cancelled:", error);
    throw error;
  }

  await mirrorToBrand(subscription.id, { subscription_status: "cancelled" });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const stripeSubId = extractSubscriptionId(invoice);
  if (!stripeSubId) return;

  // Recover from past_due: if Supabase shows past_due, clear it back to active
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "active" })
    .eq("stripe_subscription_id", stripeSubId)
    .eq("status", "past_due");

  if (error) console.error("Failed to mark subscription recovered:", error);

  await mirrorToBrand(stripeSubId, { subscription_status: "active" });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const stripeSubId = extractSubscriptionId(invoice);
  if (stripeSubId) {
    const supabase = getSupabaseAdmin();
    await supabase
      .from("subscriptions")
      .update({ status: "past_due" })
      .eq("stripe_subscription_id", stripeSubId);

    await mirrorToBrand(stripeSubId, { subscription_status: "past_due" });
  }

  // Notify admin
  const email =
    typeof invoice.customer_email === "string" ? invoice.customer_email : null;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const { error: sendError } = await resend.emails.send({
    from: "ENVRT Payments <info@envrt.com>",
    to: "info@envrt.com",
    bcc: ["charlie@envrt.com", "oliver@envrt.com"],
    subject: `Payment failed: ${email || "unknown customer"}`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;">
        <h2 style="color:#1b3a2d;">Payment Failed</h2>
        <p>A payment has failed for customer <strong>${escapeHtml(email || "unknown")}</strong>.</p>
        <p>Invoice ID: ${escapeHtml(invoice.id)}</p>
        <p>Stripe will retry automatically. Check the Stripe dashboard for details.</p>
      </div>
    `,
  });

  if (sendError) {
    console.error("Failed to send payment failure notification:", sendError);
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────

function mapStripeStatus(stripeStatus: Stripe.Subscription.Status): string {
  switch (stripeStatus) {
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
      return "cancelled";
    case "unpaid":
      return "unpaid";
    case "incomplete":
    case "incomplete_expired":
      return "incomplete";
    default:
      return stripeStatus;
  }
}

function extractSubscriptionId(invoice: Stripe.Invoice): string | null {
  const sub = (invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null })
    .subscription;
  if (!sub) return null;
  return typeof sub === "string" ? sub : sub.id;
}

async function alertUnresolvedPrice(subscription: Stripe.Subscription) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const priceId = subscription.items.data[0]?.price.id || "(unknown)";
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: "ENVRT Payments <info@envrt.com>",
    to: "info@envrt.com",
    bcc: ["oliver@envrt.com"],
    subject: `Unresolved Stripe price ID: ${priceId}`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;">
        <h2 style="color:#1b3a2d;">Unresolved Stripe price</h2>
        <p>A subscription event fired with a price ID that does not match any
        self-serve env var and the Stripe product has no <code>metadata.tier</code>.</p>
        <p>Subscription: <code>${escapeHtml(subscription.id)}</code></p>
        <p>Price ID: <code>${escapeHtml(priceId)}</code></p>
        <p>The brand was not touched. Action: either add the price ID to env, or
        set <code>metadata.tier</code> on the Stripe product, then trigger a sync.</p>
      </div>
    `,
  });
}

// ── Email helpers (unchanged from prior version) ─────────────────────────

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  growth: "Growth",
  pro: "Pro",
};

async function sendWelcomeEmail(
  email: string,
  plan: string,
  inviteUrl: string
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set, skipping welcome email");
    return;
  }

  const resend = new Resend(apiKey);
  const planLabel = PLAN_LABELS[plan] || plan;

  const { error: sendError } = await resend.emails.send({
    from: "ENVRT <info@envrt.com>",
    to: email,
    subject: `Welcome to ENVRT, your ${planLabel} plan is active`,
    html: buildWelcomeHtml(email, planLabel, inviteUrl),
  });

  if (sendError) {
    console.error("Failed to send welcome email:", sendError);
    throw new Error(`Welcome email failed for ${email}: ${sendError.message}`);
  }
}

async function sendAdminNotification(
  email: string,
  plan: string,
  interval: string,
  currency: string,
  inviteSent: boolean
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const planLabel = PLAN_LABELS[plan] || plan;

  const { error: sendError } = await resend.emails.send({
    from: "ENVRT Payments <info@envrt.com>",
    to: "info@envrt.com",
    bcc: ["charlie@envrt.com", "oliver@envrt.com"],
    subject: `New subscription: ${escapeHtml(email)} ${planLabel}`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;">
        <h2 style="color:#1b3a2d;">New Subscription</h2>
        <table style="border-collapse:collapse;width:100%;margin-bottom:20px;">
          <tr><td style="padding:6px 12px;color:#666;">Email</td><td style="padding:6px 12px;font-weight:600;">${escapeHtml(email)}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Plan</td><td style="padding:6px 12px;font-weight:600;">${escapeHtml(planLabel)} (${escapeHtml(interval)})</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Currency</td><td style="padding:6px 12px;font-weight:600;">${currency.toUpperCase()}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Invite sent</td><td style="padding:6px 12px;font-weight:600;">${inviteSent ? "Yes" : "No, user may already exist"}</td></tr>
        </table>
        ${!inviteSent ? '<p style="color:#c00;">The user may already have a Supabase account. You may need to manually link them to a brand or resend the invite from the dashboard.</p>' : ""}
      </div>
    `,
  });

  if (sendError) {
    console.error("Failed to send admin notification:", sendError);
  }
}

function buildWelcomeHtml(
  email: string,
  planLabel: string,
  inviteUrl: string
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="padding:0 0 32px;">
          <img src="https://envrt.com/brand/envrt-logo.png" alt="ENVRT" height="32" style="height:32px;width:auto;">
        </td></tr>
        <tr><td style="background:#ffffff;border-radius:16px;padding:32px;">
          <h2 style="margin:0 0 16px;color:#1b3a2d;font-size:20px;">Welcome to ENVRT</h2>
          <p style="margin:0 0 16px;font-size:14px;color:#555;line-height:1.7;">
            Your <strong>${escapeHtml(planLabel)}</strong> plan is now active. Click the button below to set up your dashboard account and get started.
          </p>
          <a href="${escapeHtml(inviteUrl)}" style="display:inline-block;background:#1a7a6d;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:12px;">
            Set up your account
          </a>
          <p style="margin:24px 0 0;font-size:13px;color:#888;line-height:1.6;">
            This link will expire in 24 hours. If it expires, you can request a new one at
            <a href="https://envrt.com" style="color:#1a7a6d;text-decoration:none;">envrt.com</a>.
          </p>
        </td></tr>
        <tr><td style="padding:32px 0 0;" align="center">
          <p style="margin:0;font-size:12px;color:#999;">
            <a href="https://envrt.com" style="color:#1a7a6d;text-decoration:none;">envrt.com</a>
            &nbsp;&middot;&nbsp;
            <a href="https://envrt.com/privacy" style="color:#1a7a6d;text-decoration:none;">Privacy</a>
            &nbsp;&middot;&nbsp;
            <a href="https://envrt.com/terms" style="color:#1a7a6d;text-decoration:none;">Terms</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

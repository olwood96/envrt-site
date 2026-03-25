import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";
import { verifyWebhookSignature, isValidPlan, isValidInterval, isValidCurrency } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { escapeHtml } from "@/lib/form-security";

// In-memory set of processed event IDs to prevent duplicate handling.
// Stripe can retry webhooks, so we track which events we've already processed.
const processedEvents = new Set<string>();
const MAX_PROCESSED_EVENTS = 10_000;

function markEventProcessed(eventId: string): boolean {
  if (processedEvents.has(eventId)) return false; // already processed
  if (processedEvents.size >= MAX_PROCESSED_EVENTS) {
    // Evict oldest entries (Sets iterate in insertion order)
    const first = processedEvents.values().next().value;
    if (first) processedEvents.delete(first);
  }
  processedEvents.add(eventId);
  return true; // first time processing
}

// Stripe sends the raw body; we must read it as text for signature verification
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

  // Idempotency: skip events we've already processed
  if (!markEventProcessed(event.id)) {
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

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        // Unhandled event type — acknowledge receipt
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

// ── Handlers ──────────────────────────────────────────────────────────────

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

  // Write subscription to Supabase
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
    minimum_term_months: 6,
    term_start: termStart.toISOString(),
    term_end: termEnd.toISOString(),
  });

  if (insertError) {
    console.error("Failed to insert subscription:", insertError);
    throw insertError;
  }

  // Generate Supabase Auth invite link for the dashboard
  const dashboardUrl =
    process.env.DASHBOARD_URL || "https://dashboard.envrt.com";

  const { data: linkData, error: linkError } =
    await supabase.auth.admin.generateLink({
      type: "invite",
      email: email.toLowerCase(),
      options: {
        redirectTo: `${dashboardUrl}/auth/callback?next=/auth/set-password`,
      },
    });

  if (linkError) {
    // User may already exist — that's OK, we'll notify admin
    console.error("Failed to generate invite link:", linkError.message);
    await sendAdminNotification(email, plan, interval, currency, false);
    return;
  }

  // Send branded welcome email via Resend with the invite link
  const inviteUrl = linkData?.properties?.action_link;
  if (inviteUrl) {
    await sendWelcomeEmail(email, plan, inviteUrl);
  }

  // Notify admin
  await sendAdminNotification(email, plan, interval, currency, true);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const supabase = getSupabaseAdmin();
  const stripeSubId = subscription.id;

  // Map Stripe status to our status
  let status: string;
  switch (subscription.status) {
    case "active":
      status = "active";
      break;
    case "past_due":
      status = "past_due";
      break;
    case "canceled":
      status = "cancelled";
      break;
    case "unpaid":
      status = "unpaid";
      break;
    case "incomplete":
    case "incomplete_expired":
      status = "incomplete";
      break;
    default:
      status = subscription.status;
  }

  const { error } = await supabase
    .from("subscriptions")
    .update({ status })
    .eq("stripe_subscription_id", stripeSubId);

  if (error) {
    console.error("Failed to update subscription status:", error);
    throw error;
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
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const email =
    typeof invoice.customer_email === "string"
      ? invoice.customer_email
      : null;

  // Notify admin about the failed payment
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

// ── Email helpers ─────────────────────────────────────────────────────────

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
    console.error("RESEND_API_KEY not set — skipping welcome email");
    return;
  }

  const resend = new Resend(apiKey);
  const planLabel = PLAN_LABELS[plan] || plan;

  const { error: sendError } = await resend.emails.send({
    from: "ENVRT <info@envrt.com>",
    to: email,
    subject: `Welcome to ENVRT — your ${planLabel} plan is active`,
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
    subject: `New subscription: ${escapeHtml(email)} — ${planLabel}`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;">
        <h2 style="color:#1b3a2d;">New Subscription</h2>
        <table style="border-collapse:collapse;width:100%;margin-bottom:20px;">
          <tr><td style="padding:6px 12px;color:#666;">Email</td><td style="padding:6px 12px;font-weight:600;">${escapeHtml(email)}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Plan</td><td style="padding:6px 12px;font-weight:600;">${escapeHtml(planLabel)} (${escapeHtml(interval)})</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Currency</td><td style="padding:6px 12px;font-weight:600;">${currency.toUpperCase()}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Invite sent</td><td style="padding:6px 12px;font-weight:600;">${inviteSent ? "Yes" : "No — user may already exist"}</td></tr>
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

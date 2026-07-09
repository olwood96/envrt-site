// src/lib/email/templates/stripe-emails.ts
// Stripe webhook emails (welcome + billing alerts). Registered in
// src/lib/email/previews.ts — any new email here must add a preview fixture.

import {
  renderEmail,
  heading,
  paragraph,
  mutedParagraph,
  primaryButton,
  textLink,
  internalAlertHtml,
  alertCallout,
  escapeHtml,
} from "@/lib/email/layout";

export function buildStripeWelcomeHtml(planLabel: string, inviteUrl: string): string {
  return renderEmail({
    preheader: `Your ${planLabel} plan is active. Set up your dashboard account.`,
    contentHtml: [
      heading("Welcome to ENVRT"),
      paragraph(
        `Your <strong>${escapeHtml(planLabel)}</strong> plan is now active. Click the button below to set up your dashboard account and get started.`
      ),
      primaryButton(inviteUrl, "Set up your account"),
      mutedParagraph(
        `This link will expire in 24 hours. If it expires, you can request a new one at ${textLink("https://envrt.com", "envrt.com")}.`
      ),
    ].join(""),
    footerNote: "You're receiving this because you subscribed to an ENVRT plan.",
  });
}

export function buildPaymentFailedHtml(data: { email: string; invoiceId: string }): string {
  return internalAlertHtml({
    title: "Payment failed",
    rows: [
      ["Customer", data.email],
      ["Invoice ID", data.invoiceId],
    ],
    bodyHtml: alertCallout(
      "Stripe will retry automatically. Check the Stripe dashboard for details."
    ),
    ctaHref: "https://dashboard.stripe.com/payments",
    ctaLabel: "Open Stripe",
  });
}

export function buildUnresolvedPriceHtml(data: {
  subscriptionId: string;
  priceId: string;
}): string {
  return internalAlertHtml({
    title: "Unresolved Stripe price",
    rows: [
      ["Subscription", data.subscriptionId],
      ["Price ID", data.priceId],
    ],
    bodyHtml: alertCallout(
      "A subscription event fired with a price ID that does not match any self-serve env var and the Stripe product has no <code>metadata.tier</code>. The brand was not touched. Either add the price ID to env, or set <code>metadata.tier</code> on the Stripe product, then trigger a sync."
    ),
  });
}

export function buildNewSubscriptionHtml(data: {
  email: string;
  planLabel: string;
  interval: string;
  currency: string;
  inviteSent: boolean;
}): string {
  return internalAlertHtml({
    title: "New subscription",
    rows: [
      ["Email", data.email],
      ["Plan", `${data.planLabel} (${data.interval})`],
      ["Currency", data.currency.toUpperCase()],
      ["Invite sent", data.inviteSent ? "Yes" : "No, user may already exist"],
    ],
    bodyHtml: !data.inviteSent
      ? alertCallout(
          "The user may already have a Supabase account. You may need to manually link them to a brand or resend the invite from the dashboard."
        )
      : "",
  });
}

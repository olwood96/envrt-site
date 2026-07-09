// src/lib/email/previews.ts
// Catalogue of every email the site sends, rendered with fixture data.
// Served to the dashboard's admin email catalogue via
// /api/admin/email-previews so all outbound comms can be eyeballed and
// test-sent from one place.
//
// RULE: any new outbound email must (1) build its HTML in
// src/lib/email/templates/ on the shared v3 shell, and (2) register a
// preview here. The drift guard in __tests__/previews.test.ts fails the
// build if a route sends email from an unregistered file.

import {
  buildContactConfirmationHtml,
  buildContactInternalHtml,
} from "./templates/contact-emails";
import {
  buildAssessmentResultHtml,
  buildAssessmentInternalHtml,
  type AssessmentEmailData,
} from "./templates/assessment-emails";
import {
  buildRoiResultHtml,
  buildRoiInternalHtml,
  type RoiEmailData,
} from "./templates/roi-emails";
import { buildTrialRequestInternalHtml } from "./templates/freedpp-emails";
import {
  buildStripeWelcomeHtml,
  buildPaymentFailedHtml,
  buildUnresolvedPriceHtml,
  buildNewSubscriptionHtml,
} from "./templates/stripe-emails";
import {
  buildConfirmationEmail,
  buildDigestEmail,
} from "@/lib/collective/email-templates";

/** Files allowed to call the Resend send APIs. The drift guard test fails
 * if any other file sends email. */
export const REGISTERED_EMAIL_SOURCES = [
  "src/app/api/contact/route.ts",
  "src/app/api/assessment-lead/route.ts",
  "src/app/api/roi-lead/route.ts",
  "src/app/api/free-dpp/route.ts",
  "src/app/api/stripe/webhook/route.ts",
  "src/app/api/collective/subscribe/route.ts",
  "src/app/api/cron/collective-digest/route.ts",
];

export interface EmailPreview {
  key: string;
  name: string;
  audience: "customer" | "internal";
  from: string;
  subject: string;
  html: string;
}

const ASSESSMENT_FIXTURE: AssessmentEmailData = {
  firstName: "Jane",
  brandName: "Acme Studio",
  email: "jane@acmestudio.com",
  overall: 62,
  band: "Getting Ready",
  headline: "Acme Studio is on the way, with clear gaps to close before 2027.",
  summary:
    "You have solid product data foundations but supply chain visibility and claim substantiation need work before the ESPR delegated act lands.",
  dimensions: [
    { label: "Product Data", score: 78 },
    { label: "Supply Chain Visibility", score: 51 },
    { label: "Claims & Compliance", score: 44 },
    { label: "Systems Readiness", score: 75 },
  ],
  actions: [
    "Map your tier 2 suppliers for your best-selling range.",
    "Collect certificates for the sustainability claims already on your site.",
    "Pilot a DPP on one hero product this season.",
  ],
  timelineRisk:
    "Selling in the EU means the ESPR textile delegated act will apply to you in the first wave. Brands starting now typically need 12-18 months to be ready.",
  greenClaimsFlag: true,
  marketingConsent: true,
};

const ROI_FIXTURE: RoiEmailData = {
  firstName: "Jane",
  brandName: "Acme Studio",
  email: "jane@acmestudio.com",
  marketingConsent: true,
  skuCount: 120,
  dataMaturity: "partial",
  hoursPerProduct: 6,
  market: "EU + UK",
  approach: "consultant",
  envrtCost: 5940,
  envrtPlan: "Growth",
  envrtPlanPrice: "£495/mo",
  consultantCost: 48000,
  inhouseCost: 21600,
  maxSaving: 42060,
  hoursSaved: 620,
  daysSaved: 78,
};

export function getSiteEmailPreviews(): EmailPreview[] {
  return [
    {
      key: "site.contact.confirmation",
      name: "Contact form auto-reply",
      audience: "customer",
      from: "ENVRT <info@envrt.com>",
      subject: "Thanks for contacting ENVRT",
      html: buildContactConfirmationHtml("Jane"),
    },
    {
      key: "site.contact.internal",
      name: "Contact form internal alert",
      audience: "internal",
      from: "ENVRT System <info@envrt.com>",
      subject: "Contact: Jane Doe @ Acme Studio",
      html: buildContactInternalHtml({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@acmestudio.com",
        company: "Acme Studio",
        interest: "Growth plan",
        message: "We have 120 SKUs and need DPPs before SS27. Can you walk us through the setup?",
      }),
    },
    {
      key: "site.assessment.result",
      name: "DPP readiness assessment results",
      audience: "customer",
      from: "ENVRT <results@envrt.com>",
      subject: "Your DPP Readiness Score: 62/100 - Getting Ready",
      html: buildAssessmentResultHtml(ASSESSMENT_FIXTURE),
    },
    {
      key: "site.assessment.internal",
      name: "Assessment lead internal alert",
      audience: "internal",
      from: "ENVRT System <results@envrt.com>",
      subject: "Assessment Lead: Jane @ Acme Studio (62/100)",
      html: buildAssessmentInternalHtml(ASSESSMENT_FIXTURE),
    },
    {
      key: "site.roi.result",
      name: "ROI calculator results",
      audience: "customer",
      from: "ENVRT <results@envrt.com>",
      subject: "Your DPP Compliance Savings: £42,060/yr with ENVRT",
      html: buildRoiResultHtml(ROI_FIXTURE),
    },
    {
      key: "site.roi.internal",
      name: "ROI lead internal alert",
      audience: "internal",
      from: "ENVRT System <results@envrt.com>",
      subject: "ROI Lead: Jane @ Acme Studio (£42,060 saving)",
      html: buildRoiInternalHtml(ROI_FIXTURE),
    },
    {
      key: "site.freedpp.internal",
      name: "Trial DPP request internal alert",
      audience: "internal",
      from: "ENVRT System <noreply@envrt.com>",
      subject: "New trial DPP request: Acme Studio",
      html: buildTrialRequestInternalHtml({
        contactName: "Jane Doe",
        brandName: "Acme Studio",
        contactEmail: "jane@acmestudio.com",
        garmentName: "Organic Cotton Tee",
        garmentType: "T-shirt",
        materialsSummary: "Organic cotton (95%), Elastane (5%)",
        weightG: 180,
        countryAssembly: "Portugal",
        productUrl: "https://acmestudio.com/products/organic-tee",
      }),
    },
    {
      key: "site.stripe.welcome",
      name: "Subscription welcome (plan active)",
      audience: "customer",
      from: "ENVRT <info@envrt.com>",
      subject: "Welcome to ENVRT, your Growth plan is active",
      html: buildStripeWelcomeHtml("Growth", "https://dashboard.envrt.com/auth/invite?token=example"),
    },
    {
      key: "site.stripe.payment-failed",
      name: "Payment failed internal alert",
      audience: "internal",
      from: "ENVRT System <info@envrt.com>",
      subject: "Payment failed: jane@acmestudio.com",
      html: buildPaymentFailedHtml({ email: "jane@acmestudio.com", invoiceId: "in_1QExample" }),
    },
    {
      key: "site.stripe.unresolved-price",
      name: "Unresolved Stripe price internal alert",
      audience: "internal",
      from: "ENVRT System <info@envrt.com>",
      subject: "Unresolved Stripe price ID: price_1QExample",
      html: buildUnresolvedPriceHtml({ subscriptionId: "sub_1QExample", priceId: "price_1QExample" }),
    },
    {
      key: "site.stripe.new-subscription",
      name: "New subscription internal alert",
      audience: "internal",
      from: "ENVRT System <info@envrt.com>",
      subject: "New subscription: jane@acmestudio.com Growth",
      html: buildNewSubscriptionHtml({
        email: "jane@acmestudio.com",
        planLabel: "Growth",
        interval: "month",
        currency: "gbp",
        inviteSent: true,
      }),
    },
    {
      key: "site.collective.confirm",
      name: "Collective subscription confirmation",
      audience: "customer",
      from: "ENVRT Collective <collective@envrt.com>",
      subject: "Confirm your Collective subscription",
      html: buildConfirmationEmail("https://envrt.com/api/collective/confirm?token=example"),
    },
    {
      key: "site.collective.digest",
      name: "Collective weekly digest",
      audience: "customer",
      from: "ENVRT Collective <collective@envrt.com>",
      subject: "2 new products on The Collective",
      html: buildDigestEmail(
        [
          {
            name: "Organic Cotton Tee",
            brand: "Acme Studio",
            imageUrl: null,
            detailUrl: "https://envrt.com/collective/acme-studio/organic-tee",
            emissions: 4.2,
            water: 1200,
          },
          {
            name: "Recycled Wool Jumper",
            brand: "North Loop",
            imageUrl: null,
            detailUrl: "https://envrt.com/collective/north-loop/wool-jumper",
            emissions: 9.8,
            water: 800,
          },
        ],
        "https://envrt.com/api/collective/unsubscribe?token=example",
      ),
    },
  ];
}

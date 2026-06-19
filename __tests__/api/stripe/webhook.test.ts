import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Resend
const mockSendEmail = vi.fn().mockResolvedValue({ data: { id: "email-id" }, error: null });
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mockSendEmail };
  },
}));

// Mock Supabase admin
const mockSubscriptionsInsert = vi.fn().mockResolvedValue({ error: null });
const mockSubscriptionsUpdate = vi.fn().mockReturnValue({
  eq: vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ error: null }),
  }),
});
const mockStripeEventsInsert = vi.fn().mockResolvedValue({ error: null });
const mockBrandsSelect = vi.fn().mockReturnValue({
  eq: vi.fn().mockReturnValue({
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  }),
});
const mockBrandsUpdate = vi.fn().mockReturnValue({
  eq: vi.fn().mockResolvedValue({ error: null }),
});

const mockGenerateLink = vi.fn().mockResolvedValue({
  data: {
    properties: {
      action_link: "https://dashboard.envrt.com/auth/callback?token=abc123",
    },
  },
  error: null,
});

vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: () => ({
    from: (table: string) => {
      if (table === "subscriptions") {
        return {
          insert: mockSubscriptionsInsert,
          update: (..._args: unknown[]) => {
            const chain = mockSubscriptionsUpdate(..._args);
            return chain;
          },
        };
      }
      if (table === "stripe_events") {
        return { insert: mockStripeEventsInsert };
      }
      if (table === "brands") {
        return {
          select: (..._args: unknown[]) => mockBrandsSelect(..._args),
          update: (..._args: unknown[]) => mockBrandsUpdate(..._args),
        };
      }
      return { insert: vi.fn().mockResolvedValue({ error: null }) };
    },
    auth: {
      admin: {
        generateLink: mockGenerateLink,
      },
    },
  }),
}));

// Stripe SDK call mock used by autoLinkBrandFromMetadata
const mockSubscriptionsRetrieve = vi.fn().mockResolvedValue({
  items: { data: [{ price: { id: "price_test", product: "prod_test" } }] },
});
const mockProductsRetrieve = vi.fn().mockResolvedValue({
  id: "prod_test",
  metadata: {}, // no brand_id by default → falls back to self-serve invite path
});

// Mock Stripe lib (verification, validators, resolver, TIER_FEATURES, getStripe)
vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    subscriptions: { retrieve: mockSubscriptionsRetrieve },
    products: { retrieve: mockProductsRetrieve },
  }),
  verifyWebhookSignature: (body: string, signature: string) => {
    if (signature === "valid-sig") {
      return JSON.parse(body);
    }
    return null;
  },
  isValidPlan: (p: string) => ["starter", "growth", "pro"].includes(p),
  isValidInterval: (i: string) => ["monthly", "annual"].includes(i),
  isValidCurrency: (c: string) => ["gbp", "eur", "usd"].includes(c),
  resolvePlanFromSubscription: vi.fn().mockResolvedValue({
    plan: "growth",
    source: "self_serve",
  }),
  TIER_FEATURES: {
    starter: { show_overview: true },
    growth: { show_overview: true, show_metrics: true },
    pro: { show_overview: true, show_metrics: true, show_reports: true },
  },
}));

import { POST } from "@/app/api/stripe/webhook/route";
import { NextRequest } from "next/server";

function makeWebhookRequest(
  event: object,
  signature: string = "valid-sig"
): NextRequest {
  return new NextRequest("https://envrt.com/api/stripe/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": signature,
    },
    body: JSON.stringify(event),
  });
}

let eventCounter = 0;
function uniqueId() {
  return `evt_test_${++eventCounter}`;
}

function makeCheckoutCompletedEvent() {
  return {
    id: uniqueId(),
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_123",
        customer_email: "brand@example.com",
        customer: "cus_abc123",
        subscription: "sub_xyz789",
        metadata: {
          plan: "growth",
          interval: "monthly",
          currency: "gbp",
          term_months: "12",
        },
      },
    },
  };
}

function makeSubscriptionUpdatedEvent() {
  return {
    id: uniqueId(),
    type: "customer.subscription.updated",
    data: {
      object: {
        id: "sub_xyz789",
        status: "past_due",
        items: {
          data: [
            {
              price: {
                id: "price_growth_monthly_gbp",
                product: "prod_growth",
              },
            },
          ],
        },
      },
    },
  };
}

function makeSubscriptionDeletedEvent() {
  return {
    id: uniqueId(),
    type: "customer.subscription.deleted",
    data: {
      object: {
        id: "sub_xyz789",
        status: "canceled",
      },
    },
  };
}

function makePaymentFailedEvent() {
  return {
    id: uniqueId(),
    type: "invoice.payment_failed",
    data: {
      object: {
        id: "in_test_456",
        customer_email: "brand@example.com",
        subscription: "sub_xyz789",
      },
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.RESEND_API_KEY = "test-key";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  // Default: claimEvent succeeds (new event)
  mockStripeEventsInsert.mockResolvedValue({ error: null });
  // Default: no brand linked
  mockBrandsSelect.mockReturnValue({
    eq: vi.fn().mockReturnValue({
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  });
});

describe("POST /api/stripe/webhook", () => {
  it("returns 400 when stripe-signature header is missing", async () => {
    const req = new NextRequest("https://envrt.com/api/stripe/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(makeCheckoutCompletedEvent()),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("signature");
  });

  it("returns 400 for invalid signature", async () => {
    const res = await POST(
      makeWebhookRequest(makeCheckoutCompletedEvent(), "invalid-sig")
    );
    expect(res.status).toBe(400);
  });

  describe("idempotency", () => {
    it("skips events already claimed in stripe_events", async () => {
      // Simulate unique-violation: row already exists
      mockStripeEventsInsert.mockResolvedValueOnce({
        error: { code: "23505", message: "duplicate key" },
      });

      const res = await POST(makeWebhookRequest(makeCheckoutCompletedEvent()));
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.deduplicated).toBe(true);
      expect(mockSubscriptionsInsert).not.toHaveBeenCalled();
    });
  });

  describe("checkout.session.completed", () => {
    it("writes subscription to Supabase", async () => {
      const res = await POST(makeWebhookRequest(makeCheckoutCompletedEvent()));
      expect(res.status).toBe(200);

      expect(mockSubscriptionsInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "brand@example.com",
          stripe_customer_id: "cus_abc123",
          stripe_subscription_id: "sub_xyz789",
          plan: "growth",
          interval: "monthly",
          currency: "gbp",
          status: "active",
          term_months: 12,
          minimum_term_months: 12,
        })
      );
    });

    it("generates invite link via Supabase Auth", async () => {
      await POST(makeWebhookRequest(makeCheckoutCompletedEvent()));
      expect(mockGenerateLink).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "invite",
          email: "brand@example.com",
        })
      );
    });

    it("sends welcome email via Resend", async () => {
      await POST(makeWebhookRequest(makeCheckoutCompletedEvent()));
      expect(mockSendEmail).toHaveBeenCalledTimes(2);
      expect(mockSendEmail.mock.calls[0][0].to).toBe("brand@example.com");
      expect(mockSendEmail.mock.calls[0][0].subject).toContain("Growth");
    });

    it("sends admin notification email", async () => {
      await POST(makeWebhookRequest(makeCheckoutCompletedEvent()));
      const adminCall = mockSendEmail.mock.calls[1][0];
      expect(adminCall.to).toBe("info@envrt.com");
      expect(adminCall.subject).toContain("brand@example.com");
      expect(adminCall.subject).toContain("Growth");
    });
  });

  describe("customer.subscription.updated", () => {
    it("updates subscription in Supabase and looks up the brand", async () => {
      const res = await POST(makeWebhookRequest(makeSubscriptionUpdatedEvent()));
      expect(res.status).toBe(200);
      expect(mockSubscriptionsUpdate).toHaveBeenCalled();
      expect(mockBrandsSelect).toHaveBeenCalled();
    });
  });

  describe("customer.subscription.deleted", () => {
    it("marks subscription as cancelled and looks up the brand", async () => {
      const res = await POST(makeWebhookRequest(makeSubscriptionDeletedEvent()));
      expect(res.status).toBe(200);
      expect(mockSubscriptionsUpdate).toHaveBeenCalled();
      expect(mockBrandsSelect).toHaveBeenCalled();
    });
  });

  describe("invoice.payment_failed", () => {
    it("marks subscription past_due and sends admin notification", async () => {
      const res = await POST(makeWebhookRequest(makePaymentFailedEvent()));
      expect(res.status).toBe(200);
      expect(mockSubscriptionsUpdate).toHaveBeenCalled();
      expect(mockSendEmail).toHaveBeenCalledTimes(1);
      expect(mockSendEmail.mock.calls[0][0].subject).toContain("Payment failed");
    });
  });

  it("acknowledges unhandled event types", async () => {
    const unknownEvent = {
      id: uniqueId(),
      type: "some.unknown.event",
      data: { object: {} },
    };
    const res = await POST(makeWebhookRequest(unknownEvent));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.received).toBe(true);
  });
});

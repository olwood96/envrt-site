import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Resend
const mockSendEmail = vi.fn().mockResolvedValue({ data: { id: "email-id" }, error: null });
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mockSendEmail };
  },
}));

// Mock Supabase admin
const mockInsert = vi.fn().mockResolvedValue({ error: null });
const mockUpdate = vi.fn().mockReturnValue({
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
          insert: mockInsert,
          update: () => mockUpdate(),
        };
      }
      return { insert: mockInsert };
    },
    auth: {
      admin: {
        generateLink: mockGenerateLink,
      },
    },
  }),
}));

// Mock Stripe webhook verification + validation functions
vi.mock("@/lib/stripe", () => ({
  verifyWebhookSignature: (body: string, signature: string) => {
    if (signature === "valid-sig") {
      return JSON.parse(body);
    }
    return null;
  },
  isValidPlan: (p: string) => ["starter", "growth", "pro"].includes(p),
  isValidInterval: (i: string) => ["monthly", "annual"].includes(i),
  isValidCurrency: (c: string) => ["gbp", "eur"].includes(c),
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

// Each event factory returns a fresh object with a unique ID for idempotency
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
      },
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.RESEND_API_KEY = "test-key";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
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

  describe("checkout.session.completed", () => {
    it("writes subscription to Supabase", async () => {
      const res = await POST(makeWebhookRequest(makeCheckoutCompletedEvent()));
      expect(res.status).toBe(200);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "brand@example.com",
          stripe_customer_id: "cus_abc123",
          stripe_subscription_id: "sub_xyz789",
          plan: "growth",
          interval: "monthly",
          currency: "gbp",
          status: "active",
          term_months: 12,
          minimum_term_months: 6,
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
      // Welcome email + admin notification = 2 emails
      expect(mockSendEmail).toHaveBeenCalledTimes(2);
      // First call is welcome email
      expect(mockSendEmail.mock.calls[0][0].to).toBe("brand@example.com");
      expect(mockSendEmail.mock.calls[0][0].subject).toContain("Growth");
    });

    it("sends admin notification email", async () => {
      await POST(makeWebhookRequest(makeCheckoutCompletedEvent()));
      // Second call is admin notification
      const adminCall = mockSendEmail.mock.calls[1][0];
      expect(adminCall.to).toBe("info@envrt.com");
      expect(adminCall.subject).toContain("brand@example.com");
      expect(adminCall.subject).toContain("Growth");
    });
  });

  describe("customer.subscription.updated", () => {
    it("updates subscription status in Supabase", async () => {
      const res = await POST(makeWebhookRequest(makeSubscriptionUpdatedEvent()));
      expect(res.status).toBe(200);
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe("customer.subscription.deleted", () => {
    it("marks subscription as cancelled", async () => {
      const res = await POST(makeWebhookRequest(makeSubscriptionDeletedEvent()));
      expect(res.status).toBe(200);
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe("invoice.payment_failed", () => {
    it("sends admin notification", async () => {
      const res = await POST(makeWebhookRequest(makePaymentFailedEvent()));
      expect(res.status).toBe(200);
      expect(mockSendEmail).toHaveBeenCalledTimes(1);
      expect(mockSendEmail.mock.calls[0][0].subject).toContain(
        "Payment failed"
      );
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

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Stripe
const mockCreate = vi.fn().mockResolvedValue({
  url: "https://checkout.stripe.com/test-session",
});

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    checkout: { sessions: { create: mockCreate } },
  }),
  isValidPlan: (p: string) => ["starter", "growth", "pro"].includes(p),
  isValidInterval: (i: string) => ["monthly", "annual"].includes(i),
  isValidCurrency: (c: string) => ["gbp", "eur"].includes(c),
}));

import { POST } from "@/app/api/stripe/checkout/route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown, ip?: string): NextRequest {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (ip) headers["x-forwarded-for"] = ip;
  return new NextRequest("https://envrt.com/api/stripe/checkout", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/stripe/checkout", () => {
  it("returns checkout URL for valid request", async () => {
    const res = await POST(
      makeRequest(
        { plan: "starter", interval: "monthly", currency: "gbp" },
        "10.0.0.1"
      )
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.url).toBe("https://checkout.stripe.com/test-session");
    expect(mockCreate).toHaveBeenCalledOnce();
  });

  it("builds the price inline from the plans source of truth (no pre-created price ID)", async () => {
    await POST(
      makeRequest(
        { plan: "starter", interval: "monthly", currency: "eur" },
        "10.0.0.2"
      )
    );
    const createArgs = mockCreate.mock.calls[0][0];
    const li = createArgs.line_items[0];
    // No pre-created Stripe Price ID; the amount comes straight from PLAN_PRICES.
    expect(li.price).toBeUndefined();
    expect(li.price_data.currency).toBe("eur");
    expect(li.price_data.unit_amount).toBe(24900); // €249.00, the canonical Starter EUR price
    expect(li.price_data.recurring.interval).toBe("month");
    expect(li.price_data.product_data.name).toBe("ENVRT Starter");
    // Metadata is what the webhook resolves the plan from.
    expect(createArgs.subscription_data.metadata.plan).toBe("starter");
    expect(createArgs.metadata.term_months).toBe("12");
    expect(createArgs.mode).toBe("subscription");
  });

  it("uses the annual amount with a yearly recurring interval", async () => {
    await POST(
      makeRequest(
        { plan: "growth", interval: "annual", currency: "eur" },
        "10.0.0.22"
      )
    );
    const li = mockCreate.mock.calls[0][0].line_items[0];
    expect(li.price_data.unit_amount).toBe(596700); // €5,967.00 Growth annual
    expect(li.price_data.recurring.interval).toBe("year");
  });

  it("pre-fills customer email when provided", async () => {
    await POST(
      makeRequest(
        {
          plan: "starter",
          interval: "monthly",
          currency: "gbp",
          email: "test@example.com",
        },
        "10.0.0.3"
      )
    );
    const createArgs = mockCreate.mock.calls[0][0];
    expect(createArgs.customer_email).toBe("test@example.com");
  });

  it("returns 400 for invalid plan", async () => {
    const res = await POST(
      makeRequest(
        { plan: "free", interval: "monthly", currency: "gbp" },
        "10.0.0.4"
      )
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("plan");
  });

  it("returns 400 for invalid interval", async () => {
    const res = await POST(
      makeRequest(
        { plan: "starter", interval: "weekly", currency: "gbp" },
        "10.0.0.5"
      )
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid currency", async () => {
    const res = await POST(
      makeRequest(
        { plan: "starter", interval: "monthly", currency: "usd" },
        "10.0.0.6"
      )
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid email", async () => {
    const res = await POST(
      makeRequest(
        {
          plan: "starter",
          interval: "monthly",
          currency: "gbp",
          email: "not-an-email",
        },
        "10.0.0.7"
      )
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("email");
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new NextRequest("https://envrt.com/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 when price ID is not configured", async () => {
    const res = await POST(
      makeRequest(
        { plan: "pro", interval: "monthly", currency: "gbp" },
        "10.0.0.8"
      )
    );
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toContain("not available");
  });

  it("rate limits after 10 requests from same IP", async () => {
    const ip = `rate-test-checkout-${Date.now()}`;
    for (let i = 0; i < 10; i++) {
      const res = await POST(
        makeRequest(
          { plan: "starter", interval: "monthly", currency: "gbp" },
          ip
        )
      );
      expect(res.status).toBe(200);
    }
    // 11th request should be rate-limited
    const res = await POST(
      makeRequest(
        { plan: "starter", interval: "monthly", currency: "gbp" },
        ip
      )
    );
    expect(res.status).toBe(429);
  });
});

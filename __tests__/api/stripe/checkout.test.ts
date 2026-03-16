import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Stripe
const mockCreate = vi.fn().mockResolvedValue({
  url: "https://checkout.stripe.com/test-session",
});

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    checkout: { sessions: { create: mockCreate } },
  }),
  getStripePriceId: (plan: string, interval: string, currency: string) => {
    if (plan === "starter" && interval === "monthly" && currency === "gbp") {
      return "price_starter_monthly_gbp";
    }
    if (plan === "growth" && interval === "annual" && currency === "eur") {
      return "price_growth_annual_eur";
    }
    return null;
  },
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

  it("passes correct price ID and metadata to Stripe", async () => {
    await POST(
      makeRequest(
        { plan: "starter", interval: "monthly", currency: "gbp" },
        "10.0.0.2"
      )
    );
    const createArgs = mockCreate.mock.calls[0][0];
    expect(createArgs.line_items[0].price).toBe("price_starter_monthly_gbp");
    expect(createArgs.metadata.plan).toBe("starter");
    expect(createArgs.metadata.interval).toBe("monthly");
    expect(createArgs.metadata.currency).toBe("gbp");
    expect(createArgs.metadata.term_months).toBe("12");
    expect(createArgs.mode).toBe("subscription");
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

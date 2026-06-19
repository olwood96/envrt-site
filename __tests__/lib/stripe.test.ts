import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Stripe SDK so we can drive products.retrieve from each test.
// resolvePlanFromSubscription calls getStripe().products.retrieve(productId).
const mockProductsRetrieve = vi.fn();
vi.mock("stripe", () => ({
  default: class {
    products = { retrieve: mockProductsRetrieve };
    webhooks = { constructEvent: vi.fn() };
    billingPortal = { sessions: { create: vi.fn() } };
    checkout = { sessions: { create: vi.fn() } };
  },
}));

import {
  isValidPlan,
  isValidInterval,
  isValidCurrency,
  getStripePriceId,
  resolvePlanFromSubscription,
  TIER_FEATURES,
} from "@/lib/stripe";
import type Stripe from "stripe";

function fakeSubscription(opts: {
  priceId?: string;
  productId?: string;
}): Stripe.Subscription {
  return {
    items: {
      data: [
        {
          price: {
            id: opts.priceId ?? "price_fake",
            product: opts.productId ?? "prod_fake",
          },
        },
      ],
    },
  } as unknown as Stripe.Subscription;
}

describe("stripe lib", () => {
  describe("isValidPlan", () => {
    it("accepts valid plans", () => {
      expect(isValidPlan("starter")).toBe(true);
      expect(isValidPlan("growth")).toBe(true);
      expect(isValidPlan("pro")).toBe(true);
    });

    it("rejects invalid plans", () => {
      expect(isValidPlan("free")).toBe(false);
      expect(isValidPlan("enterprise")).toBe(false);
      expect(isValidPlan("")).toBe(false);
    });
  });

  describe("isValidInterval", () => {
    it("accepts valid intervals", () => {
      expect(isValidInterval("monthly")).toBe(true);
      expect(isValidInterval("annual")).toBe(true);
    });

    it("rejects invalid intervals", () => {
      expect(isValidInterval("weekly")).toBe(false);
      expect(isValidInterval("")).toBe(false);
    });
  });

  describe("isValidCurrency", () => {
    it("accepts valid currencies", () => {
      expect(isValidCurrency("gbp")).toBe(true);
      expect(isValidCurrency("eur")).toBe(true);
      expect(isValidCurrency("usd")).toBe(true);
    });

    it("rejects invalid currencies", () => {
      expect(isValidCurrency("jpy")).toBe(false);
      expect(isValidCurrency("GBP")).toBe(false);
      expect(isValidCurrency("")).toBe(false);
    });
  });

  describe("getStripePriceId", () => {
    beforeEach(() => {
      vi.unstubAllEnvs();
    });

    it("returns the price ID from env vars", () => {
      vi.stubEnv("STRIPE_PRICE_STARTER_MONTHLY_GBP", "price_abc123");
      expect(getStripePriceId("starter", "monthly", "gbp")).toBe("price_abc123");
    });

    it("returns null when env var is missing", () => {
      expect(getStripePriceId("starter", "annual", "eur")).toBeNull();
    });

    it("constructs correct env var name for all combinations", () => {
      vi.stubEnv("STRIPE_PRICE_PRO_ANNUAL_EUR", "price_pro_ann_eur");
      expect(getStripePriceId("pro", "annual", "eur")).toBe("price_pro_ann_eur");
    });
  });

  describe("resolvePlanFromSubscription", () => {
    beforeEach(() => {
      vi.unstubAllEnvs();
      mockProductsRetrieve.mockReset();
      vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_fake");
    });

    it("returns null when the subscription has no items", async () => {
      const sub = { items: { data: [] } } as unknown as Stripe.Subscription;
      const result = await resolvePlanFromSubscription(sub);
      expect(result).toBeNull();
    });

    it("returns a custom-source result when product.metadata.tier is a valid plan", async () => {
      mockProductsRetrieve.mockResolvedValue({
        id: "prod_custom_fae",
        metadata: { tier: "growth" },
      });

      const result = await resolvePlanFromSubscription(
        fakeSubscription({ productId: "prod_custom_fae", priceId: "price_anything" })
      );

      expect(result).toEqual({ plan: "growth", source: "custom" });
    });

    it("normalises metadata.tier casing before validating", async () => {
      mockProductsRetrieve.mockResolvedValue({
        id: "prod_custom",
        metadata: { tier: "STARTER" },
      });

      const result = await resolvePlanFromSubscription(
        fakeSubscription({ productId: "prod_custom" })
      );

      expect(result).toEqual({ plan: "starter", source: "custom" });
    });

    it("ignores metadata.tier when it's not a known plan name", async () => {
      mockProductsRetrieve.mockResolvedValue({
        id: "prod_bogus",
        metadata: { tier: "enterprise" },
      });

      const result = await resolvePlanFromSubscription(
        fakeSubscription({ productId: "prod_bogus", priceId: "price_unmapped" })
      );

      expect(result).toBeNull();
    });

    it("returns null when both product metadata and PRICE_TO_PLAN miss", async () => {
      mockProductsRetrieve.mockResolvedValue({
        id: "prod_nometa",
        metadata: {},
      });

      const result = await resolvePlanFromSubscription(
        fakeSubscription({ productId: "prod_nometa", priceId: "price_unmapped" })
      );

      expect(result).toBeNull();
    });

    it("survives a thrown error from products.retrieve and still falls through to null when no map match", async () => {
      mockProductsRetrieve.mockRejectedValue(new Error("Stripe blew up"));

      const result = await resolvePlanFromSubscription(
        fakeSubscription({ productId: "prod_throws", priceId: "price_unmapped" })
      );

      expect(result).toBeNull();
    });
  });

  describe("TIER_FEATURES", () => {
    it("includes a feature set for every known plan", () => {
      expect(TIER_FEATURES.starter).toBeDefined();
      expect(TIER_FEATURES.growth).toBeDefined();
      expect(TIER_FEATURES.pro).toBeDefined();
    });

    it("starter does not expose paid-only features", () => {
      expect(TIER_FEATURES.starter.show_metrics).toBe(false);
      expect(TIER_FEATURES.starter.show_analytics).toBe(false);
      expect(TIER_FEATURES.starter.show_suppliers).toBe(false);
    });

    it("growth unlocks metrics, analytics and suppliers", () => {
      expect(TIER_FEATURES.growth.show_metrics).toBe(true);
      expect(TIER_FEATURES.growth.show_analytics).toBe(true);
      expect(TIER_FEATURES.growth.show_suppliers).toBe(true);
    });

    it("pro is a superset of growth, plus reports", () => {
      expect(TIER_FEATURES.pro.show_reports).toBe(true);
      expect(TIER_FEATURES.pro.show_metrics).toBe(true);
      expect(TIER_FEATURES.pro.show_analytics).toBe(true);
      expect(TIER_FEATURES.pro.show_suppliers).toBe(true);
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isValidPlan,
  isValidInterval,
  isValidCurrency,
  getStripePriceId,
} from "@/lib/stripe";

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
    });

    it("rejects invalid currencies", () => {
      expect(isValidCurrency("usd")).toBe(false);
      expect(isValidCurrency("GBP")).toBe(false);
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
});

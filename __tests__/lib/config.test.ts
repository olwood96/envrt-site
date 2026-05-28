import { describe, it, expect } from "vitest";
import { pricingPlans, pricingFaqItems } from "@/lib/config";

describe("pricingPlans config", () => {
  it("has Starter, Growth and Pro tiers in order", () => {
    expect(pricingPlans.map((p) => p.slug)).toEqual(["starter", "growth", "pro"]);
  });

  it("Starter and Growth have fixed GBP prices", () => {
    const starter = pricingPlans.find((p) => p.slug === "starter")!;
    const growth = pricingPlans.find((p) => p.slug === "growth")!;
    expect(starter.priceGBP).toBe(149);
    expect(starter.customPricing).toBeFalsy();
    expect(growth.priceGBP).toBe(495);
    expect(growth.customPricing).toBeFalsy();
  });

  it("Pro tier is marked custom-priced with no priceGBP", () => {
    const pro = pricingPlans.find((p) => p.slug === "pro")!;
    expect(pro.customPricing).toBe(true);
    expect(pro.priceGBP).toBeUndefined();
  });

  it("Pro tier carries a tailoring subline beyond just SKU count", () => {
    const pro = pricingPlans.find((p) => p.slug === "pro")!;
    expect(pro.customSubline).toBeTruthy();
    expect(pro.customSubline!.toLowerCase()).toMatch(/sku/);
    expect(pro.customSubline!.toLowerCase()).toMatch(/supplier|support/);
  });
});

describe("pricingFaqItems", () => {
  it("answers about cost do not quote the old Pro price", () => {
    const joined = pricingFaqItems.map((q) => q.answer).join(" ");
    expect(joined).not.toMatch(/1,?295/);
  });

  it("explains Pro pricing is custom in the cost FAQ", () => {
    const costFaq = pricingFaqItems.find((q) =>
      q.question.toLowerCase().includes("how much"),
    );
    expect(costFaq).toBeDefined();
    expect(costFaq!.answer.toLowerCase()).toMatch(/custom/);
  });
});

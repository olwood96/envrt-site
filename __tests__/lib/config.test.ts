import { describe, it, expect } from "vitest";
import { pricingPlans, pricingComparison, pricingFaqItems } from "@/lib/config";

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

  it("DPP scan and engagement analytics has moved from Starter to Growth+", () => {
    const starter = pricingPlans.find((p) => p.slug === "starter")!;
    const growth = pricingPlans.find((p) => p.slug === "growth")!;
    const matcher = /scan and engagement analytics/i;
    expect(starter.features.some((f) => matcher.test(f))).toBe(false);
    expect(growth.features.some((f) => matcher.test(f))).toBe(true);
  });

  it("each tier declares its team seat allowance", () => {
    const starter = pricingPlans.find((p) => p.slug === "starter")!;
    const growth = pricingPlans.find((p) => p.slug === "growth")!;
    const pro = pricingPlans.find((p) => p.slug === "pro")!;
    expect(starter.features.some((f) => /1 team seat|1 user seat|1 seat/i.test(f))).toBe(true);
    expect(growth.features.some((f) => /5 team seats|5 user seats|5 seats/i.test(f))).toBe(true);
    expect(pro.features.some((f) => /unlimited (team |user )?seats/i.test(f))).toBe(true);
  });
});

describe("pricingComparison", () => {
  it("includes a Team and Access category with a seat count row", () => {
    const teamCat = pricingComparison.categories.find(
      (c) => /team|access|seats/i.test(c.name),
    );
    expect(teamCat).toBeDefined();
    const seatsRow = teamCat!.features.find((f) => /seat/i.test(f.name));
    expect(seatsRow).toBeDefined();
    expect(String(seatsRow!.starter)).toMatch(/^1$|^1 user$|^1 seat/);
    expect(String(seatsRow!.growth)).toMatch(/^5$|5 users?|5 seats?/);
    expect(String(seatsRow!.pro)).toMatch(/unlimited/i);
  });

  it("scan analytics row shows Starter as false", () => {
    let scanRow: { starter: unknown; growth: unknown; pro: unknown } | undefined;
    for (const cat of pricingComparison.categories) {
      const found = cat.features.find((f) => /scan and engagement analytics/i.test(f.name));
      if (found) {
        scanRow = found;
        break;
      }
    }
    expect(scanRow).toBeDefined();
    expect(scanRow!.starter).toBe(false);
    expect(scanRow!.growth).toBe(true);
    expect(scanRow!.pro).toBe(true);
  });

  it("export rows are split into Regulatory (all tiers) and Metrics (Growth+ only)", () => {
    const allRows = pricingComparison.categories.flatMap((c) => c.features);
    const regRow = allRows.find((f) => /regulatory.*export|compliance.*export/i.test(f.name));
    const metricsRow = allRows.find((f) => /metrics.*export|analytics.*export/i.test(f.name));
    expect(regRow, "expected a Regulatory compliance exports row").toBeDefined();
    expect(metricsRow, "expected a Metrics and analytics exports row").toBeDefined();
    expect(regRow!.starter).toBe(true);
    expect(regRow!.growth).toBe(true);
    expect(regRow!.pro).toBe(true);
    expect(metricsRow!.starter).toBe(false);
    expect(metricsRow!.growth).toBe(true);
    expect(metricsRow!.pro).toBe(true);
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

  it("included-in-each-plan FAQ mentions team seats", () => {
    const includedFaq = pricingFaqItems.find((q) =>
      q.question.toLowerCase().includes("included"),
    );
    expect(includedFaq).toBeDefined();
    expect(includedFaq!.answer.toLowerCase()).toMatch(/seat|team/);
  });
});

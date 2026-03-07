import { describe, it, expect } from "vitest";
import {
  buildConfirmationEmail,
  buildDigestEmail,
  type DigestProduct,
} from "@/lib/collective/email-templates";

describe("buildConfirmationEmail", () => {
  const confirmUrl = "https://envrt.com/api/collective/confirm?token=test-token-123";

  it("returns valid HTML with confirm URL", () => {
    const html = buildConfirmationEmail(confirmUrl);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain(confirmUrl);
  });

  it("contains the confirm CTA button", () => {
    const html = buildConfirmationEmail(confirmUrl);
    expect(html).toContain("Confirm subscription");
  });

  it("contains ENVRT logo", () => {
    const html = buildConfirmationEmail(confirmUrl);
    expect(html).toContain("envrt-logo.png");
  });

  it("contains privacy and collective links in footer", () => {
    const html = buildConfirmationEmail(confirmUrl);
    expect(html).toContain("envrt.com/privacy");
    expect(html).toContain("envrt.com/collective");
  });
});

describe("buildDigestEmail", () => {
  const products: DigestProduct[] = [
    {
      name: "Classic T-Shirt",
      brand: "Test Brand",
      imageUrl: "https://example.com/shirt.jpg",
      detailUrl: "/collective/test-brand/TSHIRT-001",
      emissions: 3.5,
      water: 120.8,
    },
    {
      name: "Organic Hoodie",
      brand: "Another Brand",
      imageUrl: null,
      detailUrl: "/collective/another-brand/HOODIE-002",
      emissions: 5.2,
      water: null,
    },
  ];
  const unsubscribeUrl = "https://envrt.com/api/collective/unsubscribe?token=unsub-token";

  it("returns valid HTML", () => {
    const html = buildDigestEmail(products, unsubscribeUrl);
    expect(html).toContain("<!DOCTYPE html>");
  });

  it("lists all products", () => {
    const html = buildDigestEmail(products, unsubscribeUrl);
    expect(html).toContain("Classic T-Shirt");
    expect(html).toContain("Test Brand");
    expect(html).toContain("Organic Hoodie");
    expect(html).toContain("Another Brand");
  });

  it("shows product count in header", () => {
    const html = buildDigestEmail(products, unsubscribeUrl);
    expect(html).toContain("2 new products featured");
  });

  it("uses singular for single product", () => {
    const html = buildDigestEmail([products[0]], unsubscribeUrl);
    expect(html).toContain("1 new product featured");
  });

  it("includes emissions and water metrics", () => {
    const html = buildDigestEmail(products, unsubscribeUrl);
    expect(html).toContain("3.5 kg CO");
    expect(html).toContain("120.8 L H");
    expect(html).toContain("5.2 kg CO");
  });

  it("includes product detail links", () => {
    const html = buildDigestEmail(products, unsubscribeUrl);
    expect(html).toContain("https://envrt.com/collective/test-brand/TSHIRT-001");
    expect(html).toContain("https://envrt.com/collective/another-brand/HOODIE-002");
  });

  it("includes product image when available", () => {
    const html = buildDigestEmail(products, unsubscribeUrl);
    expect(html).toContain("https://example.com/shirt.jpg");
  });

  it("contains unsubscribe link", () => {
    const html = buildDigestEmail(products, unsubscribeUrl);
    expect(html).toContain(unsubscribeUrl);
    expect(html).toContain("Unsubscribe");
  });

  it("contains browse all CTA", () => {
    const html = buildDigestEmail(products, unsubscribeUrl);
    expect(html).toContain("Browse all products");
    expect(html).toContain("https://envrt.com/collective");
  });
});

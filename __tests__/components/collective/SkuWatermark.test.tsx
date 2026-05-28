import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SkuWatermark } from "@/components/collective/SkuWatermark";

describe("SkuWatermark", () => {
  it("renders the SKU formatted for display", () => {
    render(<SkuWatermark sku="tee-001" />);
    expect(screen.getByText("TEE-001")).toBeInTheDocument();
  });

  it("renders nothing visible when SKU is empty", () => {
    const { container } = render(<SkuWatermark sku="" />);
    expect(container.textContent).toBe("");
  });

  it("is hidden from assistive tech (aria-hidden)", () => {
    render(<SkuWatermark sku="abc-1" />);
    expect(screen.getByTestId("sku-watermark").getAttribute("aria-hidden")).toBe("true");
  });

  it("is invisible at rest (opacity-0) and lifts on group hover", () => {
    render(<SkuWatermark sku="abc-1" />);
    const node = screen.getByTestId("sku-watermark");
    expect(node.className).toMatch(/opacity-0/);
    expect(node.className).toMatch(/group-hover:opacity-\[0\.18\]/);
  });

  it("sits above the product image with mix-blend-multiply", () => {
    render(<SkuWatermark sku="abc-1" />);
    const node = screen.getByTestId("sku-watermark");
    expect(node.className).toMatch(/z-\[15\]/);
    expect(node.className).toMatch(/mix-blend-multiply/);
  });

  it("prevents wrapping on long SKUs", () => {
    render(<SkuWatermark sku="vada-bottoms-terry-charcoal-large" />);
    const node = screen.getByTestId("sku-watermark");
    expect(node.className).toMatch(/whitespace-nowrap/);
    expect(node.className).toMatch(/overflow-hidden/);
  });

  it("normalises spaces and case in the rendered SKU", () => {
    render(<SkuWatermark sku="  abc 001  " />);
    expect(screen.getByText("ABC-001")).toBeInTheDocument();
  });
});

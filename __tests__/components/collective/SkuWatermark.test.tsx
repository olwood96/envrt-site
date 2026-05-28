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
    // The span still mounts but is empty — confirm no text content
    expect(container.textContent).toBe("");
  });

  it("is hidden from assistive tech (aria-hidden)", () => {
    render(<SkuWatermark sku="abc-1" />);
    const node = screen.getByText("ABC-1");
    expect(node.getAttribute("aria-hidden")).toBe("true");
  });

  it("applies the hover-lift transition class only when hoverLift is true", () => {
    const { rerender } = render(<SkuWatermark sku="abc-1" hoverLift={false} />);
    let node = screen.getByText("ABC-1");
    expect(node.className).not.toMatch(/group-hover:opacity/);

    rerender(<SkuWatermark sku="abc-1" hoverLift />);
    node = screen.getByText("ABC-1");
    expect(node.className).toMatch(/group-hover:opacity/);
  });

  it("normalises spaces and case in the rendered SKU", () => {
    render(<SkuWatermark sku="  abc 001  " />);
    expect(screen.getByText("ABC-001")).toBeInTheDocument();
  });
});

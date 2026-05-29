import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PricingPreviewSection } from "@/components/sections/PricingPreviewSection";

vi.mock("framer-motion", () => {
  const passthrough = ({ children, ...rest }: { children: React.ReactNode }) => (
    <div {...rest}>{children}</div>
  );
  return {
    motion: new Proxy({}, { get: () => passthrough }),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useReducedMotion: () => false,
  };
});

describe("PricingPreviewSection", () => {
  it("shows fixed prices for Starter and Growth", () => {
    render(<PricingPreviewSection />);
    expect(screen.getByText(/£149/)).toBeInTheDocument();
    expect(screen.getByText(/£495/)).toBeInTheDocument();
  });

  it("renders Pro as Custom without the old £1,295 price", () => {
    const { container } = render(<PricingPreviewSection />);
    expect(container.textContent).not.toMatch(/1,?295/);
    expect(screen.getAllByText(/Custom/i).length).toBeGreaterThan(0);
  });

  it("surfaces team seat counts on every plan card", () => {
    const { container } = render(<PricingPreviewSection />);
    const text = container.textContent || "";
    expect(text).toMatch(/1 team seat/i);
    expect(text).toMatch(/5 team seats/i);
    expect(text).toMatch(/unlimited (team )?seats/i);
  });
});

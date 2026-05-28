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
});

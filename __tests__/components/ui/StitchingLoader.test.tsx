import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StitchingLoader } from "@/components/ui/StitchingLoader";

describe("StitchingLoader", () => {
  it("renders the default 'Loading' label visibly", () => {
    render(<StitchingLoader />);
    const visibleLabels = screen.getAllByText("Loading");
    expect(visibleLabels.length).toBeGreaterThan(0);
  });

  it("renders a custom label when provided", () => {
    render(<StitchingLoader label="Loading the collective" />);
    expect(screen.getAllByText("Loading the collective").length).toBeGreaterThan(0);
  });

  it("renders a status region for assistive tech", () => {
    render(<StitchingLoader label="Loading journey" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("applies the .stitch-line class to the animated line", () => {
    const { container } = render(<StitchingLoader />);
    const line = container.querySelector(".stitch-line");
    expect(line).toBeInTheDocument();
  });

  it("hides the decorative line from assistive tech", () => {
    const { container } = render(<StitchingLoader />);
    const line = container.querySelector(".stitch-line");
    expect(line?.getAttribute("aria-hidden")).toBe("true");
  });

  it("forwards a custom className to the wrapper", () => {
    const { container } = render(<StitchingLoader className="py-4" />);
    expect(container.firstElementChild?.className).toMatch(/py-4/);
  });
});

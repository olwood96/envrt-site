import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CompositionTag } from "@/components/collective/CompositionTag";

describe("CompositionTag", () => {
  it("renders the material line at rest", () => {
    render(
      <CompositionTag
        material="100% Cotton"
        origin="Made in Portugal"
        year={2026}
      />
    );
    expect(screen.getByText("100% Cotton")).toBeInTheDocument();
  });

  it("renders origin and year lines in the DOM (revealed on hover via CSS)", () => {
    render(
      <CompositionTag
        material="100% Cotton"
        origin="Made in Portugal"
        year={2026}
      />
    );
    // All three lines are always in the DOM; CSS clips them at rest.
    expect(screen.getByText("Made in Portugal")).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
  });

  it("omits the origin line when origin is null", () => {
    render(
      <CompositionTag material="100% Cotton" origin={null} year={2026} />
    );
    expect(screen.queryByText(/Made in/)).not.toBeInTheDocument();
  });

  it("omits the year line when year is null", () => {
    render(
      <CompositionTag
        material="100% Cotton"
        origin="Made in Portugal"
        year={null}
      />
    );
    expect(screen.queryByText("2026")).not.toBeInTheDocument();
  });

  it("applies the wobble animation class when animateOnMount is true", () => {
    const { container } = render(
      <CompositionTag
        material="100% Cotton"
        origin="Made in Portugal"
        year={2026}
        animateOnMount
      />
    );
    expect(container.querySelector(".animate-tag-wobble")).toBeInTheDocument();
  });

  it("does not apply the wobble class when animateOnMount is false or omitted", () => {
    const { container } = render(
      <CompositionTag
        material="100% Cotton"
        origin="Made in Portugal"
        year={2026}
      />
    );
    expect(container.querySelector(".animate-tag-wobble")).not.toBeInTheDocument();
  });

  it("renders successfully when material is the only data point", () => {
    render(
      <CompositionTag
        material="Composition pending"
        origin={null}
        year={null}
      />
    );
    expect(screen.getByText("Composition pending")).toBeInTheDocument();
  });
});

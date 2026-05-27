import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DppCarouselCard } from "@/components/sections/DppCarouselCard";

const baseProps = {
  productImageUrl: null,
  brandLogoUrl: null,
  garmentName: "Organic Cotton Tee",
  productSku: "tee-001",
  totalEmissions: 3.2,
  totalWater: 45.8,
  totalEmissionsReductionPct: 32,
  totalWaterReductionPct: 18,
};

describe("DppCarouselCard", () => {
  it("renders garment name, SKU and raw KPI values", () => {
    render(<DppCarouselCard {...baseProps} showReductions />);

    expect(screen.getByText("Organic Cotton Tee")).toBeInTheDocument();
    expect(screen.getByText("tee-001")).toBeInTheDocument();
    expect(screen.getByText("3.2")).toBeInTheDocument();
    expect(screen.getByText("46")).toBeInTheDocument();
  });

  it("shows both reduction badges when showReductions is true", () => {
    render(<DppCarouselCard {...baseProps} showReductions />);

    expect(screen.getByText(/↓ 32% vs avg/)).toBeInTheDocument();
    expect(screen.getByText(/↓ 18% vs avg/)).toBeInTheDocument();
  });

  it("hides both reduction badges when showReductions is false", () => {
    render(<DppCarouselCard {...baseProps} showReductions={false} />);

    expect(screen.queryByText(/% vs avg/)).not.toBeInTheDocument();
    // Raw values still render
    expect(screen.getByText("3.2")).toBeInTheDocument();
    expect(screen.getByText("46")).toBeInTheDocument();
  });

  it("hides reduction badges when reduction values are null", () => {
    render(
      <DppCarouselCard
        {...baseProps}
        totalEmissionsReductionPct={null}
        totalWaterReductionPct={null}
        showReductions
      />,
    );

    expect(screen.queryByText(/% vs avg/)).not.toBeInTheDocument();
  });

  it("hides reduction badges when reduction values are zero", () => {
    render(
      <DppCarouselCard
        {...baseProps}
        totalEmissionsReductionPct={0}
        totalWaterReductionPct={0}
        showReductions
      />,
    );

    expect(screen.queryByText(/% vs avg/)).not.toBeInTheDocument();
  });

  it("renders an up-arrow badge for negative reductions (worse than avg)", () => {
    render(
      <DppCarouselCard
        {...baseProps}
        totalEmissionsReductionPct={-12}
        totalWaterReductionPct={-5}
        showReductions
      />,
    );

    expect(screen.getByText(/↑ 12% vs avg/)).toBeInTheDocument();
    expect(screen.getByText(/↑ 5% vs avg/)).toBeInTheDocument();
  });
});

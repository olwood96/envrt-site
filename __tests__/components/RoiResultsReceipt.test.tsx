import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RoiResultsReceipt } from "@/components/RoiResultsReceipt";

const baseProps = {
  envrtCost: 5940,
  envrtPlan: "Growth",
  consultantCost: 30500,
  inhouseCost: 52800,
  savingVsConsultant: 24560,
  savingVsInhouse: 46860,
  maxSaving: 46860,
  skuCount: 45,
  market: "both" as const,
  date: new Date("2026-05-28T12:00:00Z"),
};

describe("RoiResultsReceipt", () => {
  it("renders the ENVRT mark and the cost-comparison title", () => {
    render(<RoiResultsReceipt {...baseProps} />);
    expect(screen.getByText("E N V R T")).toBeInTheDocument();
    expect(screen.getByText("COST COMPARISON")).toBeInTheDocument();
  });

  it("renders the meta block (date, products, market)", () => {
    render(<RoiResultsReceipt {...baseProps} />);
    expect(screen.getByText("28 May 2026")).toBeInTheDocument();
    expect(screen.getByText("45 SKUs")).toBeInTheDocument();
    expect(screen.getByText("UK + EU")).toBeInTheDocument();
  });

  it("renders all three cost lines with formatted currency", () => {
    render(<RoiResultsReceipt {...baseProps} />);
    expect(screen.getByText("Consultant approach")).toBeInTheDocument();
    expect(screen.getByText("£30,500")).toBeInTheDocument();
    expect(screen.getByText("In-house hire")).toBeInTheDocument();
    expect(screen.getByText("£52,800")).toBeInTheDocument();
    expect(screen.getByText("ENVRT (Growth plan)")).toBeInTheDocument();
    expect(screen.getByText("£5,940")).toBeInTheDocument();
  });

  it("renders both saving lines", () => {
    render(<RoiResultsReceipt {...baseProps} />);
    expect(screen.getByText("vs consultant")).toBeInTheDocument();
    expect(screen.getByText("£24,560")).toBeInTheDocument();
    expect(screen.getByText("vs in-house")).toBeInTheDocument();
    // £46,860 appears in both "vs in-house" and the total row
    expect(screen.getAllByText("£46,860").length).toBe(2);
  });

  it("renders the TOTAL SAVING row", () => {
    render(<RoiResultsReceipt {...baseProps} />);
    expect(screen.getByText("TOTAL SAVING")).toBeInTheDocument();
  });

  it("renders the reference in ROI-{year}-{4 char} format", () => {
    render(<RoiResultsReceipt {...baseProps} />);
    expect(screen.getByText(/^ROI-2026-[A-Z0-9]{4}$/)).toBeInTheDocument();
  });

  it("renders brand line when brandName is provided", () => {
    render(<RoiResultsReceipt {...baseProps} brandName="Acme Apparel" />);
    expect(screen.getByText("Acme Apparel")).toBeInTheDocument();
  });

  it("omits the brand line when brandName is null", () => {
    render(<RoiResultsReceipt {...baseProps} brandName={null} />);
    expect(screen.queryByText("Brand")).not.toBeInTheDocument();
  });

  it("renders market 'UK' for uk", () => {
    render(<RoiResultsReceipt {...baseProps} market="uk" />);
    expect(screen.getByText("UK")).toBeInTheDocument();
  });

  it("renders market 'EU' for eu", () => {
    render(<RoiResultsReceipt {...baseProps} market="eu" />);
    expect(screen.getByText("EU")).toBeInTheDocument();
  });

  it("renders the closing thank-you note", () => {
    render(<RoiResultsReceipt {...baseProps} />);
    expect(screen.getByText("Thank you for using ENVRT")).toBeInTheDocument();
  });

  it("handles a single SKU correctly (singular vs plural)", () => {
    render(<RoiResultsReceipt {...baseProps} skuCount={1} />);
    expect(screen.getByText("1 SKU")).toBeInTheDocument();
  });
});

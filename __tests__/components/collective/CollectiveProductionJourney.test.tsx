import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CollectiveProductionJourney } from "@/components/collective/CollectiveProductionJourney";
import type { CollectiveProductionStage } from "@/lib/collective/types";

const mockStages: CollectiveProductionStage[] = [
  { key: "fibre", label: "Fibre Production", country: "Turkey" },
  { key: "yarn", label: "Yarn Production", country: "Italy" },
  { key: "fabric", label: "Fabric Production", country: "Italy" },
  { key: "dyeing", label: "Bleaching & Dyeing", country: "Portugal" },
  { key: "assembly", label: "Assembly", country: "Portugal" },
];

describe("CollectiveProductionJourney", () => {
  it("renders all stage labels", () => {
    render(<CollectiveProductionJourney stages={mockStages} />);

    expect(screen.getByText("Fibre Production")).toBeInTheDocument();
    expect(screen.getByText("Yarn Production")).toBeInTheDocument();
    expect(screen.getByText("Fabric Production")).toBeInTheDocument();
    expect(screen.getByText("Bleaching & Dyeing")).toBeInTheDocument();
    expect(screen.getByText("Assembly")).toBeInTheDocument();
  });

  it("renders country names", () => {
    render(<CollectiveProductionJourney stages={mockStages} />);

    expect(screen.getAllByText("Turkey")).toHaveLength(1);
    expect(screen.getAllByText("Italy")).toHaveLength(2);
    expect(screen.getAllByText("Portugal")).toHaveLength(2);
  });

  it("shows dash for missing countries", () => {
    const stagesWithNull: CollectiveProductionStage[] = [
      { key: "fibre", label: "Fibre Production", country: null },
      { key: "assembly", label: "Assembly", country: "UK" },
    ];
    render(<CollectiveProductionJourney stages={stagesWithNull} />);

    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText("UK")).toBeInTheDocument();
  });

  it("renders the Production Journey heading", () => {
    render(<CollectiveProductionJourney stages={mockStages} />);
    expect(screen.getByText("Production Journey")).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CollectiveComparisonView } from "@/components/collective/CollectiveComparisonView";
import type { CollectiveCardData } from "@/lib/collective/types";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img alt={alt} {...props} />
  ),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock html-to-image
vi.mock("html-to-image", () => ({
  toPng: vi.fn().mockResolvedValue("data:image/png;base64,fakedata"),
}));

// Mock CollectiveProductionMap (lazy loaded)
vi.mock("@/components/collective/CollectiveProductionMap", () => ({
  CollectiveProductionMap: ({ stages }: { stages: unknown[] }) => (
    <div data-testid="production-map">{stages.length} stages</div>
  ),
}));

const makeCard = (
  id: string,
  name: string,
  overrides: Partial<CollectiveCardData["dpp"]> = {}
): CollectiveCardData => ({
  dpp: {
    id,
    brand_id: "brand-1",
    collection_name: "Summer 2025",
    product_sku: `sku-${id}`,
    garment_name: name,
    garment_mass_g: 200,
    garment_type: "T-shirt",
    traceability_score: 80,
    total_emissions: 3.0,
    total_water: 50,
    total_emissions_reduction_pct: null,
    total_water_reduction_pct: null,
    constituents: [{ material: "Cotton", pct: 100 }],
    image_path: null,
    featured_at: "2025-01-01T00:00:00Z",
    purchase_url: null,
    production_stages: null,
    ...overrides,
  },
  brand: {
    id: "brand-1",
    name: "TestBrand",
    slug: "testbrand",
    logo_path: null,
    website_url: null,
    description: null,
    verified_at: null,
    tier: "free",
  },
  productImageUrl: null,
  brandLogoUrl: null,
  embedUrl: `https://dpp.envrt.com/testbrand/summer-2025/sku-${id}/embed`,
  detailUrl: `/collective/testbrand/sku-${id}`,
});

const mockCards: CollectiveCardData[] = [
  makeCard("1", "Product A", {
    total_emissions: 3.0,
    total_water: 50,
    garment_mass_g: 200,
    traceability_score: 85,
    total_emissions_reduction_pct: 32,
    total_water_reduction_pct: 18,
    constituents: [
      { material: "Organic Cotton", pct: 95 },
      { material: "Elastane", pct: 5 },
    ],
  }),
  makeCard("2", "Product B", {
    total_emissions: 5.0,
    total_water: 30,
    garment_mass_g: 300,
    traceability_score: 70,
    total_emissions_reduction_pct: null,
    total_water_reduction_pct: 25,
    constituents: [{ material: "Polyester", pct: 100 }],
  }),
];

describe("CollectiveComparisonView", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it("renders product headers", () => {
    render(<CollectiveComparisonView cards={mockCards} />);
    // Product names appear in header cards and radar legend
    expect(screen.getAllByText("Product A").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Product B").length).toBeGreaterThanOrEqual(1);
  });

  it("renders CO₂e emissions", () => {
    render(<CollectiveComparisonView cards={mockCards} />);
    expect(screen.getByText("3.0 kg")).toBeInTheDocument();
    expect(screen.getByText("5.0 kg")).toBeInTheDocument();
  });

  it("renders emissions per kg (normalized)", () => {
    render(<CollectiveComparisonView cards={mockCards} />);
    // Product A: 3.0 / 0.2 = 15.00, Product B: 5.0 / 0.3 = 16.67
    expect(screen.getAllByText("Emissions / kg").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("15.00")).toBeInTheDocument();
    expect(screen.getByText("16.67")).toBeInTheDocument();
  });

  it("renders water per kg (normalized)", () => {
    render(<CollectiveComparisonView cards={mockCards} />);
    // Product A: 50 / 0.2 = 250.0, Product B: 30 / 0.3 = 100.0
    expect(screen.getAllByText("Water / kg").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("250.0")).toBeInTheDocument();
    expect(screen.getByText("100.0")).toBeInTheDocument();
  });

  it("renders traceability scores", () => {
    render(<CollectiveComparisonView cards={mockCards} />);
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
  });

  it("shows winner badges on best values", () => {
    render(<CollectiveComparisonView cards={mockCards} />);
    const badges = screen.getAllByTitle("Best in this comparison");
    expect(badges.length).toBeGreaterThan(0);
  });

  it("renders full material breakdown", () => {
    render(<CollectiveComparisonView cards={mockCards} />);
    expect(screen.getByText("Materials")).toBeInTheDocument();
    expect(screen.getByText("Organic Cotton 95%")).toBeInTheDocument();
    expect(screen.getByText("Elastane 5%")).toBeInTheDocument();
    expect(screen.getByText("Polyester 100%")).toBeInTheDocument();
  });

  it("shows emissions reduction vs average", () => {
    render(<CollectiveComparisonView cards={mockCards} />);
    expect(screen.getByText("Emissions vs avg")).toBeInTheDocument();
    // Uses ↓ prefix now
    expect(screen.getByText(/32% below avg/)).toBeInTheDocument();
  });

  it("shows water reduction vs average", () => {
    render(<CollectiveComparisonView cards={mockCards} />);
    expect(screen.getByText("Water vs avg")).toBeInTheDocument();
    expect(screen.getByText(/18% below avg/)).toBeInTheDocument();
    expect(screen.getByText(/25% below avg/)).toBeInTheDocument();
  });

  it("shows metric explainer tooltips", () => {
    render(<CollectiveComparisonView cards={mockCards} />);
    expect(
      screen.getByText(/Total greenhouse gas emissions across the product lifecycle/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Emissions normalised by product weight/)
    ).toBeInTheDocument();
  });

  it("renders radar chart with legend", () => {
    render(<CollectiveComparisonView cards={mockCards} />);
    expect(screen.getByText("Low emissions")).toBeInTheDocument();
    expect(screen.getByText("Low water")).toBeInTheDocument();
    // "Traceability" in both radar label and metric table
    expect(screen.getAllByText("Traceability").length).toBeGreaterThanOrEqual(2);
    // These labels appear in both radar and metric table
    expect(screen.getAllByText("Emissions / kg").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Water / kg").length).toBeGreaterThanOrEqual(2);
  });

  it("renders share button and copies URL on click", async () => {
    render(<CollectiveComparisonView cards={mockCards} />);
    const shareBtn = screen.getByText("Share");
    fireEvent.click(shareBtn);
    await waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });

  it("renders save as image button", () => {
    render(<CollectiveComparisonView cards={mockCards} />);
    expect(screen.getByText("Save as image")).toBeInTheDocument();
  });

  it("does not show reduction rows when no reductions exist", () => {
    const noReductionCards = [
      makeCard("1", "A", { total_emissions_reduction_pct: null, total_water_reduction_pct: null }),
      makeCard("2", "B", { total_emissions_reduction_pct: null, total_water_reduction_pct: null }),
    ];
    render(<CollectiveComparisonView cards={noReductionCards} />);
    expect(screen.queryByText("Emissions vs avg")).not.toBeInTheDocument();
    expect(screen.queryByText("Water vs avg")).not.toBeInTheDocument();
  });

  it("does not show production journeys when no stages exist", () => {
    render(<CollectiveComparisonView cards={mockCards} />);
    expect(screen.queryByText("Production journeys")).not.toBeInTheDocument();
  });

  it("shows production journeys when stages have countries", () => {
    const journeyCards = [
      makeCard("1", "Product A", {
        production_stages: [
          { key: "fibre", label: "Fibre Production", country: "Turkey", regional: "Aydin", verification: "validated" },
          { key: "assembly", label: "Assembly", country: "Portugal", regional: null, verification: "declared" },
        ],
      }),
      makeCard("2", "Product B", {
        production_stages: [
          { key: "fibre", label: "Fibre Production", country: "India", regional: null, verification: null },
        ],
      }),
    ];
    render(<CollectiveComparisonView cards={journeyCards} />);
    expect(screen.getByText("Production journeys")).toBeInTheDocument();
    expect(screen.getByText("Aydin, Turkey")).toBeInTheDocument();
    expect(screen.getByText("Portugal")).toBeInTheDocument();
    expect(screen.getByText("India")).toBeInTheDocument();
  });

  it("title-cases lowercase country names", () => {
    const journeyCards = [
      makeCard("1", "Product A", {
        production_stages: [
          { key: "fibre", label: "Fibre Production", country: "turkey", regional: "aydin", verification: null },
        ],
      }),
      makeCard("2", "Product B", {
        production_stages: [
          { key: "fibre", label: "Fibre Production", country: "INDIA", regional: null, verification: null },
        ],
      }),
    ];
    render(<CollectiveComparisonView cards={journeyCards} />);
    expect(screen.getByText("Aydin, Turkey")).toBeInTheDocument();
    expect(screen.getByText("India")).toBeInTheDocument();
  });

  it("handles null metric values gracefully", () => {
    const nullCards = [
      makeCard("1", "Product A", { total_emissions: null, total_water: null }),
      makeCard("2", "Product B", { total_emissions: 5.0, total_water: 30 }),
    ];
    render(<CollectiveComparisonView cards={nullCards} />);
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThan(0);
  });

  it("links product names to detail pages", () => {
    render(<CollectiveComparisonView cards={mockCards} />);
    const links = screen.getAllByRole("link");
    const productALinks = links.filter((l) => l.getAttribute("href") === "/collective/testbrand/sku-1");
    expect(productALinks.length).toBeGreaterThan(0);
  });

  it("shows ENVRT branding watermark for export", () => {
    render(<CollectiveComparisonView cards={mockCards} />);
    expect(screen.getByText("Compared on envrt.com/collective")).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CollectiveBrandGrid } from "@/components/collective/CollectiveBrandGrid";
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

const makeCard = (id: string, name: string): CollectiveCardData => ({
  dpp: {
    id,
    brand_id: "brand-1",
    collection_name: "Summer 2025",
    product_sku: `sku-${id}`,
    garment_name: name,
    garment_mass_g: 200,
    garment_type: "T-shirt",
    transparency_score: 80,
    total_emissions: 3.0,
    total_water: 50,
    total_emissions_reduction_pct: null,
    total_water_reduction_pct: null,
    constituents: [{ material: "Cotton", pct: 100 }],
    image_path: null,
    featured_at: "2025-01-01T00:00:00Z",
    purchase_url: null,
    production_stages: null,
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

const mockCards = [
  makeCard("1", "Product A"),
  makeCard("2", "Product B"),
  makeCard("3", "Product C"),
];

describe("CollectiveBrandGrid", () => {
  it("renders all cards", () => {
    render(<CollectiveBrandGrid cards={mockCards} />);

    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
    expect(screen.getByText("Product C")).toBeInTheDocument();
  });

  it("allows selecting cards for comparison", () => {
    render(<CollectiveBrandGrid cards={mockCards} />);

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();

    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
  });

  it("shows compare bar when 2+ products selected", () => {
    render(<CollectiveBrandGrid cards={mockCards} />);

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    // Bar not yet visible with only 1 selected
    expect(screen.queryByText("2 selected")).not.toBeInTheDocument();

    fireEvent.click(checkboxes[1]);
    // Bar should now show with selected count and compare link
    expect(screen.getByText("2 selected")).toBeInTheDocument();
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("clears all selections when Clear is clicked", () => {
    render(<CollectiveBrandGrid cards={mockCards} />);

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);
    expect(screen.getByText("2 selected")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Clear"));
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("enforces max 3 selections", () => {
    const fourCards = [
      makeCard("1", "A"),
      makeCard("2", "B"),
      makeCard("3", "C"),
      makeCard("4", "D"),
    ];

    render(<CollectiveBrandGrid cards={fourCards} />);

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);

    // 4th should be disabled
    expect(checkboxes[3]).toBeDisabled();

    // Try clicking it anyway — should not check
    fireEvent.click(checkboxes[3]);
    expect(checkboxes[3]).not.toBeChecked();
  });
});

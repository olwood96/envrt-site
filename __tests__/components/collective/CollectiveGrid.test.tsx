import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CollectiveGrid } from "@/components/collective/CollectiveGrid";
import type {
  CollectiveCardData,
  CollectiveFilters,
} from "@/lib/collective/types";

// Mock framer-motion to avoid animation complexity in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => <div className={className}>{children}</div>,
  },
}));

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

const makeCard = (
  id: string,
  brandId: string,
  brandName: string,
  name: string,
  emissions: number | null,
  water: number | null,
  material: string = "Cotton"
): CollectiveCardData => ({
  dpp: {
    id,
    brand_id: brandId,
    collection_name: "Summer 2025",
    product_sku: `sku-${id}`,
    garment_name: name,
    garment_mass_g: 200,
    garment_type: "T-shirt",
    traceability_score: 80,
    total_emissions: emissions,
    total_water: water,
    constituents: [{ material, pct: 100 }],
    image_path: null,
    featured_at: "2025-01-01T00:00:00Z",
  },
  brand: {
    id: brandId,
    name: brandName,
    slug: brandName.toLowerCase(),
    logo_path: null,
  },
  productImageUrl: null,
  brandLogoUrl: null,
  embedUrl: `https://dashboard.envrt.com/dpp/${brandName.toLowerCase()}/Summer%202025/sku-${id}/embed`,
  detailUrl: `/collective/${brandName.toLowerCase()}/sku-${id}`,
});

const mockCards: CollectiveCardData[] = [
  makeCard("1", "b1", "BrandA", "Product A", 3.0, 50, "Cotton"),
  makeCard("2", "b1", "BrandA", "Product B", 5.0, 30, "Polyester"),
  makeCard("3", "b2", "BrandB", "Product C", 2.0, 80, "Cotton"),
];

const mockFilters: CollectiveFilters = {
  brands: [
    { id: "b1", name: "BrandA" },
    { id: "b2", name: "BrandB" },
  ],
  collections: ["Summer 2025"],
  materialTypes: ["Cotton", "Polyester"],
};

describe("CollectiveGrid", () => {
  it("renders all cards", () => {
    render(<CollectiveGrid cards={mockCards} filters={mockFilters} />);

    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
    expect(screen.getByText("Product C")).toBeInTheDocument();
  });

  it("shows result count", () => {
    render(<CollectiveGrid cards={mockCards} filters={mockFilters} />);
    expect(screen.getByText("3 products")).toBeInTheDocument();
  });

  it("filters by brand", () => {
    render(<CollectiveGrid cards={mockCards} filters={mockFilters} />);

    const brandSelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(brandSelect, { target: { value: "b1" } });

    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
    expect(screen.queryByText("Product C")).not.toBeInTheDocument();
    expect(screen.getByText("2 products")).toBeInTheDocument();
  });

  it("filters by material", () => {
    render(<CollectiveGrid cards={mockCards} filters={mockFilters} />);

    const materialSelect = screen.getAllByRole("combobox")[2];
    fireEvent.change(materialSelect, { target: { value: "Polyester" } });

    expect(screen.queryByText("Product A")).not.toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
    expect(screen.queryByText("Product C")).not.toBeInTheDocument();
  });

  it("shows empty state when no filters match", () => {
    // BrandB has no Polyester products, so combining these filters yields 0 results
    render(<CollectiveGrid cards={mockCards} filters={mockFilters} />);

    const brandSelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(brandSelect, { target: { value: "b2" } });

    const materialSelect = screen.getAllByRole("combobox")[2];
    fireEvent.change(materialSelect, { target: { value: "Polyester" } });

    expect(screen.getByText("No products match your filters.")).toBeInTheDocument();
  });
});

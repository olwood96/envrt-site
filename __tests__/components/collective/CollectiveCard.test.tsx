import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CollectiveCard } from "@/components/collective/CollectiveCard";
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

const mockCard: CollectiveCardData = {
  dpp: {
    id: "dpp-1",
    brand_id: "brand-1",
    collection_name: "Summer 2025",
    product_sku: "tee-001",
    garment_name: "Organic Cotton Tee",
    garment_mass_g: 200,
    garment_type: "T-shirt",
    traceability_score: 85,
    total_emissions: 3.2,
    total_water: 45.8,
    constituents: [
      { material: "Organic Cotton", pct: 95 },
      { material: "Elastane", pct: 5 },
    ],
    image_path: null,
    featured_at: "2025-01-01T00:00:00Z",
  },
  brand: {
    id: "brand-1",
    name: "EcoBrand",
    slug: "ecobrand",
    logo_path: null,
  },
  productImageUrl: null,
  brandLogoUrl: null,
  embedUrl: "https://dashboard.envrt.com/dpp/ecobrand/Summer%202025/tee-001/embed",
  detailUrl: "/collective/ecobrand/tee-001",
};

describe("CollectiveCard", () => {
  it("renders garment name and brand", () => {
    render(
      <CollectiveCard
        card={mockCard}
        isSelected={false}
        onToggleCompare={vi.fn()}
        compareDisabled={false}
      />
    );

    expect(screen.getByText("Organic Cotton Tee")).toBeInTheDocument();
    expect(screen.getByText("EcoBrand")).toBeInTheDocument();
    expect(screen.getByText("Summer 2025")).toBeInTheDocument();
  });

  it("renders emission and water metrics", () => {
    render(
      <CollectiveCard
        card={mockCard}
        isSelected={false}
        onToggleCompare={vi.fn()}
        compareDisabled={false}
      />
    );

    expect(screen.getByText("3.2 kg CO₂e")).toBeInTheDocument();
    expect(screen.getByText("45.8 L H₂O")).toBeInTheDocument();
  });

  it("renders material tags", () => {
    render(
      <CollectiveCard
        card={mockCard}
        isSelected={false}
        onToggleCompare={vi.fn()}
        compareDisabled={false}
      />
    );

    expect(screen.getByText("Organic Cotton 95%")).toBeInTheDocument();
    expect(screen.getByText("Elastane 5%")).toBeInTheDocument();
  });

  it("calls onToggleCompare when checkbox clicked", () => {
    const onToggle = vi.fn();
    render(
      <CollectiveCard
        card={mockCard}
        isSelected={false}
        onToggleCompare={onToggle}
        compareDisabled={false}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith("dpp-1");
  });

  it("disables checkbox when compareDisabled is true and not selected", () => {
    render(
      <CollectiveCard
        card={mockCard}
        isSelected={false}
        onToggleCompare={vi.fn()}
        compareDisabled={true}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  it("checkbox remains enabled when selected even if compareDisabled", () => {
    render(
      <CollectiveCard
        card={mockCard}
        isSelected={true}
        onToggleCompare={vi.fn()}
        compareDisabled={true}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeDisabled();
  });

  it("links to the detail page", () => {
    render(
      <CollectiveCard
        card={mockCard}
        isSelected={false}
        onToggleCompare={vi.fn()}
        compareDisabled={false}
      />
    );

    const links = screen.getAllByRole("link");
    const detailLinks = links.filter(
      (l) => l.getAttribute("href") === "/collective/ecobrand/tee-001"
    );
    expect(detailLinks.length).toBeGreaterThan(0);
  });
});

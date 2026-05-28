import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
    transparency_score: 85,
    total_emissions: 3.2,
    total_water: 45.8,
    total_emissions_reduction_pct: 32,
    total_water_reduction_pct: 18,
    constituents: [
      { material: "Organic Cotton", pct: 95 },
      { material: "Elastane", pct: 5 },
    ],
    image_path: null,
    featured_at: "2025-01-01T00:00:00Z",
    purchase_url: null,
    production_stages: null,
    display_options: { granularity: "total+reduction" },
  },
  brand: {
    id: "brand-1",
    name: "EcoBrand",
    slug: "ecobrand",
    logo_path: null,
    website_url: null,
    description: null,
    verified_at: null,
    tier: "free",
  },
  productImageUrl: null,
  brandLogoUrl: null,
  embedUrl: "https://dpp.envrt.com/ecobrand/summer-2025/tee-001/embed",
  detailUrl: "/collective/ecobrand/tee-001",
};

describe("CollectiveCard", () => {
  describe("identity", () => {
    it("renders garment name, brand and collection", () => {
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

    it("brand wordmark links to the brand page", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      const brandLink = screen.getByText("EcoBrand").closest("a");
      expect(brandLink).toHaveAttribute("href", "/collective/ecobrand");
    });
  });

  describe("composition tag", () => {
    it("renders the dominant material on the tag", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      // 95% Organic Cotton triggers the dominant-material branch
      expect(screen.getByText("95% Organic Cotton")).toBeInTheDocument();
    });

    it("renders origin when production stages have countries", () => {
      const journeyCard: CollectiveCardData = {
        ...mockCard,
        dpp: {
          ...mockCard.dpp,
          production_stages: [
            { key: "assembly", label: "Assembly", country: "Portugal", regional: null, verification: null },
          ],
        },
      };
      render(
        <CollectiveCard
          card={journeyCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      expect(screen.getByText("Made in Portugal")).toBeInTheDocument();
    });

    it("renders the year derived from featured_at", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      expect(screen.getByText("2025")).toBeInTheDocument();
    });
  });

  describe("impact summary", () => {
    it("renders emissions, water and traceability as one prose line", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      const summary = screen.getByTestId("impact-summary");
      expect(summary.textContent).toBe("3.2 kg CO₂e · 45.8 L water · 85% traceable");
    });

    it("omits null metrics from the summary", () => {
      const partialCard: CollectiveCardData = {
        ...mockCard,
        dpp: {
          ...mockCard.dpp,
          total_water: null,
          transparency_score: null,
        },
      };
      render(
        <CollectiveCard
          card={partialCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      const summary = screen.getByTestId("impact-summary");
      expect(summary.textContent).toBe("3.2 kg CO₂e");
    });

    it("renders nothing when all impact metrics are null", () => {
      const emptyCard: CollectiveCardData = {
        ...mockCard,
        dpp: {
          ...mockCard.dpp,
          total_emissions: null,
          total_water: null,
          transparency_score: null,
        },
      };
      render(
        <CollectiveCard
          card={emptyCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      expect(screen.queryByTestId("impact-summary")).not.toBeInTheDocument();
    });
  });

  describe("production journey", () => {
    const journeyCard: CollectiveCardData = {
      ...mockCard,
      dpp: {
        ...mockCard.dpp,
        production_stages: [
          { key: "fibre", label: "Fibre Production", country: "Turkey", regional: "Aydin", verification: "validated" },
          { key: "assembly", label: "Assembly", country: "Portugal", regional: null, verification: "declared" },
        ],
      },
    };

    it("shows the production journey toggle when stages have countries", () => {
      render(
        <CollectiveCard
          card={journeyCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      expect(screen.getByText("Production journey")).toBeInTheDocument();
    });

    it("defaults the map to open (uncontrolled)", () => {
      render(
        <CollectiveCard
          card={journeyCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      // The toggle chevron has a rotate-180 class when open; the map content
      // (or its Suspense fallback) is mounted.
      const toggle = screen.getByText("Production journey").closest("button");
      const chevron = toggle?.querySelector("svg.rotate-180");
      expect(chevron).toBeInTheDocument();
    });

    it("respects controlled mapOpen=false even when stages exist", () => {
      render(
        <CollectiveCard
          card={journeyCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
          mapOpen={false}
          onToggleMap={vi.fn()}
        />
      );

      const toggle = screen.getByText("Production journey").closest("button");
      const chevron = toggle?.querySelector("svg.rotate-180");
      expect(chevron).not.toBeInTheDocument();
    });
  });

  describe("compare control", () => {
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

      fireEvent.click(screen.getByRole("checkbox"));
      expect(onToggle).toHaveBeenCalledWith("dpp-1");
    });

    it("disables checkbox when compareDisabled and not selected", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={true}
        />
      );

      expect(screen.getByRole("checkbox")).toBeDisabled();
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

      expect(screen.getByRole("checkbox")).not.toBeDisabled();
    });
  });

  describe("cross-brand disabled state", () => {
    it("greys out the card", () => {
      const { container } = render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={true}
          crossBrandDisabled={true}
        />
      );

      const cardEl = container.querySelector(".opacity-40");
      expect(cardEl).toBeInTheDocument();
      expect(cardEl).toHaveClass("grayscale");
    });

    it("disables the checkbox", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
          crossBrandDisabled={true}
        />
      );

      expect(screen.getByRole("checkbox")).toBeDisabled();
    });

    it("renders the cross-brand tooltip text", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
          crossBrandDisabled={true}
        />
      );

      expect(
        screen.getByText(/Cross-brand comparisons aren't available yet/)
      ).toBeInTheDocument();
    });

    it("hides the tooltip text when not cross-brand-disabled", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
          crossBrandDisabled={false}
        />
      );

      expect(
        screen.queryByText(/Cross-brand comparisons aren't available yet/)
      ).not.toBeInTheDocument();
    });
  });

  describe("DPP links and popup", () => {
    it("links image, name and CTA to the detail URL", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      expect(screen.getByTestId("dpp-link-image")).toHaveAttribute(
        "href",
        "/collective/ecobrand/tee-001"
      );
      expect(screen.getByTestId("dpp-link-name")).toHaveAttribute(
        "href",
        "/collective/ecobrand/tee-001"
      );
      expect(screen.getByTestId("dpp-link-cta")).toHaveAttribute(
        "href",
        "/collective/ecobrand/tee-001"
      );
    });

    it("opens popup when image link is clicked", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      expect(screen.queryByTestId("dpp-popup-overlay")).not.toBeInTheDocument();
      fireEvent.click(screen.getByTestId("dpp-link-image"));
      expect(screen.getByTestId("dpp-popup-overlay")).toBeInTheDocument();
    });

    it("opens popup when name link is clicked", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      fireEvent.click(screen.getByTestId("dpp-link-name"));
      expect(screen.getByTestId("dpp-popup-overlay")).toBeInTheDocument();
    });

    it("opens popup when View DPP CTA is clicked", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      fireEvent.click(screen.getByTestId("dpp-link-cta"));
      expect(screen.getByTestId("dpp-popup-overlay")).toBeInTheDocument();
    });

    it("popup iframe points to the embedUrl from card data", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      fireEvent.click(screen.getByTestId("dpp-link-cta"));
      const iframe = screen.getByTitle(/Digital Product Passport — Organic Cotton Tee/);
      expect(iframe.getAttribute("src")).toContain(mockCard.embedUrl);
    });

    it("closes popup when close button is clicked", async () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      fireEvent.click(screen.getByTestId("dpp-link-cta"));
      expect(screen.getByTestId("dpp-popup-overlay")).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText("Close popup"));
      await waitFor(() =>
        expect(screen.queryByTestId("dpp-popup-overlay")).not.toBeInTheDocument()
      );
    });
  });

  describe("shop link", () => {
    it("renders when purchase_url is set", () => {
      const shopCard: CollectiveCardData = {
        ...mockCard,
        dpp: { ...mockCard.dpp, purchase_url: "https://shop.example.com" },
      };
      render(
        <CollectiveCard
          card={shopCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      const shopLink = screen.getByText("Shop this product");
      expect(shopLink).toBeInTheDocument();
      expect(shopLink.closest("a")).toHaveAttribute("href", "https://shop.example.com");
    });

    it("is omitted when purchase_url is null", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      expect(screen.queryByText("Shop this product")).not.toBeInTheDocument();
    });
  });

  describe("lightbox", () => {
    const cardWithImage: CollectiveCardData = {
      ...mockCard,
      productImageUrl: "https://example.com/image.jpg",
    };

    beforeEach(() => {
      document.body.style.overflow = "";
    });

    it("shows expand button when image is present", () => {
      render(
        <CollectiveCard
          card={cardWithImage}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      expect(screen.getByLabelText("View full image")).toBeInTheDocument();
    });

    it("opens lightbox when expand button is clicked", () => {
      render(
        <CollectiveCard
          card={cardWithImage}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      fireEvent.click(screen.getByLabelText("View full image"));
      expect(screen.getByLabelText("Close lightbox")).toBeInTheDocument();
    });

    it("closes lightbox when close button is clicked", () => {
      render(
        <CollectiveCard
          card={cardWithImage}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      fireEvent.click(screen.getByLabelText("View full image"));
      fireEvent.click(screen.getByLabelText("Close lightbox"));
      expect(screen.queryByLabelText("Close lightbox")).not.toBeInTheDocument();
    });

    it("does not show expand button when no image", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      expect(screen.queryByLabelText("View full image")).not.toBeInTheDocument();
    });
  });
});

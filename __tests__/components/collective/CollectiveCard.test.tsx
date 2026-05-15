import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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

  it("renders transparency score", () => {
    render(
      <CollectiveCard
        card={mockCard}
        isSelected={false}
        onToggleCompare={vi.fn()}
        compareDisabled={false}
      />
    );

    expect(screen.getByText("85% transparency")).toBeInTheDocument();
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

  it("links to the detail page (SEO: real href preserved for crawlers and right-click)", () => {
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

  describe("DPP popup", () => {
    it("opens popup when garment image link is clicked", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      expect(screen.queryByTestId("dpp-popup-overlay")).not.toBeInTheDocument();
      const imageLink = screen.getByTestId("dpp-link-image");
      fireEvent.click(imageLink);
      expect(screen.getByTestId("dpp-popup-overlay")).toBeInTheDocument();
    });

    it("opens popup when garment name link is clicked", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      const nameLink = screen.getByTestId("dpp-link-name");
      fireEvent.click(nameLink);
      expect(screen.getByTestId("dpp-popup-overlay")).toBeInTheDocument();
    });

    it("opens popup when 'View DPP' CTA is clicked", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      const ctaLink = screen.getByTestId("dpp-link-cta");
      fireEvent.click(ctaLink);
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
      const iframe = screen.getByTitle(
        /Digital Product Passport — Organic Cotton Tee/
      );
      expect(iframe.getAttribute("src")).toContain(mockCard.embedUrl);
    });

    it("all three DPP links preserve detail URL as href (SEO)", () => {
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

    it("brand logo link still navigates to brand page (not popup)", () => {
      const cardWithLogo: CollectiveCardData = {
        ...mockCard,
        brandLogoUrl: "https://example.com/logo.png",
      };
      render(
        <CollectiveCard
          card={cardWithLogo}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      const links = screen.getAllByRole("link");
      const brandLink = links.find(
        (l) => l.getAttribute("href") === "/collective/ecobrand"
      );
      expect(brandLink).toBeDefined();
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
        expect(
          screen.queryByTestId("dpp-popup-overlay")
        ).not.toBeInTheDocument()
      );
    });
  });

  describe("New badge", () => {
    let dateSpy: ReturnType<typeof vi.spyOn>;

    afterEach(() => {
      dateSpy?.mockRestore();
    });

    it("shows New badge for recently featured products", () => {
      // Mock Date.now to be 5 days after featured_at
      const fiveDaysAfter = new Date("2025-01-06T00:00:00Z").getTime();
      dateSpy = vi.spyOn(Date, "now").mockReturnValue(fiveDaysAfter);

      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      expect(screen.getByText("New")).toBeInTheDocument();
    });

    it("does not show New badge for old products", () => {
      // Mock Date.now to be 30 days after featured_at
      const thirtyDaysAfter = new Date("2025-01-31T00:00:00Z").getTime();
      dateSpy = vi.spyOn(Date, "now").mockReturnValue(thirtyDaysAfter);

      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
        />
      );

      expect(screen.queryByText("New")).not.toBeInTheDocument();
    });
  });

  it("shows emissions reduction percentage", () => {
    render(
      <CollectiveCard
        card={mockCard}
        isSelected={false}
        onToggleCompare={vi.fn()}
        compareDisabled={false}
      />
    );

    expect(screen.getByText("↓ 32% vs avg")).toBeInTheDocument();
  });

  it("shows water reduction percentage", () => {
    render(
      <CollectiveCard
        card={mockCard}
        isSelected={false}
        onToggleCompare={vi.fn()}
        compareDisabled={false}
      />
    );

    expect(screen.getByText("↓ 18% vs avg")).toBeInTheDocument();
  });

  it("shows material tooltip on hover", () => {
    render(
      <CollectiveCard
        card={mockCard}
        isSelected={false}
        onToggleCompare={vi.fn()}
        compareDisabled={false}
      />
    );

    // Tooltip text should be in the DOM (hidden until hover)
    expect(
      screen.getByText(/Grown without synthetic pesticides/)
    ).toBeInTheDocument();
  });

  it("shows verified badge when brand is verified", () => {
    const verifiedCard: CollectiveCardData = {
      ...mockCard,
      brand: { ...mockCard.brand, verified_at: "2025-01-01T00:00:00Z" },
    };
    render(
      <CollectiveCard
        card={verifiedCard}
        isSelected={false}
        onToggleCompare={vi.fn()}
        compareDisabled={false}
      />
    );

    expect(screen.getByLabelText("Verified brand")).toBeInTheDocument();
  });

  it("shows production journey toggle when stages have countries", () => {
    const journeyCard: CollectiveCardData = {
      ...mockCard,
      dpp: {
        ...mockCard.dpp,
        production_stages: [
          { key: "fibre", label: "Fibre Production", country: "Turkey", regional: "Aydin", verification: "validated" },
          { key: "yarn", label: "Yarn Production", country: null, regional: null, verification: null },
          { key: "assembly", label: "Assembly", country: "Portugal", regional: null, verification: "declared" },
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

    expect(screen.getByText("Production journey")).toBeInTheDocument();
  });

  it("shows shop link when purchase_url is set", () => {
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
    expect(shopLink.closest("a")).toHaveAttribute(
      "href",
      "https://shop.example.com"
    );
  });

  describe("crossBrandDisabled", () => {
    it("greys out card when crossBrandDisabled is true", () => {
      const { container } = render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={true}
          crossBrandDisabled={true}
        />
      );

      // The card wrapper should have opacity and grayscale classes
      const cardEl = container.querySelector(".opacity-40");
      expect(cardEl).toBeInTheDocument();
      expect(cardEl).toHaveClass("grayscale");
    });

    it("disables checkbox when crossBrandDisabled is true", () => {
      render(
        <CollectiveCard
          card={mockCard}
          isSelected={false}
          onToggleCompare={vi.fn()}
          compareDisabled={false}
          crossBrandDisabled={true}
        />
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeDisabled();
    });

    it("shows cross-brand tooltip when crossBrandDisabled is true", () => {
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

    it("does not show tooltip when crossBrandDisabled is false", () => {
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

  describe("lightbox", () => {
    const cardWithImage: CollectiveCardData = {
      ...mockCard,
      productImageUrl: "https://example.com/image.jpg",
    };

    beforeEach(() => {
      // Reset body overflow
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
      expect(screen.getByLabelText("Close lightbox")).toBeInTheDocument();

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

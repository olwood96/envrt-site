import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AlignedWithCarousel } from "@/components/sections/AlignedWithCarousel";

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

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => <img src={src} alt={alt} {...props} />,
}));

describe("AlignedWithCarousel", () => {
  it("renders the ALIGNED WITH heading as a semantic h2 for SEO", () => {
    const { container } = render(<AlignedWithCarousel />);
    const heading = container.querySelector("h2[data-aligned-heading]");
    expect(heading).not.toBeNull();
    expect(heading?.textContent?.toLowerCase()).toContain("aligned with");
    expect(heading?.tagName).toBe("H2");
  });

  it("renders the descriptive paragraph using legally safe wording", () => {
    render(<AlignedWithCarousel />);
    const paragraph = screen.getByText(/methodology is aligned with/i);
    expect(paragraph).toBeInTheDocument();
    expect(paragraph.textContent).toMatch(/EU Product Environmental Footprint/);
    expect(paragraph.textContent).toMatch(/ISO 14040/);
    expect(paragraph.textContent).toMatch(/AWARE water scarcity/);
  });

  it("does not use banned endorsement language", () => {
    const { container } = render(<AlignedWithCarousel />);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/built on/i);
    expect(text).not.toMatch(/endorsed by/i);
    expect(text).not.toMatch(/backed by/i);
    expect(text).not.toMatch(/powered by/i);
    expect(text).not.toMatch(/trusted by/i);
    expect(text).not.toMatch(/certified by/i);
    expect(text).not.toMatch(/approved by/i);
  });

  it("renders all six logos with descriptive alt text", () => {
    render(<AlignedWithCarousel />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(6);

    const altTexts = images.map((img) => img.getAttribute("alt"));
    expect(altTexts).toEqual([
      expect.stringMatching(/EU|european/i),
      expect.stringMatching(/sustainable development goals/i),
      expect.stringMatching(/greenhouse gas/i),
      expect.stringMatching(/aware|wulca/i),
      expect.stringMatching(/ecobalyse/i),
      expect.stringMatching(/life cycle initiative|unep/i),
    ]);
  });

  it("renders all six logo labels under the icons", () => {
    render(<AlignedWithCarousel />);
    expect(screen.getByText("EU PEF")).toBeInTheDocument();
    expect(screen.getByText("UN SDGS")).toBeInTheDocument();
    expect(screen.getByText("GHG PROTOCOL")).toBeInTheDocument();
    expect(screen.getByText("AWARE")).toBeInTheDocument();
    expect(screen.getByText("ECOBALYSE")).toBeInTheDocument();
    expect(screen.getByText("UNEP LCI")).toBeInTheDocument();
  });

  it("uses a responsive 2 / 3 / 6 column grid", () => {
    const { container } = render(<AlignedWithCarousel />);
    const grid = container.querySelector("[data-aligned-grid]");
    expect(grid).not.toBeNull();
    expect(grid?.className).toMatch(/grid/);
    expect(grid?.className).toMatch(/grid-cols-2/);
    expect(grid?.className).toMatch(/md:grid-cols-3/);
    expect(grid?.className).toMatch(/lg:grid-cols-6/);
  });

  it("renders 6 logo cells with no card backgrounds or shadows", () => {
    const { container } = render(<AlignedWithCarousel />);
    const cells = container.querySelectorAll("[data-aligned-cell]");
    expect(cells.length).toBe(6);
    cells.forEach((cell) => {
      expect(cell.className).not.toMatch(/shadow/);
      expect(cell.className).not.toMatch(/bg-white/);
    });
  });

  it("inherits the page background and does not add its own", () => {
    const { container } = render(<AlignedWithCarousel />);
    const section = container.querySelector("section");
    expect(section?.className).not.toMatch(/bg-/);
  });

  it("uses standard section vertical padding consistent with adjacent sections", () => {
    const { container } = render(<AlignedWithCarousel />);
    const section = container.querySelector("section");
    expect(section?.className).toMatch(/py-12/);
    expect(section?.className).toMatch(/sm:py-16/);
  });

  it("uses small caps letter-spaced styling on heading and labels", () => {
    const { container } = render(<AlignedWithCarousel />);
    const heading = container.querySelector("[data-aligned-heading]");
    expect(heading?.className).toMatch(/uppercase/);
    expect(heading?.className).toMatch(/tracking-/);

    const labels = container.querySelectorAll("[data-aligned-label]");
    expect(labels.length).toBe(6);
    labels.forEach((label) => {
      expect(label.className).toMatch(/uppercase/);
      expect(label.className).toMatch(/tracking-/);
    });
  });

  it("each logo image points to the expected file path under /logos/aligned-with/", () => {
    render(<AlignedWithCarousel />);
    const images = screen.getAllByRole("img");
    const expectedSlugs = [
      "eu-emblem",
      "un-sdgs",
      "ghg-protocol",
      "wulca-aware",
      "ecobalyse",
      "unep-lci",
    ];
    expectedSlugs.forEach((slug, i) => {
      expect(images[i].getAttribute("src")).toMatch(
        new RegExp(`/logos/aligned-with/${slug}\\.(png|svg|webp|jpg|jpeg)`),
      );
    });
  });

  it("renders within a semantic section element", () => {
    const { container } = render(<AlignedWithCarousel />);
    const section = container.querySelector("section");
    expect(section).not.toBeNull();
    expect(section).toHaveAttribute("aria-labelledby");
  });

  it("renders a typographic reference line listing all six ISO and EU standards", () => {
    const { container } = render(<AlignedWithCarousel />);
    const referenceLine = container.querySelector("[data-aligned-references]");
    expect(referenceLine).not.toBeNull();
    expect(referenceLine?.textContent).toMatch(/referencing/i);
    expect(referenceLine?.textContent).toMatch(/ISO 14040/);
    expect(referenceLine?.textContent).toMatch(/ISO 14044/);
    expect(referenceLine?.textContent).toMatch(/ISO 14046/);
    expect(referenceLine?.textContent).toMatch(/PEFCR/);
    expect(referenceLine?.textContent).toMatch(/ESPR/);
    expect(referenceLine?.textContent).toMatch(/EU DPP/);
  });

  it("reference line uses small caps letter-spaced styling and muted colour", () => {
    const { container } = render(<AlignedWithCarousel />);
    const referenceLine = container.querySelector("[data-aligned-references]");
    expect(referenceLine?.className).toMatch(/uppercase/);
    expect(referenceLine?.className).toMatch(/tracking-/);
    expect(referenceLine?.className).toMatch(/text-envrt-muted/);
  });

  it("includes screen-reader-only long descriptions for the standards in the reference line for AEO", () => {
    const { container } = render(<AlignedWithCarousel />);
    const srSpans = container.querySelectorAll(
      "[data-aligned-references] .sr-only",
    );
    expect(srSpans.length).toBe(6);
    srSpans.forEach((span) => {
      expect(span.textContent?.length ?? 0).toBeGreaterThan(40);
    });
  });

  it("includes screen-reader-only long-form descriptions for each logo for AEO context", () => {
    const { container } = render(<AlignedWithCarousel />);
    const descriptions = container.querySelectorAll(
      "[data-aligned-sr-description]",
    );
    expect(descriptions.length).toBe(6);
    descriptions.forEach((desc) => {
      expect(desc.className).toMatch(/sr-only/);
      expect(desc.textContent?.length ?? 0).toBeGreaterThan(40);
    });
  });

  it("logo alt text includes the methodology context for SEO", () => {
    render(<AlignedWithCarousel />);
    const images = screen.getAllByRole("img");
    const altTexts = images.map((img) => img.getAttribute("alt") ?? "");
    expect(altTexts[0]).toMatch(/Product Environmental Footprint/);
    expect(altTexts[1]).toMatch(/Sustainable Development Goals/);
    expect(altTexts[2]).toMatch(/greenhouse gas/i);
    expect(altTexts[3]).toMatch(/AWARE|water scarcity/);
    expect(altTexts[4]).toMatch(/French government|lifecycle assessment/i);
    expect(altTexts[5]).toMatch(/life cycle/i);
  });
});

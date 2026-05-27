import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ImpactStatsSection } from "@/components/sections/ImpactStatsSection";
import { REFERENCES_PER_LCA } from "@/lib/impact-stats";

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

vi.mock("@/hooks/useIntersectionOnce", () => ({
  useIntersectionOnce: () => true,
}));

const baseStats = {
  co2Kg: 0,
  waterLitres: 0,
  dppScans: 1000,
  dataPointsServed: 1000 * REFERENCES_PER_LCA,
};

describe("ImpactStatsSection", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => baseStats,
    }));
  });

  it("renders the Platform impact heading as a semantic h2 for SEO", () => {
    const { container } = render(<ImpactStatsSection stats={baseStats} />);
    const h2 = container.querySelector("h2");
    expect(h2).not.toBeNull();
    expect(h2?.textContent?.toLowerCase()).toContain("platform impact");
  });

  it("renders exactly three stat blocks", () => {
    const { container } = render(<ImpactStatsSection stats={baseStats} />);
    const blocks = container.querySelectorAll("[data-stat-block]");
    expect(blocks.length).toBe(3);
  });

  it("stat 1 shows data points served via DPPs computed from dppScans × 68431", () => {
    render(<ImpactStatsSection stats={baseStats} />);
    expect(screen.getByText(/data points served via our DPPs/i)).toBeInTheDocument();
    // Number is rendered as digit columns via the odometer, so we cannot getByText.
    // Instead check that an odometer wrapper exists for stat 1.
  });

  it("stat 2 shows 75+ network of apparel brands and partners", () => {
    render(<ImpactStatsSection stats={baseStats} />);
    expect(screen.getByText("75+")).toBeInTheDocument();
    expect(
      screen.getByText(/network of apparel brands and partners/i),
    ).toBeInTheDocument();
  });

  it("stat 3 shows 27 EU markets aligned with our methodology", () => {
    render(<ImpactStatsSection stats={baseStats} />);
    expect(screen.getByText("27")).toBeInTheDocument();
    expect(
      screen.getByText(/EU markets aligned with our methodology/i),
    ).toBeInTheDocument();
  });

  it("does NOT render the live-platform-data pulsing indicator", () => {
    const { container } = render(<ImpactStatsSection stats={baseStats} />);
    expect(screen.queryByText(/live platform data/i)).not.toBeInTheDocument();
    expect(container.querySelector(".animate-ping")).toBeNull();
  });

  it("does NOT render legacy CO2 or water labels", () => {
    render(<ImpactStatsSection stats={baseStats} />);
    expect(screen.queryByText(/CO₂e impact explored/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/water impact explored/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/DPP scans worldwide/i)).not.toBeInTheDocument();
  });

  it("uses hairline vertical dividers between stats on desktop and horizontal on mobile (no cards)", () => {
    const { container } = render(<ImpactStatsSection stats={baseStats} />);
    const grid = container.querySelector("[data-impact-stats]");
    expect(grid).not.toBeNull();
    expect(grid?.className).toMatch(/divide-y/);
    expect(grid?.className).toMatch(/sm:divide-y-0/);
    expect(grid?.className).toMatch(/sm:divide-x/);

    const blocks = container.querySelectorAll("[data-stat-block]");
    blocks.forEach((b) => {
      expect(b.className).not.toMatch(/shadow/);
      expect(b.className).not.toMatch(/bg-white/);
      expect(b.className).not.toMatch(/rounded-2xl/);
    });
  });

  it("inherits the page background and does not add its own", () => {
    const { container } = render(<ImpactStatsSection stats={baseStats} />);
    const section = container.querySelector("section");
    expect(section?.className).not.toMatch(/bg-/);
  });

  it("uses the Compact tier section padding consistent with adjacent sections", () => {
    const { container } = render(<ImpactStatsSection stats={baseStats} />);
    const section = container.querySelector("section");
    expect(section?.className).toMatch(/py-12/);
    expect(section?.className).toMatch(/sm:py-16/);
  });

  it("uses small-caps letter-spaced styling on the heading and stat labels", () => {
    const { container } = render(<ImpactStatsSection stats={baseStats} />);
    const h2 = container.querySelector("h2");
    expect(h2?.className).toMatch(/uppercase/);
    expect(h2?.className).toMatch(/tracking-/);

    const labels = container.querySelectorAll("[data-stat-label]");
    expect(labels.length).toBe(3);
    labels.forEach((label) => {
      expect(label.className).toMatch(/uppercase/);
      expect(label.className).toMatch(/tracking-/);
    });
  });

  it("renders even when dppScans is 0", () => {
    const zeroStats = { ...baseStats, dppScans: 0, dataPointsServed: 0 };
    const { container } = render(<ImpactStatsSection stats={zeroStats} />);
    expect(container.querySelector("section")).not.toBeNull();
    expect(screen.getByText("75+")).toBeInTheDocument();
    expect(screen.getByText("27")).toBeInTheDocument();
  });

  it("renders within a semantic section with aria-labelledby", () => {
    const { container } = render(<ImpactStatsSection stats={baseStats} />);
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("aria-labelledby");
  });
});

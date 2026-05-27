import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { AlignedWithJsonLd } from "@/components/seo/AlignedWithJsonLd";

function getJsonLd(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  return script ? JSON.parse(script.textContent!) : null;
}

describe("AlignedWithJsonLd", () => {
  it("renders valid ItemList schema", () => {
    const { container } = render(<AlignedWithJsonLd />);
    const jsonLd = getJsonLd(container);

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("ItemList");
    expect(typeof jsonLd.name).toBe("string");
    expect(jsonLd.name.length).toBeGreaterThan(0);
  });

  it("contains 12 ListItems covering all logos and text standards", () => {
    const { container } = render(<AlignedWithJsonLd />);
    const jsonLd = getJsonLd(container);

    expect(jsonLd.itemListElement).toHaveLength(12);
  });

  it("each ListItem has position, item with name, description and url", () => {
    const { container } = render(<AlignedWithJsonLd />);
    const jsonLd = getJsonLd(container);

    jsonLd.itemListElement.forEach((entry: Record<string, unknown>, idx: number) => {
      expect(entry["@type"]).toBe("ListItem");
      expect(entry.position).toBe(idx + 1);

      const item = entry.item as Record<string, unknown>;
      expect(["Organization", "DefinedTerm"]).toContain(item["@type"]);
      expect(typeof item.name).toBe("string");
      expect(typeof item.description).toBe("string");
      expect(typeof item.url).toBe("string");
      expect((item.url as string).startsWith("http")).toBe(true);
    });
  });

  it("references all six logo bodies by name", () => {
    const { container } = render(<AlignedWithJsonLd />);
    const jsonLd = getJsonLd(container);
    const names = jsonLd.itemListElement.map(
      (e: { item: { name: string } }) => e.item.name,
    );

    expect(names).toContain("European Union Product Environmental Footprint");
    expect(names).toContain("United Nations Sustainable Development Goals");
    expect(names).toContain("Greenhouse Gas Protocol");
    expect(names).toContain("AWARE Water Scarcity Model");
    expect(names).toContain("Ecobalyse");
    expect(names).toContain("UNEP Life Cycle Initiative");
  });

  it("references all six ISO and EU standards by name", () => {
    const { container } = render(<AlignedWithJsonLd />);
    const jsonLd = getJsonLd(container);
    const names = jsonLd.itemListElement.map(
      (e: { item: { name: string } }) => e.item.name,
    );

    expect(names).toContain("ISO 14040 Life Cycle Assessment Principles");
    expect(names).toContain("ISO 14044 Life Cycle Assessment Requirements and Guidelines");
    expect(names).toContain("ISO 14046 Water Footprint Standard");
    expect(names).toContain("PEFCR for Apparel and Footwear");
    expect(names).toContain("EU Ecodesign for Sustainable Products Regulation");
    expect(names).toContain("EU Digital Product Passport");
  });
});

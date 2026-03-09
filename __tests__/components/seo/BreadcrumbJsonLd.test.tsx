import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

function getJsonLd(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  return script ? JSON.parse(script.textContent!) : null;
}

describe("BreadcrumbJsonLd", () => {
  it("renders valid BreadcrumbList schema", () => {
    const items = [
      { name: "Home", url: "https://envrt.com" },
      { name: "Pricing", url: "https://envrt.com/pricing" },
    ];
    const { container } = render(<BreadcrumbJsonLd items={items} />);
    const jsonLd = getJsonLd(container);

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("BreadcrumbList");
    expect(jsonLd.itemListElement).toHaveLength(2);
  });

  it("assigns correct positions", () => {
    const items = [
      { name: "Home", url: "https://envrt.com" },
      { name: "Insights", url: "https://envrt.com/insights" },
      { name: "DPP Guide", url: "https://envrt.com/insights/dpp-guide" },
    ];
    const { container } = render(<BreadcrumbJsonLd items={items} />);
    const jsonLd = getJsonLd(container);

    expect(jsonLd.itemListElement[0].position).toBe(1);
    expect(jsonLd.itemListElement[1].position).toBe(2);
    expect(jsonLd.itemListElement[2].position).toBe(3);
  });

  it("includes correct name and item URL for each breadcrumb", () => {
    const items = [
      { name: "Home", url: "https://envrt.com" },
      { name: "Assessment", url: "https://envrt.com/assessment" },
    ];
    const { container } = render(<BreadcrumbJsonLd items={items} />);
    const jsonLd = getJsonLd(container);

    expect(jsonLd.itemListElement[0].name).toBe("Home");
    expect(jsonLd.itemListElement[0].item).toBe("https://envrt.com");
    expect(jsonLd.itemListElement[1].name).toBe("Assessment");
    expect(jsonLd.itemListElement[1].item).toBe("https://envrt.com/assessment");
  });
});

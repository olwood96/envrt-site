import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";

function getJsonLd(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  return script ? JSON.parse(script.textContent!) : null;
}

describe("OrganizationJsonLd", () => {
  it("renders valid Organization schema", () => {
    const { container } = render(<OrganizationJsonLd />);
    const jsonLd = getJsonLd(container);

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("Organization");
    expect(jsonLd.name).toBe("ENVRT");
    expect(jsonLd.url).toBe("https://envrt.com");
  });

  it("includes sameAs with LinkedIn URL", () => {
    const { container } = render(<OrganizationJsonLd />);
    const jsonLd = getJsonLd(container);

    expect(jsonLd.sameAs).toContain("https://www.linkedin.com/company/envrt/");
  });

  it("includes foundingDate", () => {
    const { container } = render(<OrganizationJsonLd />);
    const jsonLd = getJsonLd(container);

    expect(jsonLd.foundingDate).toBe("2024");
  });

  it("includes founders", () => {
    const { container } = render(<OrganizationJsonLd />);
    const jsonLd = getJsonLd(container);

    expect(jsonLd.founders).toHaveLength(2);
    expect(jsonLd.founders[0].name).toBe("Charles Woolwich");
    expect(jsonLd.founders[1].name).toBe("Oliver Woodcock");
  });

  it("includes knowsAbout referencing the aligned-with standards and bodies", () => {
    const { container } = render(<OrganizationJsonLd />);
    const jsonLd = getJsonLd(container);

    expect(Array.isArray(jsonLd.knowsAbout)).toBe(true);
    expect(jsonLd.knowsAbout.length).toBe(12);
    const names = jsonLd.knowsAbout.map(
      (k: { name: string }) => k.name,
    );
    expect(names).toContain("ISO 14040 Life Cycle Assessment Principles");
    expect(names).toContain(
      "European Union Product Environmental Footprint",
    );
    expect(names).toContain("AWARE Water Scarcity Model");
  });
});

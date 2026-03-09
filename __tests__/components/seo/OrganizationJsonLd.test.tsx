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
});

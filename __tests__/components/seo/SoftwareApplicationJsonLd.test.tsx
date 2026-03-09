import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";

function getJsonLd(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  return script ? JSON.parse(script.textContent!) : null;
}

describe("SoftwareApplicationJsonLd", () => {
  it("renders valid SoftwareApplication schema", () => {
    const { container } = render(<SoftwareApplicationJsonLd />);
    const jsonLd = getJsonLd(container);

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("SoftwareApplication");
    expect(jsonLd.name).toBe("ENVRT");
    expect(jsonLd.applicationCategory).toBe("BusinessApplication");
    expect(jsonLd.operatingSystem).toBe("Web");
  });

  it("includes three pricing offers", () => {
    const { container } = render(<SoftwareApplicationJsonLd />);
    const jsonLd = getJsonLd(container);

    expect(jsonLd.offers).toHaveLength(3);
    expect(jsonLd.offers[0].name).toBe("Starter");
    expect(jsonLd.offers[0].price).toBe("149");
    expect(jsonLd.offers[0].priceCurrency).toBe("GBP");
    expect(jsonLd.offers[1].name).toBe("Growth");
    expect(jsonLd.offers[1].price).toBe("495");
    expect(jsonLd.offers[2].name).toBe("Pro");
    expect(jsonLd.offers[2].price).toBe("1295");
  });

  it("each offer has @type Offer", () => {
    const { container } = render(<SoftwareApplicationJsonLd />);
    const jsonLd = getJsonLd(container);

    jsonLd.offers.forEach((offer: Record<string, unknown>) => {
      expect(offer["@type"]).toBe("Offer");
    });
  });
});

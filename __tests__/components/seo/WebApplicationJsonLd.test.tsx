import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { WebApplicationJsonLd } from "@/components/seo/WebApplicationJsonLd";

function getJsonLd(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  return script ? JSON.parse(script.textContent!) : null;
}

describe("WebApplicationJsonLd", () => {
  it("renders a basic WebApplication schema", () => {
    const { container } = render(
      <WebApplicationJsonLd
        name="Test App"
        url="https://envrt.com/test"
        description="A test application"
      />
    );
    const jsonLd = getJsonLd(container);
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("WebApplication");
    expect(jsonLd.name).toBe("Test App");
    expect(jsonLd.url).toBe("https://envrt.com/test");
    expect(jsonLd.applicationCategory).toBe("BusinessApplication");
    expect(jsonLd.offers.price).toBe("0");
    expect(jsonLd.provider.name).toBe("ENVRT");
  });

  it("includes Quiz type and educational fields when isQuiz is true", () => {
    const { container } = render(
      <WebApplicationJsonLd
        name="DPP Readiness Assessment"
        url="https://envrt.com/assessment"
        description="Free assessment for DPP readiness"
        isQuiz
      />
    );
    const jsonLd = getJsonLd(container);
    expect(jsonLd["@type"]).toEqual(["WebApplication", "Quiz"]);
    expect(jsonLd.educationalUse).toBe("Self-Assessment");
    expect(jsonLd.learningResourceType).toBe("Assessment");
    expect(jsonLd.assesses).toMatch(/Digital Product Passport/i);
  });

  it("omits quiz-only fields when isQuiz is false", () => {
    const { container } = render(
      <WebApplicationJsonLd
        name="Test App"
        url="https://envrt.com/test"
        description="A test"
      />
    );
    const jsonLd = getJsonLd(container);
    expect(jsonLd.educationalUse).toBeUndefined();
    expect(jsonLd.learningResourceType).toBeUndefined();
  });
});

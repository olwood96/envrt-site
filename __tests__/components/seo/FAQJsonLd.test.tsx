import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import {
  faqItems,
  pricingFaqItems,
  roiFaqItems,
  assessmentFaqItems,
} from "@/lib/config";

function getJsonLd(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  return script ? JSON.parse(script.textContent!) : null;
}

describe("FAQJsonLd", () => {
  it("renders valid FAQPage schema for homepage FAQ items", () => {
    const { container } = render(<FAQJsonLd items={faqItems} />);
    const jsonLd = getJsonLd(container);

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("FAQPage");
    expect(jsonLd.mainEntity).toHaveLength(faqItems.length);
    expect(jsonLd.mainEntity[0]["@type"]).toBe("Question");
    expect(jsonLd.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
  });

  it("renders correct pricing FAQ items", () => {
    const { container } = render(<FAQJsonLd items={pricingFaqItems} />);
    const jsonLd = getJsonLd(container);

    expect(jsonLd.mainEntity).toHaveLength(5);
    expect(jsonLd.mainEntity[0].name).toContain("Digital Product Passport cost");
    expect(jsonLd.mainEntity[0].acceptedAnswer.text).toContain("£149");
  });

  it("renders correct ROI FAQ items", () => {
    const { container } = render(<FAQJsonLd items={roiFaqItems} />);
    const jsonLd = getJsonLd(container);

    expect(jsonLd.mainEntity).toHaveLength(5);
    expect(jsonLd.mainEntity[0].name).toContain("DPP compliance cost");
  });

  it("renders correct assessment FAQ items", () => {
    const { container } = render(<FAQJsonLd items={assessmentFaqItems} />);
    const jsonLd = getJsonLd(container);

    expect(jsonLd.mainEntity).toHaveLength(5);
    expect(jsonLd.mainEntity[0].name).toContain("assessment take");
  });

  it("maps each FAQ item to a Question with an Answer", () => {
    const items = [
      { question: "Q1?", answer: "A1." },
      { question: "Q2?", answer: "A2." },
    ];
    const { container } = render(<FAQJsonLd items={items} />);
    const jsonLd = getJsonLd(container);

    expect(jsonLd.mainEntity[0].name).toBe("Q1?");
    expect(jsonLd.mainEntity[0].acceptedAnswer.text).toBe("A1.");
    expect(jsonLd.mainEntity[1].name).toBe("Q2?");
    expect(jsonLd.mainEntity[1].acceptedAnswer.text).toBe("A2.");
  });
});

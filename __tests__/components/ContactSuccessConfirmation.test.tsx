import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ContactSuccessConfirmation } from "@/components/ContactSuccessConfirmation";

describe("ContactSuccessConfirmation", () => {
  it("renders a personalised confirmation including the first name", () => {
    render(
      <ContactSuccessConfirmation firstName="Sarah" email="sarah@acme.com" />
    );
    expect(
      screen.getByText(/Your demo request is in, Sarah\./)
    ).toBeInTheDocument();
  });

  it("renders the email address inline", () => {
    render(
      <ContactSuccessConfirmation firstName="Sarah" email="sarah@acme.com" />
    );
    expect(screen.getByText("sarah@acme.com")).toBeInTheDocument();
  });

  it("falls back to a name-less greeting when firstName is empty", () => {
    render(<ContactSuccessConfirmation firstName="" email="x@y.com" />);
    expect(screen.getByText(/Your demo request is in\./)).toBeInTheDocument();
    expect(screen.queryByText(/, ,/)).not.toBeInTheDocument();
  });

  it("renders the collective fallback link when no featuredDpps are provided", () => {
    render(
      <ContactSuccessConfirmation firstName="Sarah" email="sarah@acme.com" />
    );
    const link = screen.getByText(/See the collective/).closest("a");
    expect(link).toHaveAttribute("href", "/collective");
  });

  it("renders the featured DPP list when featuredDpps are provided", () => {
    render(
      <ContactSuccessConfirmation
        firstName="Sarah"
        email="sarah@acme.com"
        featuredDpps={[
          {
            brandName: "Angry Pablo",
            productName: "CS Running Cap",
            href: "/collective/angry-pablo/cs-running-cap",
          },
          {
            brandName: "FAE",
            productName: "Vada Bottoms",
            href: "/collective/fae/vada-bottoms",
          },
        ]}
      />
    );
    expect(screen.getByText("Angry Pablo")).toBeInTheDocument();
    expect(screen.getByText("CS Running Cap")).toBeInTheDocument();
    expect(screen.getByText("FAE")).toBeInTheDocument();
    expect(screen.getByText("Vada Bottoms")).toBeInTheDocument();
    expect(
      screen.getByText("CS Running Cap").closest("a")
    ).toHaveAttribute("href", "/collective/angry-pablo/cs-running-cap");
  });

  it("does not render the collective fallback link when featuredDpps are provided", () => {
    render(
      <ContactSuccessConfirmation
        firstName="Sarah"
        email="sarah@acme.com"
        featuredDpps={[
          { brandName: "X", productName: "Y", href: "/collective/x/y" },
        ]}
      />
    );
    expect(screen.queryByText(/See the collective/)).not.toBeInTheDocument();
  });

  it("renders the fallback contact email link", () => {
    render(<ContactSuccessConfirmation firstName="Sarah" email="sarah@acme.com" />);
    const link = screen.getByText("info@envrt.com").closest("a");
    expect(link).toHaveAttribute("href", "mailto:info@envrt.com");
  });

  it("does NOT render the old checkmark icon or 'Thank you' heading", () => {
    render(<ContactSuccessConfirmation firstName="Sarah" email="sarah@acme.com" />);
    expect(screen.queryByText(/Thank you/)).not.toBeInTheDocument();
    expect(screen.queryByText(/be in touch shortly/)).not.toBeInTheDocument();
  });

  it("does NOT include a response-time promise", () => {
    render(<ContactSuccessConfirmation firstName="Sarah" email="sarah@acme.com" />);
    expect(screen.queryByText(/within \d+ (working )?hours?/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/within \d+ days?/i)).not.toBeInTheDocument();
  });
});

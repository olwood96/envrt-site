import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GlitchLink } from "@/components/layout/GlitchLink";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("GlitchLink", () => {
  it("renders the visible label text", () => {
    render(<GlitchLink href="/test" label="Are you ready?" />);
    expect(screen.getByRole("link", { name: /are you ready/i })).toBeInTheDocument();
  });

  it("renders an invisible space-reserving copy of the label so width is always correct", () => {
    const { container } = render(<GlitchLink href="/test" label="Are you ready?" />);
    const reserver = container.querySelector("[data-glitch-reserver]");
    expect(reserver).not.toBeNull();
    expect(reserver?.textContent).toBe("Are you ready?");
    expect(reserver).toHaveAttribute("aria-hidden", "true");
  });

  it("positions the animated text absolutely on top of the reserver", () => {
    const { container } = render(<GlitchLink href="/test" label="Pricing" />);
    const animated = container.querySelector("[data-glitch-animated]");
    expect(animated).not.toBeNull();
    expect(animated?.className).toMatch(/absolute/);
  });

  it("wraps in a relative inline-block so the absolute child is contained", () => {
    const { container } = render(<GlitchLink href="/test" label="Pricing" />);
    const wrap = container.querySelector("[data-glitch-wrap]");
    expect(wrap).not.toBeNull();
    expect(wrap?.className).toMatch(/relative/);
    expect(wrap?.className).toMatch(/inline-block/);
    expect(wrap?.className).toMatch(/whitespace-nowrap/);
  });

  it("does not use overflow visible (which caused the overlap bug)", () => {
    const { container } = render(<GlitchLink href="/test" label="Pricing" />);
    const animated = container.querySelector("[data-glitch-animated]") as HTMLElement | null;
    expect(animated?.style.overflow).not.toBe("visible");
  });
});

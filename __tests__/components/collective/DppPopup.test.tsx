import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DppPopup } from "@/components/collective/DppPopup";

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img alt={alt} {...props} />
  ),
}));

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  embedUrl: "https://dpp.envrt.com/ecobrand/summer-2025/tee-001/embed",
  fallbackUrl: "https://envrt.com/collective/ecobrand/tee-001",
  garmentName: "Organic Cotton Tee",
};

describe("DppPopup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "";
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <DppPopup {...defaultProps} open={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders an iframe with the embed URL when open", () => {
    render(<DppPopup {...defaultProps} />);
    const iframe = screen.getByTitle(
      /Digital Product Passport — Organic Cotton Tee/
    );
    expect(iframe).toBeInTheDocument();
    expect(iframe.getAttribute("src")).toContain(defaultProps.embedUrl);
  });

  it("appends src=collective-popup query param to the iframe URL", () => {
    render(<DppPopup {...defaultProps} />);
    const iframe = screen.getByTitle(
      /Digital Product Passport — Organic Cotton Tee/
    );
    expect(iframe.getAttribute("src")).toContain("src=collective-popup");
  });

  it("calls onClose when ESC is pressed", () => {
    const onClose = vi.fn();
    render(<DppPopup {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when overlay (outside modal) is clicked", () => {
    const onClose = vi.fn();
    render(<DppPopup {...defaultProps} onClose={onClose} />);
    const overlay = screen.getByTestId("dpp-popup-overlay");
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it("does NOT call onClose when modal content is clicked", () => {
    const onClose = vi.fn();
    render(<DppPopup {...defaultProps} onClose={onClose} />);
    const content = screen.getByTestId("dpp-popup-content");
    fireEvent.click(content);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<DppPopup {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText("Close popup"));
    expect(onClose).toHaveBeenCalled();
  });

  it("locks body scroll while open and restores on close", () => {
    const { rerender } = render(<DppPopup {...defaultProps} />);
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<DppPopup {...defaultProps} open={false} />);
    expect(document.body.style.overflow).toBe("");
  });

  it("opens fallback URL in a new tab and closes when iframe posts blocked message", () => {
    const onClose = vi.fn();
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<DppPopup {...defaultProps} onClose={onClose} />);

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "envrt-dpp-blocked" },
        })
      );
    });

    expect(openSpy).toHaveBeenCalledWith(defaultProps.fallbackUrl, "_blank");
    expect(onClose).toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it("ignores unrelated postMessage events", () => {
    const onClose = vi.fn();
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<DppPopup {...defaultProps} onClose={onClose} />);

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", { data: { type: "something-else" } })
      );
    });

    expect(openSpy).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it("sets safe sandbox attributes on the iframe", () => {
    render(<DppPopup {...defaultProps} />);
    const iframe = screen.getByTitle(
      /Digital Product Passport — Organic Cotton Tee/
    );
    const sandbox = iframe.getAttribute("sandbox") ?? "";
    expect(sandbox).toContain("allow-scripts");
    expect(sandbox).toContain("allow-same-origin");
  });
});

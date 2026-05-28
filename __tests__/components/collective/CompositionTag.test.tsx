import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CompositionTag } from "@/components/collective/CompositionTag";

type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

let triggerIntersection: ((isIntersecting: boolean) => void) | null = null;

function installIntersectionObserverMock() {
  // Capture the latest callback so each test can fire it manually.
  class MockIntersectionObserver {
    constructor(callback: IOCallback) {
      triggerIntersection = (isIntersecting: boolean) => {
        callback([{ isIntersecting }]);
      };
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn();
  }
  // @ts-expect-error — installing on the test global
  globalThis.IntersectionObserver = MockIntersectionObserver;
}

describe("CompositionTag", () => {
  beforeEach(() => {
    triggerIntersection = null;
    installIntersectionObserverMock();
  });

  afterEach(() => {
    // @ts-expect-error — clean up the mock
    delete globalThis.IntersectionObserver;
  });

  it("renders the material line at rest", () => {
    render(
      <CompositionTag
        material="100% Cotton"
        origin="Made in Portugal"
        year={2026}
      />
    );
    expect(screen.getByText("100% Cotton")).toBeInTheDocument();
  });

  it("renders origin and year lines in the DOM (revealed on hover via CSS)", () => {
    render(
      <CompositionTag
        material="100% Cotton"
        origin="Made in Portugal"
        year={2026}
      />
    );
    expect(screen.getByText("Made in Portugal")).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
  });

  it("omits the origin line when origin is null", () => {
    render(
      <CompositionTag material="100% Cotton" origin={null} year={2026} />
    );
    expect(screen.queryByText(/Made in/)).not.toBeInTheDocument();
  });

  it("omits the year line when year is null", () => {
    render(
      <CompositionTag
        material="100% Cotton"
        origin="Made in Portugal"
        year={null}
      />
    );
    expect(screen.queryByText("2026")).not.toBeInTheDocument();
  });

  it("does not apply the wobble class until the tag enters the viewport", () => {
    const { container } = render(
      <CompositionTag
        material="100% Cotton"
        origin="Made in Portugal"
        year={2026}
      />
    );
    expect(container.querySelector(".animate-tag-wobble")).not.toBeInTheDocument();
  });

  it("applies the wobble class once the IntersectionObserver reports visibility", () => {
    const { container } = render(
      <CompositionTag
        material="100% Cotton"
        origin="Made in Portugal"
        year={2026}
      />
    );

    expect(container.querySelector(".animate-tag-wobble")).not.toBeInTheDocument();

    act(() => {
      triggerIntersection?.(true);
    });

    expect(container.querySelector(".animate-tag-wobble")).toBeInTheDocument();
  });

  it("ignores intersection entries where isIntersecting is false", () => {
    const { container } = render(
      <CompositionTag
        material="100% Cotton"
        origin="Made in Portugal"
        year={2026}
      />
    );

    act(() => {
      triggerIntersection?.(false);
    });

    expect(container.querySelector(".animate-tag-wobble")).not.toBeInTheDocument();
  });

  it("renders successfully when material is the only data point", () => {
    render(
      <CompositionTag
        material="Composition pending"
        origin={null}
        year={null}
      />
    );
    expect(screen.getByText("Composition pending")).toBeInTheDocument();
  });
});

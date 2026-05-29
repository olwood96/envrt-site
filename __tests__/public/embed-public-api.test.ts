// __tests__/public/embed-public-api.test.ts
//
// Smoke tests for the public window.envrtEmbed API exposed by
// public/embed.js. The dashboard's "Test popout" button calls this to
// preview brand-level customisation without saving.
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "fs";
import path from "path";

describe("public/embed.js — window.envrtEmbed", () => {
  beforeAll(() => {
    // Reset the load guard between test runs and evaluate the script in
    // the jsdom global scope. The script's IIFE assigns the public API
    // to window.envrtEmbed on first run.
    delete (window as unknown as Record<string, unknown>).__envrtDppEmbedLoaded;
    delete (window as unknown as Record<string, unknown>).envrtEmbed;
    const src = readFileSync(
      path.resolve(__dirname, "../../public/embed.js"),
      "utf8"
    );
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    new Function(src)();
  });

  it("exposes openTest, close, and the _buildIframeUrl test helper", () => {
    const api = (window as unknown as { envrtEmbed?: Record<string, unknown> })
      .envrtEmbed;
    expect(api).toBeDefined();
    expect(typeof api?.openTest).toBe("function");
    expect(typeof api?.close).toBe("function");
    expect(typeof api?._buildIframeUrl).toBe("function");
  });

  it("transforms the collective href into the dashboard embed URL", () => {
    const build = (
      window as unknown as { envrtEmbed: { _buildIframeUrl: (href: string) => string | null } }
    ).envrtEmbed._buildIframeUrl;
    expect(build("https://envrt.com/collective/acme/tee-01")).toBe(
      "https://dpp.envrt.com/embed/acme/tee-01"
    );
  });

  it("returns null when the href does not match the collective pattern", () => {
    const build = (
      window as unknown as { envrtEmbed: { _buildIframeUrl: (href: string) => string | null } }
    ).envrtEmbed._buildIframeUrl;
    expect(build("https://envrt.com/about")).toBeNull();
    expect(build("https://example.com/collective/acme/tee-01")).toBe(
      // Hostname is ignored by the transform; pathname is what matters.
      "https://dpp.envrt.com/embed/acme/tee-01"
    );
  });

  it("handles slug-safe brand and sku (the supported case)", () => {
    const build = (
      window as unknown as { envrtEmbed: { _buildIframeUrl: (href: string) => string | null } }
    ).envrtEmbed._buildIframeUrl;
    expect(build("https://envrt.com/collective/acme-co/long-sleeve-tee")).toBe(
      "https://dpp.envrt.com/embed/acme-co/long-sleeve-tee"
    );
  });

  // Regression guard: the mobile bottom-sheet height MUST stay on svh
  // (small viewport height) units. vh is calculated against the URL-bar-
  // hidden viewport on iOS Safari/Chrome, so a vh-based height pushes the
  // close button above the visible area when the URL bar is showing,
  // making the popup impossible to close. The CSS variable
  // --envrt-sheet-height defaults to an svh value and is overridden by
  // brand-chosen svh values. Any literal vh fallback in the .sheet rule
  // would silently win the cascade and reintroduce the bug.
  it("does not use vh as a fallback for the mobile sheet height", () => {
    const src = readFileSync(
      path.resolve(__dirname, "../../public/embed.js"),
      "utf8"
    );
    expect(src).not.toMatch(/height:\s*92vh/);
    expect(src).not.toMatch(/max-height:\s*92vh/);
  });
});

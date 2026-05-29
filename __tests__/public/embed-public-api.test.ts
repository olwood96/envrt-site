// __tests__/public/embed-public-api.test.ts
//
// Smoke tests for the public window.envrtEmbed API exposed by
// public/embed.js. The dashboard's "Test popout" button calls this to
// preview brand-level customisation without saving.
import { describe, it, expect, beforeAll, beforeEach, afterEach } from "vitest";
import { readFileSync } from "fs";
import path from "path";

function loadEmbedScript() {
  delete (window as unknown as Record<string, unknown>).__envrtDppEmbedLoaded;
  delete (window as unknown as Record<string, unknown>).envrtEmbed;
  const src = readFileSync(
    path.resolve(__dirname, "../../public/embed.js"),
    "utf8"
  );
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  new Function(src)();
}

describe("public/embed.js — window.envrtEmbed", () => {
  beforeAll(() => {
    loadEmbedScript();
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

describe("public/embed.js — attribution injection", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("injects 'Powered by ENVRT' into a bare .envrt-dpp-link anchor", () => {
    const link = document.createElement("a");
    link.className = "envrt-dpp-link";
    link.href = "https://envrt.com/collective/acme/tee-01";
    link.textContent = "View DPP";
    document.body.appendChild(link);

    loadEmbedScript();

    const attribution = link.querySelector("[data-envrt-attribution]");
    expect(attribution).not.toBeNull();
    expect(attribution!.textContent).toContain("Powered by");
    expect(link.querySelector('img[src*="envrt-logo"]')).not.toBeNull();
    expect(link.getAttribute("data-envrt-attributed")).toBe("1");
  });

  it("does not double-inject when an older snippet already includes the attribution inline", () => {
    // Mimic the previous snippet format: text "Powered by" + the wordmark image.
    const link = document.createElement("a");
    link.className = "envrt-dpp-link";
    link.href = "https://envrt.com/collective/acme/tee-01";
    link.innerHTML =
      'View DPP<br><span>Powered by <img src="https://envrt.com/brand/envrt-logo.png" alt="ENVRT"></span>';
    document.body.appendChild(link);

    loadEmbedScript();

    // Should not add a second attribution span.
    expect(link.querySelectorAll("[data-envrt-attribution]").length).toBe(0);
    expect(link.querySelectorAll('img[src*="envrt-logo"]').length).toBe(1);
    // Still stamped so future passes skip it.
    expect(link.getAttribute("data-envrt-attributed")).toBe("1");
  });

  it("is idempotent across repeated runs on the same anchor", () => {
    const link = document.createElement("a");
    link.className = "envrt-dpp-link";
    link.href = "https://envrt.com/collective/acme/tee-01";
    link.textContent = "View DPP";
    document.body.appendChild(link);

    loadEmbedScript();
    // Manually trigger the injection again via the public API surface
    // (we don't expose injectAttributionEverywhere directly, so we rely
    // on the data-envrt-attributed stamp guarding against double work).
    const span = link.querySelector("[data-envrt-attribution]");
    expect(span).not.toBeNull();

    // Re-running the script body is the closest analogue to "the
    // observer fires twice for the same anchor" in a JSDOM smoke test.
    loadEmbedScript();
    expect(link.querySelectorAll("[data-envrt-attribution]").length).toBe(1);
  });
});


import { describe, it, expect } from "vitest";
import manifest from "@/app/manifest";

describe("Web App Manifest", () => {
  const m = manifest();

  it("includes required name fields", () => {
    expect(m.name).toBeTruthy();
    expect(m.short_name).toBe("ENVRT");
  });

  it("includes description", () => {
    expect(m.description).toBeTruthy();
  });

  it("has standalone display mode", () => {
    expect(m.display).toBe("standalone");
  });

  it("includes start_url", () => {
    expect(m.start_url).toBe("/");
  });

  it("includes theme and background colors", () => {
    expect(m.theme_color).toBeTruthy();
    expect(m.background_color).toBeTruthy();
  });

  it("includes at least one icon", () => {
    expect(m.icons).toBeDefined();
    expect(m.icons!.length).toBeGreaterThanOrEqual(1);
  });
});

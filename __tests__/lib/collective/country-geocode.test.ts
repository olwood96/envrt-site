import { describe, it, expect } from "vitest";
import { getCountryCoords, getLocationInfo } from "@/lib/collective/country-geocode";

describe("getCountryCoords", () => {
  it("returns coords for a known country", () => {
    const coords = getCountryCoords("Turkey");
    expect(coords).toEqual({ lat: 38.96, lng: 35.24 });
  });

  it("is case-insensitive", () => {
    expect(getCountryCoords("TURKEY")).toEqual(getCountryCoords("turkey"));
  });

  it("returns null for unknown country", () => {
    expect(getCountryCoords("Atlantis")).toBeNull();
  });

  it("returns null for null/undefined input", () => {
    expect(getCountryCoords(null)).toBeNull();
    expect(getCountryCoords(undefined)).toBeNull();
  });

  it("handles country aliases", () => {
    const uk1 = getCountryCoords("uk");
    const uk2 = getCountryCoords("united kingdom");
    expect(uk1).toEqual(uk2);
  });
});

describe("getLocationInfo", () => {
  it("returns regional coordinates when available", () => {
    const info = getLocationInfo("Turkey", "Istanbul");
    expect(info).toEqual({ lat: 41.01, lng: 28.98 });
  });

  it("falls back to country centroid when region not found", () => {
    const info = getLocationInfo("Turkey", "UnknownCity");
    expect(info).toEqual({ lat: 38.96, lng: 35.24 });
  });

  it("returns country centroid when regional is null", () => {
    const info = getLocationInfo("Turkey", null);
    expect(info).toEqual({ lat: 38.96, lng: 35.24 });
  });

  it("returns null when country is null", () => {
    expect(getLocationInfo(null, null)).toBeNull();
  });

  it("ignores 'nan' regional values", () => {
    const info = getLocationInfo("Turkey", "nan");
    expect(info).toEqual({ lat: 38.96, lng: 35.24 });
  });

  it("returns regional coords for various countries", () => {
    expect(getLocationInfo("India", "Tirupur")).toEqual({ lat: 11.11, lng: 77.34 });
    expect(getLocationInfo("China", "Shanghai")).toEqual({ lat: 31.23, lng: 121.47 });
    expect(getLocationInfo("Portugal", "Porto")).toEqual({ lat: 41.16, lng: -8.63 });
  });
});

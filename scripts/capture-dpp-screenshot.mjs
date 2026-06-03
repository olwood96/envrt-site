// Captures the live DPP for two purposes:
//
//   1. Element-level screenshots of specific sections (Eco-Score badge,
//      headline metrics, production journey). Used as authentic visuals
//      in the homepage v2 hero's annotation tiles.
//
//   2. A measurement of the DPP page height at the phone-mockup screen
//      width, used to set the iframe pan distance and section Y anchors
//      in the DPP anatomy section.
//
// Output: PNGs under public/screenshots/dpp/, plus a JSON measurements
// file at public/screenshots/dpp/measurements.json.
//
// Run with: node scripts/capture-dpp-screenshot.mjs
// Requires: playwright (devDep) + chromium browser (one-off install).

import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const DPP_URL = "https://dpp.envrt.com/envrt/demo-garments/hoodie-0509-1882";
const SECTIONS_DIR = resolve(REPO_ROOT, "public/screenshots/dpp/sections");
const FULL_PATH = resolve(REPO_ROOT, "public/screenshots/dpp/hoodie-full.png");
const MEASUREMENTS_PATH = resolve(REPO_ROOT, "public/screenshots/dpp/measurements.json");

// Width to render for element captures (high enough to look good in tiles).
const TILE_WIDTH = 414;
// Width to render for measurement (matches the phone-mockup screen width
// in DppAnatomySection / HeroV2).
const PHONE_WIDTH = 280;

async function loadAndHydrate(page) {
  await page.goto(DPP_URL, { waitUntil: "networkidle", timeout: 60_000 });
  // Walk the page to trigger IntersectionObserver-driven lazy content.
  const docHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= docHeight; y += 400) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1_500);
}

async function captureTiles(browser) {
  mkdirSync(SECTIONS_DIR, { recursive: true });
  const context = await browser.newContext({
    viewport: { width: TILE_WIDTH, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  console.log(`[tiles] Loading ${DPP_URL} at ${TILE_WIDTH}px…`);
  await loadAndHydrate(page);

  // Save a full-page reference for fallback / future use.
  await page.screenshot({ path: FULL_PATH, fullPage: true });
  console.log(`[tiles] Saved full page → ${FULL_PATH}`);

  // Eco-Score badge sits absolutely positioned inside data-section="hero".
  // Grab the parent of the img to capture the white pill that wraps it.
  const ecoScoreBadge = page
    .locator('[data-section="hero"] img[alt="Ecoscore label"]')
    .locator("xpath=..");
  if (await ecoScoreBadge.count() > 0) {
    await ecoScoreBadge.screenshot({ path: resolve(SECTIONS_DIR, "eco-score.png") });
    console.log(`[tiles] Saved Eco-Score badge`);
  } else {
    console.warn(`[tiles] Eco-Score badge not found on page`);
  }

  // Headline metric cards (CO₂e, water, mass, transparency).
  await page.locator('[data-section="headline-metrics"]').screenshot({
    path: resolve(SECTIONS_DIR, "headline-metrics.png"),
  });
  console.log(`[tiles] Saved headline metrics`);

  // Production journey (supply chain map + steps).
  await page.locator('[data-section="production-journey"]').screenshot({
    path: resolve(SECTIONS_DIR, "production-journey.png"),
  });
  console.log(`[tiles] Saved production journey`);

  await context.close();
}

async function measureAtPhoneWidth(browser) {
  const context = await browser.newContext({
    viewport: { width: PHONE_WIDTH, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  console.log(`[measure] Loading ${DPP_URL} at ${PHONE_WIDTH}px…`);
  await loadAndHydrate(page);

  const measurements = await page.evaluate(() => {
    const total = document.body.scrollHeight;
    const sections = Array.from(document.querySelectorAll("[data-section]")).map(
      (el) => {
        const rect = el.getBoundingClientRect();
        return {
          name: el.getAttribute("data-section"),
          top: Math.round(rect.top + window.scrollY),
          height: Math.round(rect.height),
        };
      },
    );
    return { totalHeight: total, sections };
  });

  writeFileSync(MEASUREMENTS_PATH, JSON.stringify(measurements, null, 2));
  console.log(`[measure] Saved measurements → ${MEASUREMENTS_PATH}`);
  console.log(`[measure] Total height at ${PHONE_WIDTH}px: ${measurements.totalHeight}px`);
  measurements.sections.forEach((s) => {
    console.log(`[measure]   ${s.name}: top=${s.top}px height=${s.height}px`);
  });

  await context.close();
}

async function main() {
  const browser = await chromium.launch();
  try {
    await captureTiles(browser);
    await measureAtPhoneWidth(browser);
  } finally {
    await browser.close();
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

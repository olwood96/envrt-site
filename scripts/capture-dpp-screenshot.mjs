// Captures a full-page screenshot of the live DPP at mobile width.
// Output: public/screenshots/dpp/hoodie-full.png
//
// Run with: node scripts/capture-dpp-screenshot.mjs
// Requires: playwright (devDep), chromium browser (`npx playwright install chromium`)

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const DPP_URL = "https://dpp.envrt.com/envrt/demo-garments/hoodie-0509-1882";
const OUTPUT_PATH = resolve(REPO_ROOT, "public/screenshots/dpp/hoodie-full.png");
const VIEWPORT = { width: 414, height: 900 };

async function main() {
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log(`Loading ${DPP_URL}…`);
  await page.goto(DPP_URL, { waitUntil: "networkidle", timeout: 60_000 });

  // Walk down the page to trigger any IntersectionObserver-driven lazy content
  // (maps, charts, animated counters), then return to the top.
  console.log("Scrolling to hydrate lazy content…");
  const docHeight = await page.evaluate(() => document.body.scrollHeight);
  const stepPx = 400;
  for (let y = 0; y <= docHeight; y += stepPx) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1_500);

  console.log(`Capturing full page to ${OUTPUT_PATH}…`);
  await page.screenshot({
    path: OUTPUT_PATH,
    fullPage: true,
  });

  await browser.close();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

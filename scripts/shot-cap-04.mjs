import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto("http://localhost:3030/platform", { waitUntil: "networkidle", timeout: 60000 });
// Trigger FadeUp
const total = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= total; y += 500) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(120);
}
// Find cap 04 position
const y = await page.evaluate(() => {
  const ps = Array.from(document.querySelectorAll("p"));
  const m = ps.find((p) => /^04 ·/.test(p.textContent || ""));
  if (!m) return 0;
  return m.getBoundingClientRect().top + window.scrollY;
});
await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 60)), y);

// Wait for the DPP iframe to actually paint. Wait for any cross-origin
// iframe to dispatch load + extra buffer for first paint.
await page.waitForFunction(() => {
  const ifr = document.querySelector("iframe[title*='Digital Product Passport']");
  return !!ifr;
}, { timeout: 10000 });
await page.waitForTimeout(8000); // Cross-origin iframe needs time to paint
await page.screenshot({ path: "/tmp/cap-04-wait.png", clip: { x: 0, y: 0, width: 1440, height: 900 } });
console.log("saved cap-04-wait");

await browser.close();

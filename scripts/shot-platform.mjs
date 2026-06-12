import { chromium } from "playwright";

const URL_BASE = "http://localhost:3030";

const shots = [
  { url: "/platform", name: "platform-full", fullPage: true },
  { url: "/", name: "home-full", fullPage: true },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

for (const s of shots) {
  await page.goto(URL_BASE + s.url, { waitUntil: "networkidle", timeout: 60000 });
  // Scroll through the page to trigger FadeUp intersection observers,
  // then back to top so the fullPage screenshot captures everything visible.
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = 900;
  for (let y = 0; y <= totalHeight; y += viewportHeight) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(250);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `/tmp/${s.name}.png`, fullPage: s.fullPage });
  console.log("saved", s.name);
}

await browser.close();

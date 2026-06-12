import { chromium } from "playwright";

const URL_BASE = "http://localhost:3030";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

// Helper to scroll a capability row into view + screenshot just the row.
async function shotCapability(idx) {
  await page.goto(URL_BASE + "/platform", { waitUntil: "networkidle", timeout: 60000 });
  // Trigger FadeUp by scrolling the whole page
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= total; y += 600) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(120);
  }
  // Now scroll to the capability and shot it
  const sel = `[data-cap="${idx}"]`;
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  // The platform page doesn't have data-cap; instead use heading text from cap.name
  // We'll fall back to scrolling by index using all CapabilityRow children — they
  // share `border-b border-envrt-brand-black/8`. Use Eyebrow text "{idx} · {name}".
}

// Simpler: take a viewport screenshot at known scroll offsets corresponding
// to each capability row. Roughly 9 rows × ~700px tall each.
async function shotsByScroll() {
  await page.goto(URL_BASE + "/platform", { waitUntil: "networkidle", timeout: 60000 });
  // Prime FadeUp
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= total; y += 500) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(100);
  }
  // Find each CapabilityRow by its Eyebrow class "ENVRT/0X"-style index
  // Actually Eyebrow says "{index} · {name}". Find all <p> with text matching /^0\d ·/
  const positions = await page.evaluate(() => {
    const ps = Array.from(document.querySelectorAll("p"));
    const out = [];
    for (const p of ps) {
      const text = p.textContent || "";
      const m = text.match(/^(0\d) ·/);
      if (m) {
        const rect = p.getBoundingClientRect();
        out.push({ idx: m[1], y: rect.top + window.scrollY });
      }
    }
    return out;
  });
  console.log("positions", positions);

  for (const { idx, y } of positions) {
    const offset = Math.max(0, y - 60);
    await page.evaluate((y) => window.scrollTo(0, y), offset);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `/tmp/cap-${idx}.png`, fullPage: false, clip: { x: 0, y: 0, width: 1440, height: 900 } });
    console.log("saved cap-" + idx);
  }
}

// Home hero shot (top viewport)
async function shotHomeHero() {
  await page.goto(URL_BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "/tmp/home-hero.png", clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log("saved home-hero");
}

// In-the-wild section shot
async function shotInTheWild() {
  await page.goto(URL_BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
  // Prime FadeUp
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= total; y += 500) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(100);
  }
  const y = await page.evaluate(() => {
    const h = Array.from(document.querySelectorAll("h2")).find((el) => /Real garments/.test(el.textContent || ""));
    if (!h) return null;
    return h.getBoundingClientRect().top + window.scrollY;
  });
  if (y != null) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, y - 60));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: "/tmp/in-the-wild.png", clip: { x: 0, y: 0, width: 1440, height: 900 } });
    console.log("saved in-the-wild");
  } else {
    console.log("could not find In The Wild section");
  }
}

await shotsByScroll();
await shotHomeHero();
await shotInTheWild();

await browser.close();

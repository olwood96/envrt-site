import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import matter from "gray-matter";

// The sitemap config is CommonJS. Require it so we can exercise the transform
// and assert on the static option shapes.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("../../next-sitemap.config.js");

const root = resolve(__dirname, "..", "..");

const ARTICLE_SLUG = "greenwashing-in-fashion";
const articleFront = matter(
  readFileSync(resolve(root, "content", "insights", `${ARTICLE_SLUG}.mdx`), "utf8"),
).data as { date: string; updated?: string };

describe("next-sitemap config — non-page exclusions", () => {
  it("excludes the PWA manifest", () => {
    expect(config.exclude).toContain("/manifest.webmanifest");
  });

  it("excludes the RSS feed from the URL set", () => {
    expect(config.exclude).toContain("/insights/rss.xml");
  });

  it("does not advertise the RSS feed as a sitemap", () => {
    const extra = config.robotsTxtOptions?.additionalSitemaps ?? [];
    expect(extra.join(" ")).not.toMatch(/rss/i);
  });

  it("does not inject llms.txt as an indexable page", async () => {
    const added = config.additionalPaths ? await config.additionalPaths(config) : [];
    expect(added.map((p: { loc: string }) => p.loc)).not.toContain("/llms.txt");
  });
});

describe("next-sitemap config — lastmod honesty", () => {
  it("stamps articles with their real frontmatter date", async () => {
    const entry = await config.transform(config, `/insights/${ARTICLE_SLUG}`);
    const expected = new Date(
      `${articleFront.updated ?? articleFront.date}T00:00:00.000Z`,
    ).toISOString();
    expect(entry.lastmod).toBe(expected);
    expect(entry.priority).toBe(0.8);
  });

  it("omits lastmod on static pages rather than faking the build time", async () => {
    for (const path of ["/", "/platform", "/pricing"]) {
      const entry = await config.transform(config, path);
      expect(entry.lastmod).toBeUndefined();
    }
  });

  it("keeps the homepage at top priority", async () => {
    const entry = await config.transform(config, "/");
    expect(entry.priority).toBe(1.0);
  });
});

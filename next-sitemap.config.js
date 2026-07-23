const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const INSIGHTS_DIR = path.join(__dirname, "content", "insights");

// Cache frontmatter reads so a full sitemap generation only touches each
// article file once.
const frontmatterCache = new Map();

/**
 * Return the real content date for an insights article as an ISO string, or
 * undefined if the file is missing or has no date. We prefer `updated` over
 * `date` so an edited article signals freshness. Never fabricate a date.
 */
function articleLastmod(slug) {
  if (frontmatterCache.has(slug)) return frontmatterCache.get(slug);

  let iso;
  try {
    const raw = fs.readFileSync(path.join(INSIGHTS_DIR, `${slug}.mdx`), "utf-8");
    const { data } = matter(raw);
    const date = data.updated || data.date;
    if (date) iso = new Date(`${date}T00:00:00.000Z`).toISOString();
  } catch {
    iso = undefined;
  }

  frontmatterCache.set(slug, iso);
  return iso;
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://envrt.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    "/404",
    "/payment/**",
    "/api/**",
    "/collective/*/*/widget",
    "/monitoring",
    // Not indexable HTML pages — a PWA manifest and an RSS feed have no place
    // in the URL set. The feed stays reachable for readers, just not listed
    // here or advertised as a sitemap.
    "/manifest.webmanifest",
    "/insights/rss.xml",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/payment/", "/monitoring"],
      },
    ],
  },
  transform: async (config, path) => {
    // Insights articles carry a real content date. Everything else omits
    // lastmod: a build-time stamp on every page is noise that trains Google
    // to ignore the signal, so we only emit lastmod where it is truthful.
    const isArticle =
      path.startsWith("/insights/") &&
      !path.startsWith("/insights/tag/") &&
      path !== "/insights";

    // Homepage — highest priority, frequent crawl.
    if (path === "/") {
      return { loc: path, changefreq: "weekly", priority: 1.0 };
    }
    // Core product and conversion pages.
    if (["/pricing", "/contact", "/free-dpp"].includes(path)) {
      return { loc: path, changefreq: "monthly", priority: 0.9 };
    }
    // High-value content and discovery pages.
    if (["/insights", "/collective", "/roi", "/assessment", "/faq", "/glossary"].includes(path)) {
      return { loc: path, changefreq: "monthly", priority: 0.8 };
    }
    // Individual collective product pages (dynamic, updated often).
    if (path.startsWith("/collective/")) {
      return { loc: path, changefreq: "weekly", priority: 0.7 };
    }
    // Insights articles — real frontmatter date drives lastmod.
    if (isArticle) {
      const slug = path.replace("/insights/", "");
      return { loc: path, changefreq: "monthly", priority: 0.8, lastmod: articleLastmod(slug) };
    }
    // Tag index pages.
    if (path.startsWith("/insights/tag/")) {
      return { loc: path, changefreq: "weekly", priority: 0.5 };
    }
    // Team page.
    if (path === "/team") {
      return { loc: path, changefreq: "monthly", priority: 0.6 };
    }
    // Legal pages — rarely change.
    if (["/privacy", "/terms"].includes(path)) {
      return { loc: path, changefreq: "yearly", priority: 0.2 };
    }
    // Fallback.
    return { loc: path, changefreq: config.changefreq, priority: config.priority };
  },
};

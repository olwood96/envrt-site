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
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/payment/"],
      },
    ],
    additionalSitemaps: [],
  },
  additionalPaths: async (config) => [
    { loc: "/llms.txt", changefreq: "monthly", priority: 0.5 },
  ],
  transform: async (config, path) => {
    // Homepage - highest priority, frequent crawl
    if (path === "/") {
      return { loc: path, changefreq: "weekly", priority: 1.0, lastmod: new Date().toISOString() };
    }
    // Core product and conversion pages
    if (["/pricing", "/contact", "/free-dpp"].includes(path)) {
      return { loc: path, changefreq: "monthly", priority: 0.9, lastmod: new Date().toISOString() };
    }
    // High-value content and discovery pages
    if (["/insights", "/collective", "/roi", "/assessment", "/faq", "/glossary"].includes(path)) {
      return { loc: path, changefreq: "monthly", priority: 0.8, lastmod: new Date().toISOString() };
    }
    // Individual collective product pages (dynamic, updated often)
    if (path.startsWith("/collective/")) {
      return { loc: path, changefreq: "weekly", priority: 0.7, lastmod: new Date().toISOString() };
    }
    // Insights articles (high SEO value)
    if (path.startsWith("/insights/") && !path.startsWith("/insights/tag/")) {
      return { loc: path, changefreq: "monthly", priority: 0.8, lastmod: new Date().toISOString() };
    }
    // Tag index pages
    if (path.startsWith("/insights/tag/")) {
      return { loc: path, changefreq: "weekly", priority: 0.5, lastmod: new Date().toISOString() };
    }
    // About page
    if (path === "/team") {
      return { loc: path, changefreq: "monthly", priority: 0.6, lastmod: new Date().toISOString() };
    }
    // Legal pages - low priority, rarely change
    if (["/privacy", "/terms"].includes(path)) {
      return { loc: path, changefreq: "yearly", priority: 0.2, lastmod: new Date().toISOString() };
    }
    // Fallback
    return { loc: path, changefreq: config.changefreq, priority: config.priority, lastmod: new Date().toISOString() };
  },
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://envrt.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/404"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    additionalSitemaps: [],
  },
  additionalPaths: async (config) => [
    { loc: "/llms.txt", changefreq: "monthly", priority: 0.5 },
  ],
  transform: async (config, path) => {
    if (path === "/") {
      return { loc: path, changefreq: "weekly", priority: 1.0, lastmod: new Date().toISOString() };
    }
    if (["/pricing", "/contact", "/insights", "/collective", "/roi", "/assessment", "/faq", "/glossary"].includes(path)) {
      return { loc: path, changefreq: "monthly", priority: 0.8, lastmod: new Date().toISOString() };
    }
    if (path.startsWith("/collective/")) {
      return { loc: path, changefreq: "weekly", priority: 0.7, lastmod: new Date().toISOString() };
    }
    if (path.startsWith("/insights/tag/")) {
      return { loc: path, changefreq: "weekly", priority: 0.6, lastmod: new Date().toISOString() };
    }
    if (path.startsWith("/insights/")) {
      return { loc: path, changefreq: "monthly", priority: 0.8, lastmod: new Date().toISOString() };
    }
    if (["/privacy", "/terms"].includes(path)) {
      return { loc: path, changefreq: "yearly", priority: 0.3, lastmod: new Date().toISOString() };
    }
    return { loc: path, changefreq: config.changefreq, priority: config.priority, lastmod: new Date().toISOString() };
  },
};

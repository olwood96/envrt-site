// RSS 2.0 feed for ENVRT Insights. Served at /insights/rss.xml.
// Reads from content/insights via the shared loader, so it stays in
// sync with the article list and detail pages.

import { getAllPostsMeta } from "@/lib/insights";

export const revalidate = 3600;

const SITE_URL = "https://envrt.com";

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPostsMeta();
  const updated = posts[0]?.date ?? new Date().toISOString();

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/insights/${p.slug}`;
      const pubDate = new Date(p.date).toUTCString();
      return [
        "    <item>",
        `      <title>${escape(p.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${escape(p.description)}</description>`,
        `      <author>insights@envrt.com (${escape(p.author)})</author>`,
        ...p.tags.map((t) => `      <category>${escape(t)}</category>`),
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ENVRT Insights</title>
    <link>${SITE_URL}/insights</link>
    <atom:link href="${SITE_URL}/insights/rss.xml" rel="self" type="application/rss+xml" />
    <description>Guides on Digital Product Passports, lifecycle assessment, supply chain transparency and the regulatory landscape facing fashion brands.</description>
    <language>en-GB</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

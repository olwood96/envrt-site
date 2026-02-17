import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface InsightsPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO string e.g. "2026-02-17"
  updated?: string; // ISO string, optional
  author: string;
  tags: string[];
  keywords: string[];
  ogImage?: string; // path relative to /public, e.g. "/insights/og/my-post.jpg"
  featured?: boolean;
  draft?: boolean;
  content: string; // raw markdown body
  readingTime: number; // minutes
}

export type InsightsPostMeta = Omit<InsightsPost, "content">;

// ─── Config ──────────────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), "content", "insights");

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calculateReadingTime(text: string): number {
  const wordsPerMinute = 230;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function parseFrontmatter(filePath: string): InsightsPost | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  // Skip drafts in production
  if (data.draft && process.env.NODE_ENV === "production") {
    return null;
  }

  return {
    slug: path.basename(filePath, ".mdx"),
    title: data.title ?? "Untitled",
    description: data.description ?? "",
    date: data.date ?? new Date().toISOString().split("T")[0],
    updated: data.updated ?? undefined,
    author: data.author ?? "ENVRT",
    tags: data.tags ?? [],
    keywords: data.keywords ?? [],
    ogImage: data.ogImage ?? undefined,
    featured: data.featured ?? false,
    draft: data.draft ?? false,
    content,
    readingTime: calculateReadingTime(content),
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Get all published insights, sorted by date (newest first).
 */
export function getAllPosts(): InsightsPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => parseFrontmatter(path.join(CONTENT_DIR, file)))
    .filter((post): post is InsightsPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get metadata for all posts (no content body — lighter for index pages).
 */
export function getAllPostsMeta(): InsightsPostMeta[] {
  return getAllPosts().map((post) => {
    const { content: _, ...meta } = post;
    void _;
    return meta;
  });
}

/**
 * Get a single post by slug. Returns null if not found.
 */
export function getPostBySlug(slug: string): InsightsPost | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return parseFrontmatter(filePath);
}

/**
 * Get all slugs (for generateStaticParams).
 */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

/**
 * Get all unique tags across all posts.
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllPosts().forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

/**
 * Get posts by tag.
 */
export function getPostsByTag(tag: string): InsightsPostMeta[] {
  return getAllPostsMeta().filter((post) =>
    post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { getAllSlugs, getPostBySlug } from "@/lib/insights";
import { ArticleJsonLd } from "@/components/insights/ArticleJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { TableOfContents } from "@/components/insights/TableOfContents";
import { MdxContent } from "@/components/insights/MdxContent";
import Link from "next/link";
import type { Metadata } from "next";

// ─── Static generation ───────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ─── Dynamic metadata ────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `https://envrt.com/insights/${post.slug}`;

  return {
    title: `${post.title} | ENVRT Insights`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      ...(post.updated && { modifiedTime: post.updated }),
      ...(post.ogImage && { images: [{ url: post.ogImage }] }),
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: url,
    },
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function InsightsPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `https://envrt.com/insights/${post.slug}`;

  return (
    <div className="pt-28 pb-16">
      <ArticleJsonLd post={post} url={url} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://envrt.com" },
          { name: "Insights", url: "https://envrt.com/insights" },
          { name: post.title, url },
        ]}
      />

      <Container>
        <article className="mx-auto max-w-2xl">
          {/* Back link */}
          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 text-sm text-envrt-muted transition-colors hover:text-envrt-teal"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            All insights
          </Link>

          {/* Header */}
          <header className="mt-6">
            {post.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-envrt-teal/5 px-2.5 py-0.5 text-xs font-medium text-envrt-teal"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
              {post.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-envrt-muted">
              <span>{post.author}</span>
              <span className="text-envrt-charcoal/20">·</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="text-envrt-charcoal/20">·</span>
              <span>{post.readingTime} min read</span>
              {post.updated && (
                <>
                  <span className="text-envrt-charcoal/20">·</span>
                  <span>Updated {formatDate(post.updated)}</span>
                </>
              )}
            </div>
          </header>

          {/* Table of contents */}
          <TableOfContents content={post.content} />

          {/* Body */}
          <div className="mt-8">
            <MdxContent content={post.content} />
          </div>

          {/* Footer CTA */}
          <footer className="mt-16 rounded-2xl border border-envrt-teal/10 bg-envrt-teal/5 p-6 text-center sm:p-8">
            <p className="text-lg font-semibold text-envrt-charcoal">
              Ready to build transparency into your supply chain?
            </p>
            <p className="mt-2 text-sm text-envrt-muted">
              See how ENVRT helps fashion brands track, measure, and communicate
              sustainability.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-block rounded-full bg-envrt-teal px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-envrt-teal/90"
            >
              Get in touch
            </Link>
          </footer>
        </article>
      </Container>
    </div>
  );
}

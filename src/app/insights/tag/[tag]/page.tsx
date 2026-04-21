import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { InsightsCard } from "@/components/insights/InsightCard";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getAllTags, getPostsByTag, tagSlug } from "@/lib/insights";
import Link from "next/link";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tagSlug(tag) }));
}

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (posts.length === 0) return {};

  const displayTag = posts[0]?.tags.find(
    (t) => tagSlug(t) === tagSlug(tag)
  ) ?? tag;

  const title = `${displayTag} - Insights | ENVRT`;
  const description = `Articles and guides about ${displayTag.toLowerCase()} from ENVRT. Digital Product Passports, sustainability data, and fashion transparency.`;
  const url = `https://envrt.com/insights/tag/${tagSlug(tag)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  if (posts.length === 0) notFound();

  const displayTag = posts[0]?.tags.find(
    (t) => tagSlug(t) === tagSlug(tag)
  ) ?? tag;

  return (
    <div className="pt-28 pb-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://envrt.com" },
          { name: "Insights", url: "https://envrt.com/insights" },
          {
            name: displayTag,
            url: `https://envrt.com/insights/tag/${tagSlug(tag)}`,
          },
        ]}
      />
      <Container>
        <div className="mx-auto max-w-3xl">
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            All insights
          </Link>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-envrt-charcoal sm:text-5xl">
            {displayTag}
          </h1>
          <p className="mt-4 text-base text-envrt-muted sm:text-lg">
            {posts.length} {posts.length === 1 ? "article" : "articles"} tagged
            with {displayTag}.
          </p>

          <div className="mt-12 space-y-6">
            {posts.map((post) => (
              <InsightsCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

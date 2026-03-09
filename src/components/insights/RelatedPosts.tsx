import { InsightsCard } from "@/components/insights/InsightCard";
import { getAllPostsMeta } from "@/lib/insights";
import type { InsightsPostMeta } from "@/lib/insights";

interface RelatedPostsProps {
  currentSlug: string;
  tags: string[];
  maxPosts?: number;
}

export function RelatedPosts({
  currentSlug,
  tags,
  maxPosts = 3,
}: RelatedPostsProps) {
  const allPosts = getAllPostsMeta();

  const related = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({
      post,
      overlap: post.tags.filter((t) =>
        tags.map((tag) => tag.toLowerCase()).includes(t.toLowerCase())
      ).length,
    }))
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, maxPosts)
    .map(({ post }) => post);

  if (related.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-xl font-bold tracking-tight text-envrt-charcoal">
        Related articles
      </h2>
      <div className="mt-6 space-y-6">
        {related.map((post: InsightsPostMeta) => (
          <InsightsCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

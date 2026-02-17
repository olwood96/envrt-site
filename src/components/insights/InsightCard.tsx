import Link from "next/link";
import type { InsightsPostMeta } from "@/lib/insights";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function InsightsCard({ post }: { post: InsightsPostMeta }) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="group block rounded-2xl border border-envrt-charcoal/5 bg-white p-6 transition-all duration-300 hover:border-envrt-teal/20 hover:shadow-lg sm:p-8"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-envrt-muted">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span className="text-envrt-charcoal/20">·</span>
        <span>{post.readingTime} min read</span>
      </div>

      <h2 className="mt-3 text-xl font-bold tracking-tight text-envrt-charcoal transition-colors group-hover:text-envrt-teal sm:text-2xl">
        {post.title}
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-envrt-charcoal/60 line-clamp-3">
        {post.description}
      </p>

      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="rounded-full bg-envrt-teal/5 px-2.5 py-0.5 text-xs font-medium text-envrt-teal"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

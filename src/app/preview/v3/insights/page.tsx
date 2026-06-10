import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, ButtonV3 } from "@/components/v3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";
import {
  getAllPostsMeta,
  getAllTags,
  tagSlug,
  type InsightsPostMeta,
} from "@/lib/insights";

export const metadata: Metadata = {
  title: "Insights v3 preview",
  robots: { index: false, follow: false },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function InsightsV3IndexPage() {
  const posts = getAllPostsMeta();
  const tags = getAllTags();

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = featured ? posts.filter((p) => p.slug !== featured.slug) : posts;

  return (
    <main>
      <PageHero
        tone="sunny"
        eyebrow="Insights"
        heading={
          <>
            What we have learned.{" "}
            <span className="text-envrt-brand-black/40">
              Written down honestly.
            </span>
          </>
        }
        body="Guides on Digital Product Passports, Life Cycle Assessment and fashion environmental data. Built from work with brands, not from press releases."
        actions={
          <>
            <ButtonV3 href="/preview/v3/free-dpp" variant="primary">
              Try ENVRT on one garment<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/preview/v3/glossary" variant="ghost">
              Glossary of terms<span>→</span>
            </ButtonV3>
          </>
        }
        cornerLeft="ENVRT/01"
        cornerRight="Insights"
      />

      {tags.length > 0 && <TagsNav tags={tags} />}
      {featured && <FeaturedSection post={featured} />}
      {rest.length > 0 && <PostList posts={rest} />}
      {posts.length === 0 && <EmptyState />}

      <FinalCtaV3 />
    </main>
  );
}

function TagsNav({ tags }: { tags: string[] }) {
  return (
    <section className="relative bg-envrt-brand-vista py-10 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <ul className="flex flex-wrap gap-2 sm:gap-3">
            {tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/preview/v3/insights/tag/${tagSlug(tag)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-envrt-brand-black/12 bg-white px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/70 transition-colors duration-200 hover:border-envrt-brand-ultramarine/30 hover:text-envrt-brand-ultramarine sm:text-[11px]"
                >
                  <span className="text-envrt-brand-ultramarine">#</span>
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </section>
  );
}

function FeaturedSection({ post }: { post: InsightsPostMeta }) {
  return (
    <section className="relative bg-envrt-brand-vista pb-20 sm:pb-24 lg:pb-32">
      <SectionCorners left="ENVRT/02" right="Featured" />
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-14 sm:pt-16">
          <FadeUp>
            <Eyebrow>02 · Featured</Eyebrow>
          </FadeUp>

          <FadeUp delay={0.08}>
            <Link
              href={`/preview/v3/insights/${post.slug}`}
              className="group mt-8 block rounded-3xl border border-envrt-brand-black/10 bg-white p-7 transition-colors duration-300 hover:border-envrt-brand-ultramarine/30 sm:p-10"
            >
              <div className="grid gap-10 sm:grid-cols-[1fr,auto] sm:items-end">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-envrt-brand-black/55">
                    <time
                      dateTime={post.date}
                      className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px]"
                    >
                      {formatDate(post.date)}
                    </time>
                    <span aria-hidden className="text-envrt-brand-black/20">·</span>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px]">
                      {post.readingTime} min read
                    </span>
                  </div>

                  <h2 className="mt-5 font-display text-2xl font-medium leading-[1.1] tracking-[-0.025em] text-envrt-brand-black transition-colors duration-200 group-hover:text-envrt-brand-ultramarine sm:text-3xl lg:text-4xl">
                    {post.title}
                  </h2>

                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg">
                    {post.description}
                  </p>

                  {post.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-envrt-brand-ultramarine/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-[11px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <span
                  aria-hidden
                  className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-envrt-brand-black/15 text-base text-envrt-brand-black/65 transition-all duration-200 group-hover:border-envrt-brand-ultramarine group-hover:text-envrt-brand-ultramarine sm:h-14 sm:w-14 sm:text-lg"
                >
                  →
                </span>
              </div>
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function PostList({ posts }: { posts: InsightsPostMeta[] }) {
  return (
    <section className="relative bg-[rgba(255,229,15,0.10)] pb-20 sm:pb-24 lg:pb-32">
      <SectionCorners left="ENVRT/03" right={`${posts.length} more articles`} />
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-14 sm:pt-16">
          <FadeUp>
            <Eyebrow>03 · All articles</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-4xl">
              Every guide we have published.
            </h2>
          </FadeUp>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6">
            {posts.map((post, i) => (
              <FadeUp key={post.slug} delay={Math.min(0.12 + i * 0.04, 0.4)}>
                <PostCard post={post} />
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PostCard({ post }: { post: InsightsPostMeta }) {
  return (
    <Link
      href={`/preview/v3/insights/${post.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-envrt-brand-black/10 bg-white p-7 transition-colors duration-300 hover:border-envrt-brand-ultramarine/30"
    >
      <div className="flex flex-wrap items-center gap-3 text-envrt-brand-black/55">
        <time
          dateTime={post.date}
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px]"
        >
          {formatDate(post.date)}
        </time>
        <span aria-hidden className="text-envrt-brand-black/20">·</span>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px]">
          {post.readingTime} min read
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl font-medium leading-tight tracking-tight text-envrt-brand-black transition-colors duration-200 group-hover:text-envrt-brand-ultramarine sm:text-2xl">
        {post.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-envrt-brand-black/70 sm:text-[15px]">
        {post.description}
      </p>

      {post.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-envrt-brand-ultramarine/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

function EmptyState() {
  return (
    <section className="relative bg-envrt-brand-vista py-20">
      <div className="mx-auto max-w-[900px] px-5 text-center sm:px-8">
        <p className="text-base text-envrt-brand-black/60 sm:text-lg">
          No posts yet. Check back soon.
        </p>
      </div>
    </section>
  );
}

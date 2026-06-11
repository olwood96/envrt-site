import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, ButtonV3 } from "@/components/v3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";
import { InsightsBrowserV3 } from "@/components/v3/insights/InsightsBrowserV3";
import {
  getAllPostsMeta,
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

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = featured ? posts.filter((p) => p.slug !== featured.slug) : posts;

  return (
    <main className="theme-sunny">
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

      {featured && <FeaturedSection post={featured} />}
      {posts.length > 0 ? (
        <InsightsBrowserV3
          posts={rest}
          basePath="/preview/v3/insights"
        />
      ) : (
        <EmptyState />
      )}

      <FinalCtaV3 />
    </main>
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

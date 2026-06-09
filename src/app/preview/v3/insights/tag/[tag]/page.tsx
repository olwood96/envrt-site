import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllTags,
  getPostsByTag,
  tagSlug,
  type InsightsPostMeta,
} from "@/lib/insights";
import { PageHero, ButtonV3 } from "@/components/v3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";

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

  const displayTag =
    posts[0]?.tags.find((t) => tagSlug(t) === tagSlug(tag)) ?? tag;

  return {
    title: `${displayTag} | v3 insights preview`,
    description: `Articles tagged with ${displayTag.toLowerCase()}.`,
    robots: { index: false, follow: false },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function InsightsV3TagPage({ params }: PageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  const displayTag =
    posts[0]?.tags.find((t) => tagSlug(t) === tagSlug(tag)) ?? tag;
  const otherTags = getAllTags().filter((t) => tagSlug(t) !== tagSlug(tag));

  return (
    <main>
      <PageHero
        eyebrow={`#${displayTag}`}
        heading={
          <>
            Everything we have written on{" "}
            <span className="text-envrt-brand-black/40">{displayTag.toLowerCase()}.</span>
          </>
        }
        body={`${posts.length} ${posts.length === 1 ? "article" : "articles"} grouped by topic. Long-form pieces, not press releases.`}
        actions={
          <>
            <ButtonV3 href="/preview/v3/insights" variant="primary">
              All insights<span>→</span>
            </ButtonV3>
            <ButtonV3 href="/preview/v3/glossary" variant="ghost">
              Glossary of terms<span>→</span>
            </ButtonV3>
          </>
        }
        cornerLeft="ENVRT/01"
        cornerRight={`#${displayTag}`}
      />

      {otherTags.length > 0 && <OtherTagsNav tags={otherTags} />}

      <ResultsSection posts={posts} displayTag={displayTag} />

      <FinalCtaV3 />
    </main>
  );
}

function OtherTagsNav({ tags }: { tags: string[] }) {
  return (
    <section className="relative bg-envrt-brand-vista py-10 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[11px]">
            Other topics
          </p>
        </FadeUp>
        <FadeUp delay={0.06}>
          <ul className="mt-4 flex flex-wrap gap-2 sm:gap-3">
            {tags.map((t) => (
              <li key={t}>
                <Link
                  href={`/preview/v3/insights/tag/${tagSlug(t)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-envrt-brand-black/12 bg-white px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/70 transition-colors duration-200 hover:border-envrt-brand-ultramarine/30 hover:text-envrt-brand-ultramarine sm:text-[11px]"
                >
                  <span className="text-envrt-brand-ultramarine">#</span>
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </section>
  );
}

function ResultsSection({
  posts,
  displayTag,
}: {
  posts: InsightsPostMeta[];
  displayTag: string;
}) {
  return (
    <section className="relative bg-envrt-brand-vista pb-20 sm:pb-28">
      <SectionCorners left="ENVRT/02" right={`${posts.length} results`} />
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-14 sm:pt-16">
          <FadeUp>
            <Eyebrow>{`02 · #${displayTag}`}</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-4xl">
              {`${posts.length} ${posts.length === 1 ? "article" : "articles"} on ${displayTag.toLowerCase()}.`}
            </h2>
          </FadeUp>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6">
            {posts.map((post, i) => (
              <FadeUp key={post.slug} delay={Math.min(0.12 + i * 0.04, 0.4)}>
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
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

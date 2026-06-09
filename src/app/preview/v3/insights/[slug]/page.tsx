import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllSlugs,
  getPostBySlug,
  getAllPostsMeta,
  tagSlug,
} from "@/lib/insights";
import { MdxContentV3 } from "@/components/insights/MdxContentV3";
import { TableOfContentsV3 } from "@/components/insights/TableOfContentsV3";
import { ArticleFaqAccordionV3 } from "@/components/insights/ArticleFaqAccordionV3";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { FadeUp } from "@/components/ui/Motion";
import { ButtonV3 } from "@/components/v3";
import { FinalCtaV3 } from "@/components/sections/v3/FinalCtaV3";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | v3 preview`,
    description: post.description,
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

export default async function InsightsV3PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allMeta = getAllPostsMeta();
  const related = allMeta
    .filter(
      (p) =>
        p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t))
    )
    .slice(0, 3);

  return (
    <main className="bg-envrt-brand-vista">
      <section className="relative overflow-hidden bg-envrt-brand-vista pt-24 pb-14 sm:pt-32 sm:pb-20">
        <SectionCorners left="ENVRT/01" right="Insights" />
        <div className="relative mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-[720px]">
            <FadeUp>
              <Link
                href="/preview/v3/insights"
                className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 transition-colors duration-200 hover:text-envrt-brand-ultramarine sm:text-[11px]"
              >
                <span aria-hidden>←</span>
                All insights
              </Link>
            </FadeUp>

            {post.tags.length > 0 && (
              <FadeUp delay={0.04}>
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/preview/v3/insights/tag/${tagSlug(tag)}`}
                      className="rounded-full bg-envrt-brand-ultramarine/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine transition-colors duration-200 hover:bg-envrt-brand-ultramarine/15 sm:text-[11px]"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </FadeUp>
            )}

            <FadeUp delay={0.08}>
              <h1 className="mt-6 font-display text-[2.25rem] font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-5xl lg:text-[3.25rem]">
                {post.title}
              </h1>
            </FadeUp>

            <FadeUp delay={0.16}>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-envrt-brand-black/55">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px]">
                  {post.author}
                </span>
                <span aria-hidden className="text-envrt-brand-black/20">·</span>
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
                {post.updated && (
                  <>
                    <span aria-hidden className="text-envrt-brand-black/20">·</span>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px]">
                      Updated {formatDate(post.updated)}
                    </span>
                  </>
                )}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="relative pb-20 sm:pb-28">
        <SectionCorners left="ENVRT/02" right="Article" />
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-[720px] border-t border-envrt-brand-black/8 pt-12 sm:pt-16">
            {post.description && (
              <FadeUp>
                <div className="mb-10 rounded-2xl border border-envrt-brand-ultramarine/15 bg-envrt-brand-ultramarine/[0.04] p-6 sm:p-7">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-[11px]">
                    TL;DR
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-envrt-brand-black/80 sm:text-base">
                    {post.description}
                  </p>
                </div>
              </FadeUp>
            )}

            <TableOfContentsV3 content={post.content} />

            <article className="mt-10">
              <MdxContentV3 content={post.content} />
            </article>

            {post.faq && post.faq.length > 0 && (
              <div className="mt-16 border-t border-envrt-brand-black/10 pt-14">
                <Eyebrow>FAQ</Eyebrow>
                <h2 className="mt-4 font-display text-2xl font-medium leading-[1.1] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl">
                  Frequently asked questions
                </h2>
                <div className="mt-8">
                  <ArticleFaqAccordionV3 items={post.faq} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="relative bg-envrt-brand-vista pb-20 sm:pb-28">
          <SectionCorners left="ENVRT/03" right="Related" />
          <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
            <div className="border-t border-envrt-brand-black/8 pt-14 sm:pt-16">
              <FadeUp>
                <Eyebrow>03 · Related reading</Eyebrow>
              </FadeUp>
              <FadeUp delay={0.08}>
                <h2 className="mt-4 max-w-2xl font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-4xl">
                  Keep digging on the same topics.
                </h2>
              </FadeUp>

              <div className="mt-12 grid gap-5 sm:grid-cols-3 sm:gap-6">
                {related.map((p, i) => (
                  <FadeUp key={p.slug} delay={0.12 + i * 0.05}>
                    <Link
                      href={`/preview/v3/insights/${p.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-envrt-brand-black/10 bg-white p-6 transition-colors duration-300 hover:border-envrt-brand-ultramarine/30"
                    >
                      <time
                        dateTime={p.date}
                        className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[11px]"
                      >
                        {formatDate(p.date)}
                      </time>
                      <h3 className="mt-3 font-display text-lg font-medium leading-tight tracking-tight text-envrt-brand-black transition-colors duration-200 group-hover:text-envrt-brand-ultramarine">
                        {p.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-envrt-brand-black/70">
                        {p.description}
                      </p>
                    </Link>
                  </FadeUp>
                ))}
              </div>

              <div className="mt-12">
                <ButtonV3 href="/preview/v3/insights" variant="ghost">
                  All insights<span>→</span>
                </ButtonV3>
              </div>
            </div>
          </div>
        </section>
      )}

      <FinalCtaV3 />
    </main>
  );
}

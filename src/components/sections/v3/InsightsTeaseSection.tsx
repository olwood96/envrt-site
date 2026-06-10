"use client";

import Link from "next/link";
import type { InsightsPostMeta } from "@/lib/insights";
import { FadeUp } from "@/components/ui/Motion";
import { Eyebrow } from "./_shared";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function InsightsTeaseSection({ posts }: { posts: InsightsPostMeta[] }) {
  if (!posts.length) return null;

  return (
    <section className="bg-envrt-brand-vista py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
        <FadeUp>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end sm:gap-6">
            <div>
              <Eyebrow>Insights</Eyebrow>
              <h2 className="mt-4 max-w-2xl font-display text-2xl font-medium leading-[1.1] tracking-[-0.02em] text-envrt-brand-black sm:mt-5 sm:text-4xl lg:text-[2.75rem]">
                Notes from inside the DPP build.
              </h2>
            </div>
            <Link
              href="/insights"
              className="group inline-flex items-center gap-1.5 self-start text-sm font-semibold text-envrt-brand-black underline-offset-4 hover:text-envrt-brand-ultramarine hover:underline sm:self-end"
            >
              Read everything
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </FadeUp>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 lg:mt-12 lg:gap-6">
          {posts.map((post, i) => (
            <FadeUp key={post.slug} delay={0.08 + i * 0.06}>
              <Link
                href={`/insights/${post.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-envrt-brand-black/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-envrt-brand-ultramarine/30 hover:shadow-[0_18px_40px_-18px_rgba(14,14,14,0.12)] sm:p-7"
              >
                {/* Meta row */}
                <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.16em] text-envrt-brand-black/55 sm:text-[11px]">
                  <span>{formatDate(post.date)}</span>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-envrt-brand-black/30" />
                  <span>{post.readingTime} min read</span>
                </div>

                {/* Title */}
                <h3 className="mt-4 font-display text-lg font-semibold leading-snug tracking-tight text-envrt-brand-black transition-colors duration-300 group-hover:text-envrt-brand-ultramarine sm:text-xl">
                  {post.title}
                </h3>

                {/* Description */}
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-envrt-brand-black/65 sm:text-[15px]">
                  {post.description}
                </p>

                {/* Tags + arrow */}
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-envrt-brand-black/6 pt-4">
                  <span className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-envrt-brand-ultramarine">
                    {post.tags[0] ?? "Insight"}
                  </span>
                  <span
                    aria-hidden
                    className="text-base text-envrt-brand-black/45 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-envrt-brand-black"
                  >
                    →
                  </span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

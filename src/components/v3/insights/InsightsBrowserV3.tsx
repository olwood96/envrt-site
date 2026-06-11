"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FadeUp } from "@/components/ui/Motion";
import {
  Eyebrow,
  SectionCorners,
} from "@/components/sections/v3/_shared";
import { DropdownV3 } from "@/components/v3/DropdownV3";
import {
  INSIGHT_TOPICS,
  countPostsByTopic,
  postMatchesTopic,
} from "@/lib/insightTopics";
import type { InsightsPostMeta } from "@/lib/insights";

type SortKey = "newest" | "oldest" | "quick" | "long";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "quick", label: "Quick reads first" },
  { value: "long", label: "Long reads first" },
];

interface Props {
  posts: InsightsPostMeta[];
  /** Path prefix for article links and URL rewrites, e.g. "/insights" */
  basePath: string;
}

export function InsightsBrowserV3(props: Props) {
  return (
    <Suspense fallback={<StaticFallback {...props} />}>
      <BrowserInner {...props} />
    </Suspense>
  );
}

function StaticFallback({ posts, basePath }: Props) {
  return (
    <BrowserLayout
      posts={posts}
      basePath={basePath}
      query=""
      topic=""
      sort="newest"
      onQuery={() => {}}
      onTopic={() => {}}
      onSort={() => {}}
      onClear={() => {}}
    />
  );
}

function BrowserInner({ posts, basePath }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const topic = searchParams.get("topic") ?? "";
  const sort = (searchParams.get("sort") as SortKey | null) ?? "newest";

  function update(next: { q?: string; topic?: string; sort?: SortKey }) {
    const p = new URLSearchParams(searchParams.toString());
    if (next.q !== undefined) {
      if (next.q) p.set("q", next.q);
      else p.delete("q");
    }
    if (next.topic !== undefined) {
      if (next.topic) p.set("topic", next.topic);
      else p.delete("topic");
    }
    if (next.sort !== undefined) {
      if (next.sort && next.sort !== "newest") p.set("sort", next.sort);
      else p.delete("sort");
    }
    const qs = p.toString();
    router.replace(`${basePath}${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  return (
    <BrowserLayout
      posts={posts}
      basePath={basePath}
      query={query}
      topic={topic}
      sort={sort}
      onQuery={(v) => update({ q: v })}
      onTopic={(v) => update({ topic: v })}
      onSort={(v) => update({ sort: v })}
      onClear={() => router.replace(basePath, { scroll: false })}
    />
  );
}

interface LayoutProps extends Props {
  query: string;
  topic: string;
  sort: SortKey;
  onQuery: (v: string) => void;
  onTopic: (v: string) => void;
  onSort: (v: SortKey) => void;
  onClear: () => void;
}

function BrowserLayout({
  posts,
  basePath,
  query,
  topic,
  sort,
  onQuery,
  onTopic,
  onSort,
  onClear,
}: LayoutProps) {
  const filtered = useMemo(() => {
    let result = posts;

    if (topic) {
      result = result.filter((p) => postMatchesTopic(p.tags, topic));
    }

    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((p) => {
        if (p.title.toLowerCase().includes(q)) return true;
        if (p.description.toLowerCase().includes(q)) return true;
        return p.tags.some((t) => t.toLowerCase().includes(q));
      });
    }

    return [...result].sort((a, b) => {
      switch (sort) {
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "quick":
          return a.readingTime - b.readingTime;
        case "long":
          return b.readingTime - a.readingTime;
        case "newest":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [posts, query, topic, sort]);

  const hasActive = !!query || !!topic || sort !== "newest";
  const total = posts.length;
  const showing = filtered.length;

  const topicCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of INSIGHT_TOPICS) {
      map.set(t.slug, countPostsByTopic(posts, t.slug));
    }
    return map;
  }, [posts]);

  return (
    <section className="relative bg-envrt-brand-vista pb-20 sm:pb-24 lg:pb-32">
      <SectionCorners
        left="ENVRT/03"
        right={
          hasActive
            ? `${showing}/${total} results`
            : `${total} articles`
        }
      />
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-16">
        <div className="border-t border-envrt-brand-black/8 pt-14 sm:pt-16">
          <FadeUp>
            <Eyebrow>03 · Browse</Eyebrow>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h2 className="mt-4 max-w-2xl font-display text-2xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl lg:text-4xl">
              Find what you need.
            </h2>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg">
              Browse by topic, search by keyword or sort by length. Every guide
              is editorially curated, not auto-tagged.
            </p>
          </FadeUp>

          <FadeUp delay={0.24}>
            <FilterCard
              posts={posts}
              query={query}
              topic={topic}
              sort={sort}
              showing={showing}
              hasActive={hasActive}
              topicCounts={topicCounts}
              onQuery={onQuery}
              onTopic={onTopic}
              onSort={onSort}
              onClear={onClear}
            />
          </FadeUp>

          <div className="mt-10 sm:mt-12">
            {filtered.length === 0 ? (
              <EmptyState onClear={onClear} />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                {filtered.map((post, i) => (
                  <FadeUp
                    key={post.slug}
                    delay={Math.min(0.08 + i * 0.03, 0.32)}
                  >
                    <PostCard post={post} basePath={basePath} />
                  </FadeUp>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface FilterCardProps {
  posts: InsightsPostMeta[];
  query: string;
  topic: string;
  sort: SortKey;
  showing: number;
  hasActive: boolean;
  topicCounts: Map<string, number>;
  onQuery: (v: string) => void;
  onTopic: (v: string) => void;
  onSort: (v: SortKey) => void;
  onClear: () => void;
}

function FilterCard({
  posts,
  query,
  topic,
  sort,
  showing,
  hasActive,
  topicCounts,
  onQuery,
  onTopic,
  onSort,
  onClear,
}: FilterCardProps) {
  return (
    <div className="mt-10 rounded-3xl border border-envrt-brand-black/10 bg-white p-4 sm:mt-12 sm:p-6">
      <TopicChips
        topic={topic}
        totalCount={posts.length}
        topicCounts={topicCounts}
        onTopic={onTopic}
      />

      <div className="mt-4 border-t border-envrt-brand-black/8 pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <SearchInput value={query} onChange={onQuery} />

          <DropdownV3
            variant="chip"
            label="Sort"
            placeholder="Newest first"
            value={sort}
            options={SORT_OPTIONS}
            onChange={(v) => onSort(v as SortKey)}
          />

          <div className="ml-auto flex items-center gap-4">
            {hasActive && (
              <button
                type="button"
                onClick={onClear}
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 transition-colors duration-200 hover:text-envrt-brand-ultramarine sm:text-[11px]"
              >
                Clear filters
              </button>
            )}
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/60 sm:text-[11px]">
              {showing} {showing === 1 ? "result" : "results"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopicChips({
  topic,
  totalCount,
  topicCounts,
  onTopic,
}: {
  topic: string;
  totalCount: number;
  topicCounts: Map<string, number>;
  onTopic: (v: string) => void;
}) {
  return (
    <ul className="flex flex-wrap gap-2">
      <li>
        <TopicChip
          active={!topic}
          label="All"
          count={totalCount}
          onClick={() => onTopic("")}
        />
      </li>
      {INSIGHT_TOPICS.map((t) => {
        const count = topicCounts.get(t.slug) ?? 0;
        if (count === 0) return null;
        return (
          <li key={t.slug}>
            <TopicChip
              active={topic === t.slug}
              label={t.label}
              count={count}
              onClick={() => onTopic(topic === t.slug ? "" : t.slug)}
            />
          </li>
        );
      })}
    </ul>
  );
}

function TopicChip({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 sm:text-[11px] ${
        active
          ? "border-envrt-brand-ultramarine bg-envrt-brand-ultramarine text-white"
          : "border-envrt-brand-black/12 bg-white text-envrt-brand-black/70 hover:border-envrt-brand-ultramarine/30 hover:text-envrt-brand-ultramarine"
      }`}
    >
      <span>{label}</span>
      <span
        className={
          active ? "text-white/70" : "text-envrt-brand-black/35"
        }
      >
        {count}
      </span>
    </button>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Press "/" anywhere to focus the search box. Skip if the user is already
  // typing in an input or textarea so the shortcut never hijacks normal text
  // entry.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/") return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      e.preventDefault();
      inputRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative w-full sm:w-64">
      <svg
        aria-hidden
        className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-envrt-brand-black/45"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search insights"
        aria-label="Search insights"
        className="h-10 w-full rounded-full border border-envrt-brand-black/12 bg-envrt-brand-vista/40 pl-10 pr-4 text-sm text-envrt-brand-black placeholder:text-envrt-brand-black/45 focus:border-envrt-brand-ultramarine/40 focus:outline-none focus:ring-2 focus:ring-envrt-brand-ultramarine/15"
      />
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-envrt-brand-black/15 bg-white px-6 py-16 text-center sm:py-20">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/45 sm:text-[11px]">
        No matches
      </p>
      <p className="mt-4 max-w-md mx-auto font-display text-xl font-medium leading-tight tracking-tight text-envrt-brand-black sm:text-2xl">
        Nothing matches that search yet.
      </p>
      <p className="mt-3 max-w-md mx-auto text-sm leading-relaxed text-envrt-brand-black/65 sm:text-base">
        Try a different topic, broaden the keyword, or clear the filters to see
        every insight.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-envrt-brand-black/15 px-5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/70 transition-colors duration-200 hover:border-envrt-brand-ultramarine/40 hover:text-envrt-brand-ultramarine sm:text-[11px]"
      >
        Clear filters
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function PostCard({
  post,
  basePath,
}: {
  post: InsightsPostMeta;
  basePath: string;
}) {
  return (
    <Link
      href={`${basePath}/${post.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-envrt-brand-black/10 bg-white p-7 transition-colors duration-300 hover:border-envrt-brand-ultramarine/30"
    >
      <div className="flex flex-wrap items-center gap-3 text-envrt-brand-black/55">
        <time
          dateTime={post.date}
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px]"
        >
          {formatDate(post.date)}
        </time>
        <span aria-hidden className="text-envrt-brand-black/20">
          ·
        </span>
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

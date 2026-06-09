"use client";

import { useState } from "react";

interface TocItem {
  text: string;
  id: string;
  level: number;
}

function extractHeadings(markdown: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const text = match[2].trim();
    items.push({
      text,
      id: text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      level: match[1].length,
    });
  }

  return items;
}

interface Props {
  content: string;
}

export function TableOfContentsV3({ content }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const headings = extractHeadings(content);

  if (headings.length < 3) return null;

  return (
    <nav className="my-10 rounded-2xl border border-envrt-brand-black/10 bg-white p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between"
        aria-expanded={isOpen}
      >
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/65 sm:text-[11px]">
          Table of contents
        </span>
        <span
          aria-hidden
          className={`flex h-7 w-7 items-center justify-center rounded-full border border-envrt-brand-black/20 text-sm font-medium text-envrt-brand-black/65 transition-transform duration-300 ${
            isOpen ? "rotate-45 border-envrt-brand-ultramarine text-envrt-brand-ultramarine" : ""
          }`}
        >
          +
        </span>
      </button>
      {isOpen && (
        <ul className="mt-5 space-y-2">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block text-sm transition-colors duration-200 hover:text-envrt-brand-ultramarine ${
                  heading.level === 3
                    ? "pl-5 text-envrt-brand-black/55"
                    : "text-envrt-brand-black/80"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

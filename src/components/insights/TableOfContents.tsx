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
      level: match[1].length, // 2 = h2, 3 = h3
    });
  }

  return items;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const headings = extractHeadings(content);

  if (headings.length < 3) return null; // Don't show for short posts

  return (
    <nav className="my-8 rounded-xl border border-envrt-charcoal/5 bg-white/50 p-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-sm font-semibold text-envrt-charcoal"
      >
        <span>Table of contents</span>
        <svg
          className={`h-4 w-4 text-envrt-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <ul className="mt-3 space-y-1.5">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block text-sm transition-colors hover:text-envrt-teal ${
                  heading.level === 3 ? "pl-4 text-envrt-muted" : "text-envrt-charcoal/70"
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

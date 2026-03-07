"use client";

import { useState } from "react";

interface Props {
  snippet: string;
}

export function CollectiveEmbedSnippet({ snippet }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-envrt-charcoal/5 bg-white p-5 sm:p-6">
      <p className="text-[10px] font-medium uppercase tracking-widest text-envrt-muted">
        Embed This Product
      </p>
      <p className="mt-1 text-xs text-envrt-muted">
        Add this product card to your website.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg bg-envrt-cream/60 p-3 text-[10px] leading-relaxed text-envrt-charcoal">
        {snippet}
      </pre>
      <button
        onClick={handleCopy}
        className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-envrt-charcoal/8 px-4 py-2 text-xs font-medium text-envrt-charcoal transition-colors hover:border-envrt-teal/20 hover:text-envrt-teal"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
        </svg>
        {copied ? "Copied!" : "Copy embed code"}
      </button>
    </div>
  );
}

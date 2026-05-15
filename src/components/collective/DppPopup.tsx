"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  embedUrl: string;
  fallbackUrl: string;
  garmentName: string;
}

function appendSourceParam(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}src=collective-popup`;
}

export function DppPopup({
  open,
  onClose,
  embedUrl,
  fallbackUrl,
  garmentName,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string } | null;
      if (data && data.type === "envrt-dpp-blocked") {
        window.open(fallbackUrl, "_blank");
        onClose();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [open, fallbackUrl, onClose]);

  useEffect(() => {
    if (open) setIsLoading(true);
  }, [open, embedUrl]);

  if (!open) return null;

  const iframeSrc = appendSourceParam(embedUrl);

  return (
    <div
      data-testid="dpp-popup-overlay"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={contentRef}
        data-testid="dpp-popup-content"
        className="relative h-full max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close popup"
          className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-envrt-charcoal shadow-md transition-colors hover:bg-envrt-cream"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>

        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#f8f7f4]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-envrt-teal border-t-transparent" />
          </div>
        )}

        <iframe
          src={iframeSrc}
          title={`Digital Product Passport — ${garmentName}`}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}

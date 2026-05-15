"use client";

import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  embedUrl: string;
  fallbackUrl: string;
  garmentName: string;
  /**
   * Tailwind class(es) controlling the drawer's top position. Defaults to
   * `top-0` (full height). Consumers with a fixed top nav should pass a
   * matching offset, e.g. `"top-16 sm:top-20"`. For Phase 2 (embed.js on
   * brand sites) the default is correct — drawer covers full viewport.
   */
  topOffsetClass?: string;
}

const ANIMATION_MS = 300;

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
  topOffsetClass = "top-0",
}: Props) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mount/unmount lifecycle so the slide-out animation can play before unmount.
  // Double RAF on open ensures the browser paints the drawer at translateX(100%)
  // BEFORE we flip visible→true; otherwise React batches both renders and the
  // transition never fires (the drawer just appears in place).
  useEffect(() => {
    if (open) {
      setMounted(true);
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        if (raf2) cancelAnimationFrame(raf2);
      };
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), ANIMATION_MS);
      return () => clearTimeout(t);
    }
  }, [open]);

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

  if (!mounted) return null;

  const iframeSrc = appendSourceParam(embedUrl);

  return (
    <>
      {/* Backdrop */}
      <div
        data-testid="dpp-popup-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className={`fixed inset-x-0 bottom-0 ${topOffsetClass} z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* External close button: sits on the backdrop just outside the drawer's
            left edge. Hidden on mobile since the drawer goes full-width there. */}
        <button
          onClick={onClose}
          aria-label="Close popup"
          className={`absolute right-[calc(min(100vw,42rem)+1rem)] top-8 z-[60] hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/95 text-envrt-charcoal shadow-lg backdrop-blur transition-all duration-200 hover:scale-105 hover:bg-white hover:text-envrt-teal sm:flex ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: visible ? "150ms" : "0ms" }}
        >
          <svg
            className="h-5 w-5"
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
      </div>

      {/* Drawer */}
      <div
        data-testid="dpp-popup-content"
        className={`fixed bottom-0 right-0 ${topOffsetClass} z-[60] flex w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Internal close button: kept for mobile (where the external one is
            hidden) and as a fallback for accessibility. */}
        <button
          onClick={onClose}
          aria-label="Close popup"
          className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-envrt-charcoal shadow-md transition-colors hover:bg-envrt-cream sm:hidden"
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
          className="h-full w-full flex-1 border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </>
  );
}

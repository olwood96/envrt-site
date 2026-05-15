"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  embedUrl: string;
  fallbackUrl: string;
  garmentName: string;
  /**
   * Tailwind class(es) controlling the drawer's top position. Defaults to
   * `top-0` (full height). Consumers that want to leave a header visible
   * can pass e.g. `"top-16 sm:top-20"`. For Phase 2 (embed.js on brand
   * sites) the default is correct — drawer covers full viewport.
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
  const [cursorOnBackdrop, setCursorOnBackdrop] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Mount/unmount lifecycle. Double RAF on open ensures the browser paints
  // the drawer at translateX(100%) before we flip visible→true; otherwise
  // React batches both renders and the slide-in transition never fires.
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

  // Track cursor on the backdrop via direct DOM writes so we don't re-render
  // the whole component on every mousemove.
  const handleBackdropMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    }
  };

  if (!mounted) return null;

  const iframeSrc = appendSourceParam(embedUrl);

  return (
    <>
      {/* Backdrop: covers everything including the host site's navbar.
          z-[100] is safely above the envrt.com navbar (z-50) and most
          brand-site overlays. */}
      <div
        data-testid="dpp-popup-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onMouseMove={handleBackdropMouseMove}
        onMouseEnter={() => setCursorOnBackdrop(true)}
        onMouseLeave={() => setCursorOnBackdrop(false)}
        className={`fixed inset-x-0 bottom-0 ${topOffsetClass} z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 sm:cursor-none ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Cursor-following X. pointer-events-none so the click passes through
          to the backdrop's onClick. Hidden on touch/mobile (no cursor). */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[110] hidden h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/95 text-envrt-charcoal shadow-lg backdrop-blur transition-opacity duration-150 sm:flex ${
          cursorOnBackdrop && visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
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
      </div>

      {/* Drawer */}
      <div
        data-testid="dpp-popup-content"
        className={`fixed bottom-0 right-0 ${topOffsetClass} z-[100] flex w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Always-visible internal close button (primary discoverable action). */}
        <button
          onClick={onClose}
          aria-label="Close popup"
          className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-envrt-charcoal shadow-md transition-colors hover:bg-envrt-cream hover:text-envrt-teal"
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

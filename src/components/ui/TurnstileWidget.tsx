"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact";
          appearance?: "always" | "execute" | "interaction-only";
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export type TurnstileStatus = "loading" | "verifying" | "verified" | "error" | "expired";

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
  onStatusChange?: (status: TurnstileStatus) => void;
  appearance?: "always" | "execute" | "interaction-only";
  size?: "normal" | "compact";
  theme?: "light" | "dark" | "auto";
  className?: string;
}

export function TurnstileWidget({
  onToken,
  onStatusChange,
  appearance = "always",
  size = "normal",
  theme = "light",
  className,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const onStatusChangeRef = useRef(onStatusChange);
  onTokenRef.current = onToken;
  onStatusChangeRef.current = onStatusChange;

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) {
      // Surface the misconfig in the console so the cause is obvious
      // when forms reject with "Bot verification failed". Server-side
      // TURNSTILE_SECRET_KEY drives the verifier; if it's set, the
      // widget MUST produce a token. Missing public key = no widget,
      // no token, every submission rejected.
      // eslint-disable-next-line no-console
      console.warn(
        "[Turnstile] NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set. " +
          "Forms will be rejected by the API. " +
          "Set this env var in Vercel and redeploy."
      );
      onStatusChangeRef.current?.("error");
      return;
    }

    onStatusChangeRef.current?.("loading");

    function renderWidget() {
      if (!window.turnstile || !containerRef.current) return;
      // Remove previous widget if exists
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
      }
      onStatusChangeRef.current?.("verifying");
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey!,
        callback: (token: string) => {
          onTokenRef.current(token);
          onStatusChangeRef.current?.("verified");
        },
        "expired-callback": () => {
          onTokenRef.current("");
          onStatusChangeRef.current?.("expired");
        },
        "error-callback": () => {
          onTokenRef.current("");
          onStatusChangeRef.current?.("error");
        },
        theme,
        size,
        appearance,
      });
    }

    // If Turnstile is already loaded, render immediately
    if (window.turnstile) {
      renderWidget();
      return;
    }

    // Otherwise, load the script
    const existing = document.querySelector(
      'script[src*="challenges.cloudflare.com"]'
    );
    if (!existing) {
      window.onloadTurnstileCallback = renderWidget;
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";
      script.async = true;
      document.head.appendChild(script);
    } else {
      // Script exists but hasn't loaded yet
      window.onloadTurnstileCallback = renderWidget;
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [appearance, size, theme]);

  return <div ref={containerRef} className={className} />;
}

/**
 * A small inline verification indicator that pairs with a hidden TurnstileWidget.
 * Shows: spinner while verifying → green tick when verified.
 */
export function TurnstileIndicator({ status }: { status: TurnstileStatus }) {
  if (status === "verified") {
    return (
      <div className="flex items-center gap-1.5 text-envrt-teal" title="Verified">
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M5 8.5l2 2 4-4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (status === "error" || status === "expired") {
    return (
      <div className="flex items-center gap-1.5 text-red-400" title="Verification failed">
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // loading or verifying — show spinner
  return (
    <div className="flex items-center gap-1.5 text-envrt-muted" title="Verifying...">
      <div className="h-4 w-4 animate-spin rounded-full border-[1.5px] border-envrt-muted/30 border-t-envrt-muted" />
    </div>
  );
}

/**
 * Inline Turnstile mount used by every form on the site.
 *
 * Uses `appearance="interaction-only"`: Cloudflare keeps the widget
 * collapsed to 0 height while it can verify silently in the
 * background (95%+ of users), and self-expands it into the visible
 * "Verify you are human" challenge only when human interaction is
 * actually required (VPN, ad blocker, suspicious fingerprint, etc).
 *
 * Critical: we do NOT wrap the widget in a hidden container. The
 * previous version pinned it to `h-0 w-0 opacity-0 pointer-events-
 * none absolute`, which silently broke every flagged user because
 * the Cloudflare challenge tried to render in an invisible 0x0
 * box. Here the wrapper lets the iframe size itself.
 *
 * For unflagged users we render a v3-styled "Verified, you're
 * human" pill instead of the Cloudflare box. The box only appears
 * if interaction is genuinely required, at which point it sits
 * inline above the pill and the user can click it.
 */
export function HiddenTurnstile({
  onToken,
  className,
}: {
  onToken: (token: string) => void;
  className?: string;
}) {
  const [status, setStatus] = useState<TurnstileStatus>("loading");

  const handleToken = (token: string) => {
    onToken(token);
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className ?? ""}`}>
      {/* Cloudflare widget. Renders 0 height when CF can verify
          silently. Expands into the visible challenge only when
          interaction is required. */}
      <TurnstileWidget
        onToken={handleToken}
        onStatusChange={setStatus}
        appearance="interaction-only"
        size="compact"
      />

      {/* v3-styled status pill. Replaces the Cloudflare branded
          box for the silent-pass path. */}
      <StatusPill status={status} />
    </div>
  );
}

function StatusPill({ status }: { status: TurnstileStatus }) {
  if (status === "verified") {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full border border-envrt-brand-ultramarine/15 bg-envrt-brand-ultramarine/5 px-2 py-0.5">
        <svg
          aria-hidden
          className="h-2.5 w-2.5 text-envrt-brand-ultramarine"
          viewBox="0 0 12 12"
          fill="none"
        >
          <circle cx="6" cy="6" r="5.25" stroke="currentColor" strokeWidth="1.25" />
          <path
            d="M3.75 6.25l1.5 1.5 3-3.25"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-[9px]">
          Verified
        </span>
      </div>
    );
  }

  if (status === "error" || status === "expired") {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full border border-envrt-brand-crimson/20 bg-envrt-brand-crimson/5 px-2 py-0.5">
        <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-crimson sm:text-[9px]">
          {status === "expired" ? "Check expired" : "Verification failed"}
        </span>
      </div>
    );
  }

  // loading + verifying
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-envrt-brand-black/10 bg-white/60 px-2 py-0.5 backdrop-blur">
      <span
        aria-hidden
        className="h-2.5 w-2.5 animate-spin rounded-full border-[1.5px] border-envrt-brand-black/15 border-t-envrt-brand-ultramarine"
      />
      <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/55 sm:text-[9px]">
        Verifying
      </span>
    </div>
  );
}

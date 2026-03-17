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
  className?: string;
}

export function TurnstileWidget({
  onToken,
  onStatusChange,
  appearance = "always",
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
    if (!siteKey) return;

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
        theme: "light",
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
  }, [appearance]);

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
 * Drop-in replacement: renders a hidden Turnstile widget + a small visual indicator.
 * Use this instead of TurnstileWidget when you don't want the Cloudflare branding.
 */
export function HiddenTurnstile({
  onToken,
  className,
}: {
  onToken: (token: string) => void;
  className?: string;
}) {
  const [status, setStatus] = useState<TurnstileStatus>("loading");

  return (
    <div className={`flex items-center ${className ?? ""}`}>
      {/* Hidden Turnstile — rendered off-screen but still in DOM */}
      <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
        <TurnstileWidget
          onToken={onToken}
          onStatusChange={setStatus}
          appearance="interaction-only"
        />
      </div>
      <TurnstileIndicator status={status} />
    </div>
  );
}

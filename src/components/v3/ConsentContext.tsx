"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Consent state for non-essential cookies / analytics. localStorage
// persists the choice (localStorage itself is not a cookie under GDPR
// when used for functional state, so it doesn't require consent).
//
// Three states:
//   "unknown" — banner hasn't been answered yet; treat as not consented
//   "accepted" — GA4 + Clarity (if added later) initialise
//   "declined" — analytics never load

export type ConsentValue = "unknown" | "accepted" | "declined";

type ConsentContextValue = {
  consent: ConsentValue;
  accept: () => void;
  decline: () => void;
  /** True only when the consent value is "accepted". Use to gate
   *  analytics script loading on the client. */
  analyticsAllowed: boolean;
};

const Ctx = createContext<ConsentContextValue | null>(null);
const LS_KEY = "envrt:v3:consent";

function readLocal(): ConsentValue {
  if (typeof window === "undefined") return "unknown";
  try {
    const v = window.localStorage.getItem(LS_KEY);
    if (v === "accepted" || v === "declined") return v;
  } catch {
    /* ignore */
  }
  return "unknown";
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentValue>("unknown");

  // Hydrate from localStorage after mount (SSR-safe).
  useEffect(() => {
    setConsent(readLocal());
  }, []);

  const accept = useCallback(() => {
    setConsent("accepted");
    try {
      window.localStorage.setItem(LS_KEY, "accepted");
    } catch {
      /* ignore */
    }
  }, []);

  const decline = useCallback(() => {
    setConsent("declined");
    try {
      window.localStorage.setItem(LS_KEY, "declined");
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      accept,
      decline,
      analyticsAllowed: consent === "accepted",
    }),
    [consent, accept, decline],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      consent: "unknown",
      accept: () => {},
      decline: () => {},
      analyticsAllowed: false,
    };
  }
  return ctx;
}

// Routes where the consent banner + analytics are intentionally
// suppressed. DPP destinations (collective product pages + widget) are
// visitor landing surfaces — the customer scanned a QR to see the
// passport, not the marketing site, and we don't want analytics chrome
// or a consent banner getting in the way. Matched as path prefixes.
export const CONSENT_EXEMPT_PREFIXES = [
  "/collective/", // matches both /[brand]/[product] and /[brand]/[product]/widget
] as const;

export function pathIsConsentExempt(pathname: string | null): boolean {
  if (!pathname) return false;
  // Listing pages /collective and /collective/[brand] still get analytics
  // — only deep product + widget pages are exempt.
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "collective") return false;
  // [/collective, /collective/[brand]] → analytics on (1 or 2 segments)
  // [/collective/[brand]/[product], /collective/[brand]/[product]/widget] → exempt
  return segments.length >= 3;
}

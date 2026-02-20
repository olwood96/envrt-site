// components/WebsiteBeacon.tsx
// Drop this into envrt.com's root layout.
// Tracks: page views, scroll depth, duration, CTA clicks, device, referrer, UTMs.
// Privacy-first: no cookies, no localStorage, no PII.
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const ANALYTICS_URL = process.env.NEXT_PUBLIC_ANALYTICS_URL
  ?? "https://dashboard.envrt.com/api/website-analytics";

// ── Helpers ──

function getDeviceType(): string {
  const ua = navigator.userAgent || "";
  if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "tablet";
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return "tablet";
  if (/Mobile|iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return "mobile";
  return "desktop";
}

function getReferrerDomain(): string | null {
  try {
    const ref = document.referrer;
    if (!ref) return null;
    const url = new URL(ref);
    const host = url.hostname.replace(/^www\./, "");
    // Don't count self-referrals
    if (host === "envrt.com" || host === "www.envrt.com") return null;
    if (host === "localhost" || host === "127.0.0.1") return null;
    return host;
  } catch { return null; }
}

function getUtmParams(): { source?: string; medium?: string; campaign?: string } {
  try {
    const sp = new URLSearchParams(window.location.search);
    return {
      source: sp.get("utm_source") ?? undefined,
      medium: sp.get("utm_medium") ?? undefined,
      campaign: sp.get("utm_campaign") ?? undefined,
    };
  } catch { return {}; }
}

async function computeVisitorHash(): Promise<string | null> {
  try {
    const raw = [
      navigator.userAgent,
      screen.width + "x" + screen.height,
      navigator.language,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    ].join("|");
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
  } catch { return null; }
}

async function send(payload: Record<string, unknown>): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(ANALYTICS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    if (res.ok) return res.json();
  } catch {}
  return null;
}

// ── Session page count (in-memory, resets on tab close) ──
let sessionPageCount = 0;

export default function WebsiteBeacon() {
  const pathname = usePathname();
  const viewIdRef = useRef<string | null>(null);
  const startTimeRef = useRef(Date.now());
  const maxScrollRef = useRef(0);
  const ctaClicksRef = useRef<{ cta: string; href: string; ts: number }[]>([]);
  const sentRef = useRef(false);

  useEffect(() => {
    // Reset on each page navigation
    viewIdRef.current = null;
    startTimeRef.current = Date.now();
    maxScrollRef.current = 0;
    ctaClicksRef.current = [];
    sentRef.current = false;
    sessionPageCount++;

    // ── Log initial view ──
    (async () => {
      const visitorHash = await computeVisitorHash();
      const utm = getUtmParams();

      const result = await send({
        action: "log",
        pagePath: pathname,
        pageTitle: document.title,
        deviceType: getDeviceType(),
        referrerDomain: getReferrerDomain(),
        utmSource: utm.source,
        utmMedium: utm.medium,
        utmCampaign: utm.campaign,
        visitorHash,
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
      });

      if (result?.viewId) {
        viewIdRef.current = result.viewId as string;
      }
    })();

    // ── Scroll tracking ──
    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const pct = Math.min(100, Math.round((scrollTop / docHeight) * 100));
      if (pct > maxScrollRef.current) maxScrollRef.current = pct;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── CTA click tracking ──
    function onCtaClick(e: MouseEvent) {
      const el = (e.target as HTMLElement)?.closest("[data-cta]") as HTMLElement | null;
      if (!el) return;
      const cta = el.getAttribute("data-cta") ?? "unknown";
      const href = (el as HTMLAnchorElement).href ?? el.closest("a")?.href ?? "";
      ctaClicksRef.current.push({
        cta,
        href: href.slice(0, 200),
        ts: Math.round((Date.now() - startTimeRef.current) / 1000),
      });
    }
    document.addEventListener("click", onCtaClick, true);

    // ── Periodic enrichment (every 8s) ──
    function enrich() {
      if (!viewIdRef.current) return;
      const dur = Math.round((Date.now() - startTimeRef.current) / 1000);
      send({
        action: "enrich",
        viewId: viewIdRef.current,
        durationSeconds: dur,
        scrollDepth: maxScrollRef.current,
        ctaClicks: ctaClicksRef.current,
        sessionPageCount,
      });
    }
    const enrichInterval = setInterval(enrich, 8000);

    // ── Final send on page leave ──
    function onLeave() {
      if (sentRef.current || !viewIdRef.current) return;
      sentRef.current = true;
      const dur = Math.round((Date.now() - startTimeRef.current) / 1000);
      // Use sendBeacon for reliability on page close
      try {
        navigator.sendBeacon(
          ANALYTICS_URL,
          JSON.stringify({
            action: "enrich",
            viewId: viewIdRef.current,
            durationSeconds: dur,
            scrollDepth: maxScrollRef.current,
            ctaClicks: ctaClicksRef.current,
            sessionPageCount,
          })
        );
      } catch {
        send({
          action: "enrich",
          viewId: viewIdRef.current,
          durationSeconds: dur,
          scrollDepth: maxScrollRef.current,
          ctaClicks: ctaClicksRef.current,
          sessionPageCount,
        });
      }
    }
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") onLeave();
    });
    window.addEventListener("beforeunload", onLeave);

    return () => {
      clearInterval(enrichInterval);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onCtaClick, true);
      window.removeEventListener("beforeunload", onLeave);
      // Send final data on SPA navigation
      enrich();
    };
  }, [pathname]);

  return null;
}

// components/WebsiteBeacon.tsx
// Drop this into envrt.com's root layout.
//
// Tracks automatically:
//   - Page views, scroll depth, duration, device, referrer, UTMs
//   - Homepage section visibility + dwell times (via data-section attributes)
//   - CTA clicks (via data-cta attributes)
//   - Time to first CTA click
//   - Form field interactions + abandonment (on pages with data-track-form)
//   - Blog content read depth (on pages with [data-article-body])
//
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
  } catch { /* swallow */ }
  return null;
}

// Session page count (in-memory, resets on tab close)
let sessionPageCount = 0;

export default function WebsiteBeacon() {
  const pathname = usePathname();
  const viewIdRef = useRef<string | null>(null);
  const startTimeRef = useRef(Date.now());
  const maxScrollRef = useRef(0);
  const ctaClicksRef = useRef<{ cta: string; href: string; ts: number }[]>([]);
  const sentRef = useRef(false);

  // Section tracking
  const sectionsSeenRef = useRef<Set<string>>(new Set());
  const sectionDwellRef = useRef<Map<string, number>>(new Map());
  const sectionEntryRef = useRef<Map<string, number>>(new Map());

  // Form tracking
  const formFieldsTouchedRef = useRef<Set<string>>(new Set());
  const formSubmittedRef = useRef(false);

  // Blog read depth
  const contentReadDepthRef = useRef(0);

  // Time to first CTA
  const firstCtaTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset on each page navigation
    viewIdRef.current = null;
    startTimeRef.current = Date.now();
    maxScrollRef.current = 0;
    ctaClicksRef.current = [];
    sentRef.current = false;
    sectionsSeenRef.current = new Set();
    sectionDwellRef.current = new Map();
    sectionEntryRef.current = new Map();
    formFieldsTouchedRef.current = new Set();
    formSubmittedRef.current = false;
    contentReadDepthRef.current = 0;
    firstCtaTimeRef.current = null;
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

      // Blog content read depth
      const articleBody = document.querySelector("[data-article-body]");
      if (articleBody) {
        const rect = articleBody.getBoundingClientRect();
        const bodyTop = rect.top + window.scrollY;
        const bodyHeight = rect.height;
        if (bodyHeight > 0) {
          const readTo = Math.max(0, (scrollTop + window.innerHeight) - bodyTop);
          const readPct = Math.min(100, Math.round((readTo / bodyHeight) * 100));
          if (readPct > contentReadDepthRef.current) {
            contentReadDepthRef.current = readPct;
          }
        }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Section visibility tracking ──
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const now = Date.now();
        for (const entry of entries) {
          const name = (entry.target as HTMLElement).dataset.section;
          if (!name) continue;

          if (entry.isIntersecting) {
            sectionsSeenRef.current.add(name);
            sectionEntryRef.current.set(name, now);
          } else {
            const enteredAt = sectionEntryRef.current.get(name);
            if (enteredAt) {
              const elapsed = (now - enteredAt) / 1000;
              sectionDwellRef.current.set(
                name,
                (sectionDwellRef.current.get(name) ?? 0) + elapsed
              );
              sectionEntryRef.current.delete(name);
            }
          }
        }
      },
      { threshold: 0.3 }
    );

    const sectionTimer = setTimeout(() => {
      document.querySelectorAll("[data-section]").forEach((el) => {
        sectionObserver.observe(el);
      });
    }, 500);

    // ── CTA click tracking ──
    function onCtaClick(e: MouseEvent) {
      const el = (e.target as HTMLElement)?.closest("[data-cta]") as HTMLElement | null;
      if (!el) return;
      const cta = el.getAttribute("data-cta") ?? "unknown";
      const href = (el as HTMLAnchorElement).href ?? el.closest("a")?.href ?? "";
      const elapsed = Date.now() - startTimeRef.current;
      ctaClicksRef.current.push({
        cta,
        href: href.slice(0, 200),
        ts: Math.round(elapsed / 1000),
      });
      if (firstCtaTimeRef.current === null) {
        firstCtaTimeRef.current = elapsed;
      }
    }
    document.addEventListener("click", onCtaClick, true);

    // ── Form field tracking ──
    function onFormFocus(e: FocusEvent) {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (!target?.name) return;
      if (!target.closest("[data-track-form]")) return;
      formFieldsTouchedRef.current.add(target.name);
    }
    function onFormSubmit(e: Event) {
      if ((e.target as HTMLElement)?.closest?.("[data-track-form]")) {
        formSubmittedRef.current = true;
      }
    }
    document.addEventListener("focusin", onFormFocus, true);
    document.addEventListener("submit", onFormSubmit, true);

    // ── Build enrichment payload ──
    function buildEnrichPayload(): Record<string, unknown> {
      const now = Date.now();
      const dwellSnapshot: Record<string, number> = {};
      for (const [sec, total] of sectionDwellRef.current) {
        dwellSnapshot[sec] = Math.round(total);
      }
      for (const [sec, enteredAt] of sectionEntryRef.current) {
        const elapsed = (now - enteredAt) / 1000;
        dwellSnapshot[sec] = Math.round((dwellSnapshot[sec] ?? 0) + elapsed);
      }

      return {
        action: "enrich",
        viewId: viewIdRef.current,
        durationSeconds: Math.round((now - startTimeRef.current) / 1000),
        scrollDepth: maxScrollRef.current,
        ctaClicks: ctaClicksRef.current,
        sessionPageCount,
        sectionsViewed: [...sectionsSeenRef.current],
        sectionDwellTimes: Object.keys(dwellSnapshot).length > 0 ? dwellSnapshot : null,
        formFieldsTouched: formFieldsTouchedRef.current.size > 0 ? [...formFieldsTouchedRef.current] : null,
        formSubmitted: formSubmittedRef.current || null,
        contentReadDepth: contentReadDepthRef.current > 0 ? contentReadDepthRef.current : null,
        timeToFirstCtaMs: firstCtaTimeRef.current,
      };
    }

    // ── Periodic enrichment (every 8s) ──
    function enrich() {
      if (!viewIdRef.current) return;
      send(buildEnrichPayload());
    }
    const enrichInterval = setInterval(enrich, 8000);

    // ── Final send on page leave ──
    function onLeave() {
      if (sentRef.current || !viewIdRef.current) return;
      sentRef.current = true;
      try {
        navigator.sendBeacon(ANALYTICS_URL, JSON.stringify(buildEnrichPayload()));
      } catch {
        send(buildEnrichPayload());
      }
    }
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") onLeave();
    });
    window.addEventListener("beforeunload", onLeave);

    return () => {
      clearInterval(enrichInterval);
      clearTimeout(sectionTimer);
      sectionObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onCtaClick, true);
      document.removeEventListener("focusin", onFormFocus, true);
      document.removeEventListener("submit", onFormSubmit, true);
      window.removeEventListener("beforeunload", onLeave);
      enrich();
    };
  }, [pathname]);

  return null;
}

// components/CollectiveBeacon.tsx
//
// Records a single visit to envrt.com/collective/{brandSlug} in the
// dashboard analytics database. Mirrors the privacy-first design of the
// existing WebsiteBeacon: no cookies, no localStorage, no PII, no IP.
//
// The visitor_hash field is a SHA-256 of stable device fingerprint and
// is non-reversible.
"use client";

import { useEffect, useRef } from "react";

const ENDPOINT =
  process.env.NEXT_PUBLIC_COLLECTIVE_VIEW_URL
  ?? "https://dashboard.envrt.com/api/collective-view";

interface Props {
  brandId: string;
  brandSlug: string;
}

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
  } catch {
    return null;
  }
}

async function visitorHash(): Promise<string | null> {
  try {
    const raw = [
      navigator.userAgent,
      screen.width + "x" + screen.height,
      navigator.language,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    ].join("|");
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 32);
  } catch {
    return null;
  }
}

export default function CollectiveBeacon({ brandId, brandSlug }: Props) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    // Skip in obvious non-visitor contexts.
    const ref = document.referrer || "";
    if (
      ref.includes("dashboard.envrt.com")
      || ref.includes("dpp.envrt.com")
      || /localhost|127\.0\.0\.1/.test(window.location.hostname)
    ) {
      return;
    }

    const sp = new URLSearchParams(window.location.search);
    const source = sp.get("src") === "qr" ? "qr" : "link";

    (async () => {
      const payload = {
        brandId,
        brandSlug,
        source,
        deviceType: getDeviceType(),
        referrerDomain: getReferrerDomain(),
        language: navigator.language || null,
        screenResolution: `${screen.width}x${screen.height}`,
        visitorHash: await visitorHash(),
      };
      try {
        await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      } catch {
        /* fail silently */
      }
    })();
  }, [brandId, brandSlug]);

  return null;
}

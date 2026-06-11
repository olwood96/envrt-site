"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  pathIsConsentExempt,
  useConsent,
} from "@/components/v3/ConsentContext";

// Google Analytics 4 — gated by ConsentContext. Script tags only mount
// when the visitor has explicitly accepted. DPP destinations (collective
// product + widget pages) are exempt regardless of consent so customers
// who scanned a QR aren't tracked from the marketing site.

const GA_MEASUREMENT_ID = "G-NN09SER129";

export function GA4() {
  const { analyticsAllowed } = useConsent();
  const pathname = usePathname();

  if (!analyticsAllowed) return null;
  if (pathIsConsentExempt(pathname)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            anonymize_ip: true,
          });
        `}
      </Script>
    </>
  );
}

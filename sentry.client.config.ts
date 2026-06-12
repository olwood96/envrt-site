// Sentry browser config. Loads on every page in v3 + future cutover.
// We keep the SDK as light as possible: low trace sample rate, no
// session replay (replay drops cookies and we'd need consent), and
// no PII forwarding. Error capture is treated as legitimate interest
// for site reliability and runs without cookie consent.
//
// init() runs in requestIdleCallback (or a setTimeout fallback) so it
// never blocks first paint or hydration. Uncaught errors before init
// completes are queued by Sentry's global error handler shim and
// flushed once init resolves, so we lose nothing.

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

function initSentry() {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: 0.05,
    sendDefaultPii: false,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
}

if (dsn && typeof window !== "undefined") {
  type IdleCallback = (cb: () => void, opts?: { timeout: number }) => number;
  const ric = (window as unknown as { requestIdleCallback?: IdleCallback })
    .requestIdleCallback;
  if (typeof ric === "function") {
    ric(initSentry, { timeout: 2000 });
  } else {
    setTimeout(initSentry, 1500);
  }
}

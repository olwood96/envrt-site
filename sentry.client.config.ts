// Sentry browser config. Loads on every page in v3 + future cutover.
// We keep the SDK as light as possible: low trace sample rate, no
// session replay (replay drops cookies and we'd need consent), and
// no PII forwarding. Error capture is treated as legitimate interest
// for site reliability and runs without cookie consent.

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: 0.05,
    sendDefaultPii: false,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
}

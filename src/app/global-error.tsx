"use client";

// Next.js 14 global error boundary. Captures uncaught errors that
// blow past per-route error.tsx files (root layout failures, etc).
// Reports them to Sentry then renders a minimal fallback page.

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2rem", margin: 0 }}>
            Something went wrong.
          </h1>
          <p style={{ marginTop: "1rem", maxWidth: 480, color: "#444" }}>
            The team has been notified. Try refreshing in a moment, or head
            back to the homepage.
          </p>
          <a
            href="/"
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1.25rem",
              background: "#000",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "999px",
              fontWeight: 600,
            }}
          >
            Back to ENVRT
          </a>
        </main>
      </body>
    </html>
  );
}

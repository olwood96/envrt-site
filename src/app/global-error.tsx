"use client";

// Next.js 14 global error boundary. Captures uncaught errors that
// blow past per-route error.tsx files (root layout failures, etc).
// Reports them to Sentry then renders a v3-styled fallback page.
//
// Constraint: this file replaces the root layout when it fires, so
// it must render its own <html> + <body> and cannot rely on the
// brand fonts or chrome loaded by app/layout.tsx. Visuals are
// inlined with system fonts and tokenless hex so it always renders
// even if the root layout itself is what broke.

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#FCF9F0",
          color: "#1A1A1A",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <main
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "6rem 1.25rem",
            textAlign: "center",
          }}
        >
          {/* Construction marks */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: "1.5rem",
              left: "1.5rem",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(26,26,26,0.25)",
            }}
          >
            ENVRT/ERR
          </span>
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(181,0,3,0.55)",
            }}
          >
            500 · root
          </span>

          <p
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#B50003",
              margin: 0,
            }}
          >
            Critical error
          </p>

          <h1
            style={{
              marginTop: "1.25rem",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              maxWidth: "640px",
              margin: "1.25rem auto 0",
            }}
          >
            Something broke at the foundation.{" "}
            <span style={{ color: "rgba(26,26,26,0.45)" }}>
              We have been notified.
            </span>
          </h1>

          <p
            style={{
              marginTop: "1.5rem",
              maxWidth: "440px",
              fontSize: "1.0625rem",
              lineHeight: 1.6,
              color: "rgba(26,26,26,0.7)",
            }}
          >
            The platform hit an error before the page could load. Refresh, or
            head back to the homepage. The team has already been alerted.
          </p>

          <div
            style={{
              marginTop: "2.5rem",
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                appearance: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.75rem 1.5rem",
                background: "#3E00FF",
                color: "white",
                borderRadius: "0.75rem",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: "0 12px 28px -14px rgba(62,0,255,0.7)",
              }}
            >
              Try again ↻
            </button>
            <a
              href="/"
              style={{
                padding: "0.75rem 1.5rem",
                background: "transparent",
                color: "#1A1A1A",
                borderRadius: "0.75rem",
                fontSize: "1rem",
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid rgba(26,26,26,0.12)",
              }}
            >
              Back to ENVRT →
            </a>
          </div>

          {error.digest && (
            <p
              style={{
                marginTop: "2.5rem",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(26,26,26,0.4)",
              }}
            >
              Reference{" "}
              <span style={{ color: "rgba(26,26,26,0.65)" }}>
                {error.digest}
              </span>
            </p>
          )}
        </main>
      </body>
    </html>
  );
}

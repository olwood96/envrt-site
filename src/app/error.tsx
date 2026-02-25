"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-tight text-envrt-charcoal">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-envrt-muted">
          An unexpected error occurred. Please try again.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-full bg-envrt-green px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-envrt-green-light"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-envrt-charcoal/10 px-6 py-2.5 text-sm font-medium text-envrt-charcoal transition-colors hover:bg-envrt-cream"
          >
            Go home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-xs text-envrt-muted">
            Ref: <span className="font-mono">{error.digest}</span>
          </p>
        )}
      </div>
    </div>
  );
}

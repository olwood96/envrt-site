"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ButtonV3 } from "@/components/v3";
import { DotGridBackground } from "@/components/sections/v3/_shared";

// Per-route error boundary. Catches uncaught errors anywhere inside a
// route segment without unmounting the root layout (so chrome stays).
// Anything that escapes this lands in global-error.tsx.

export default function RouteError({
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
    <main className="relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-envrt-brand-vista px-5 py-24 sm:px-8">
      <DotGridBackground opacity={0.05} size={22} />

      {/* Construction marks */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute left-4 top-6 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:left-6 sm:top-8">
          ENVRT/ERR
        </span>
        <span className="absolute right-4 top-6 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-crimson/55 sm:right-6 sm:top-8">
          500
        </span>
        <span className="absolute bottom-4 left-4 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:bottom-6 sm:left-6">
          Loom · misthreaded
        </span>
        <span className="absolute bottom-4 right-4 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/25 sm:bottom-6 sm:right-6">
          Pattern N/A
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-crimson">
          Error · the loom slipped
        </p>

        <h1 className="mt-5 font-display text-[2.5rem] font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-5xl lg:text-[3.5rem]">
          Something broke in the pattern.{" "}
          <span className="text-envrt-brand-black/45">
            We have been notified.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg">
          The page hit an unexpected error. Try again, or head back to the
          homepage. If it keeps happening, our team will already be on it.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonV3 onClick={reset} variant="primary">
            Try again<span>↻</span>
          </ButtonV3>
          <ButtonV3 href="/" variant="ghost">
            Back to ENVRT<span>→</span>
          </ButtonV3>
        </div>

        {error.digest && (
          <p className="mt-10 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-envrt-brand-black/40 sm:text-[11px]">
            Reference{" "}
            <span className="text-envrt-brand-black/65">{error.digest}</span>
            {" · "}
            <Link
              href="/contact"
              className="text-envrt-brand-ultramarine underline underline-offset-[3px] decoration-envrt-brand-ultramarine/30 hover:decoration-envrt-brand-ultramarine"
            >
              Contact support
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}

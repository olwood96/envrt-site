"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { HiddenTurnstile } from "@/components/ui/TurnstileWidget";

type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  variant?: "compact" | "cta";
}

export function CollectiveSubscribeV3({ variant = "compact" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const searchParams = useSearchParams();

  const [banner, setBanner] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);

  useEffect(() => {
    if (searchParams.get("subscribed") === "true") {
      setBanner({
        type: "success",
        text: "You're subscribed. Weekly updates land in your inbox when new products are featured.",
      });
    } else if (searchParams.get("unsubscribed") === "true") {
      setBanner({
        type: "success",
        text: "You're unsubscribed. We will not send any more emails.",
      });
    } else if (searchParams.get("subscribe_error")) {
      setBanner({
        type: "error",
        text: "Something went wrong. The link may have expired or already been used.",
      });
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/collective/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), turnstileToken }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage(data.message ?? "Check your email to confirm your subscription.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (variant === "cta") {
    return (
      <div className="rounded-3xl border border-envrt-brand-black/10 bg-white p-8 sm:p-10 lg:p-12">
        {banner && <Banner banner={banner} />}
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-ultramarine sm:text-[11px]">
          Stay in the loop
        </p>
        <h3 className="mt-4 font-display text-2xl font-medium leading-[1.1] tracking-[-0.025em] text-envrt-brand-black sm:text-3xl">
          One short email when new products land.
        </h3>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg">
          Weekly email when brands publish new DPPs on the Collective. No spam,
          unsubscribe anytime.
        </p>
        <form onSubmit={handleSubmit} className="mt-7 max-w-xl">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              disabled={status === "submitting" || status === "success"}
              className="h-12 min-w-0 flex-1 rounded-full border border-envrt-brand-black/12 bg-envrt-brand-vista/40 px-5 text-sm text-envrt-brand-black placeholder:text-envrt-brand-black/45 focus:border-envrt-brand-ultramarine/40 focus:outline-none focus:ring-2 focus:ring-envrt-brand-ultramarine/15 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "submitting" || status === "success"}
              className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-envrt-brand-ultramarine px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:translate-y-[-1px] hover:shadow-[0_18px_30px_-18px_rgba(46,21,148,0.55)] disabled:opacity-60"
            >
              {status === "submitting" ? (
                <Spinner />
              ) : status === "success" ? (
                "Subscribed"
              ) : (
                <>
                  Subscribe<span aria-hidden>→</span>
                </>
              )}
            </button>
            <HiddenTurnstile onToken={setTurnstileToken} />
          </div>
        </form>
        {message && (
          <p
            className={`mt-4 text-sm ${
              status === "success"
                ? "text-envrt-brand-ultramarine"
                : "text-envrt-brand-crimson"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      {banner && <Banner banner={banner} />}
      <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            placeholder="Get weekly updates, enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            disabled={status === "submitting" || status === "success"}
            className="h-11 min-w-0 flex-1 rounded-full border border-envrt-brand-black/12 bg-white px-5 text-sm text-envrt-brand-black placeholder:text-envrt-brand-black/45 focus:border-envrt-brand-ultramarine/40 focus:outline-none focus:ring-2 focus:ring-envrt-brand-ultramarine/15 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "submitting" || status === "success"}
            className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-envrt-brand-ultramarine px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:translate-y-[-1px] hover:shadow-[0_18px_30px_-18px_rgba(46,21,148,0.55)] disabled:opacity-60"
          >
            {status === "submitting" ? (
              <Spinner />
            ) : status === "success" ? (
              "Check inbox"
            ) : (
              <>
                Subscribe<span aria-hidden>→</span>
              </>
            )}
          </button>
          <HiddenTurnstile onToken={setTurnstileToken} />
        </div>
      </form>
      {status === "error" && message && (
        <p className="mt-3 text-center text-sm text-envrt-brand-crimson">
          {message}
        </p>
      )}
    </div>
  );
}

function Banner({
  banner,
}: {
  banner: { type: "success" | "error"; text: string };
}) {
  return (
    <div
      className={`mb-6 rounded-2xl px-5 py-4 text-sm leading-relaxed ${
        banner.type === "success"
          ? "border border-envrt-brand-ultramarine/15 bg-envrt-brand-ultramarine/[0.04] text-envrt-brand-black/85"
          : "border border-envrt-brand-crimson/20 bg-envrt-brand-crimson/[0.04] text-envrt-brand-crimson"
      }`}
    >
      {banner.text}
    </div>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
    />
  );
}

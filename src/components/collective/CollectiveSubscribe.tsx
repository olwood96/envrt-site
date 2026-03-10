"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TurnstileWidget } from "@/components/ui/TurnstileWidget";

type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  variant?: "compact" | "cta";
}

export function CollectiveSubscribe({ variant = "compact" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const searchParams = useSearchParams();

  // Show toast banners from redirect query params
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (searchParams.get("subscribed") === "true") {
      setBanner({ type: "success", text: "You're subscribed! You'll receive weekly updates when new products are featured." });
    } else if (searchParams.get("unsubscribed") === "true") {
      setBanner({ type: "success", text: "You've been unsubscribed. You won't receive any more emails from us." });
    } else if (searchParams.get("subscribe_error")) {
      setBanner({ type: "error", text: "Something went wrong. The link may have expired or already been used." });
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
      <div className="mt-16 rounded-2xl border border-envrt-charcoal/5 bg-envrt-cream/40 px-6 py-10 text-center sm:px-12">
        {banner && (
          <div
            className={`mx-auto mb-6 max-w-lg rounded-xl px-4 py-3 text-sm ${
              banner.type === "success"
                ? "bg-envrt-green/10 text-envrt-green"
                : "bg-red-50 text-red-600"
            }`}
          >
            {banner.text}
          </div>
        )}
        <h3 className="text-xl font-semibold text-envrt-charcoal sm:text-2xl">
          Stay in the loop
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-envrt-muted">
          Get a weekly email when new products are featured on The Collective.
          No spam, unsubscribe anytime.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-md">
          <div className="flex gap-3 sm:flex-row">
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
              className="min-w-0 flex-1 rounded-xl border border-envrt-charcoal/10 bg-white px-4 py-2.5 text-sm text-envrt-charcoal placeholder:text-envrt-muted/50 focus:border-envrt-teal/30 focus:outline-none focus:ring-2 focus:ring-envrt-teal/10 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "submitting" || status === "success"}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-envrt-green px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-envrt-green/90 disabled:opacity-60"
            >
              {status === "submitting" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : status === "success" ? (
                "Subscribed!"
              ) : (
                "Subscribe"
              )}
            </button>
          </div>
          <TurnstileWidget onToken={setTurnstileToken} className="mt-3 flex justify-center" />
        </form>
        {message && (
          <p
            className={`mt-3 text-sm ${
              status === "success" ? "text-envrt-green" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    );
  }

  // Compact variant (inline, above the grid)
  return (
    <div>
      {banner && (
        <div
          className={`mx-auto mb-4 max-w-lg rounded-xl px-4 py-3 text-center text-sm ${
            banner.type === "success"
              ? "bg-envrt-green/10 text-envrt-green"
              : "bg-red-50 text-red-600"
          }`}
        >
          {banner.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mx-auto max-w-md">
        <div className="flex items-center gap-2">
          <input
            type="email"
            required
            placeholder="Get weekly updates — enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            disabled={status === "submitting" || status === "success"}
            className="min-w-0 flex-1 rounded-xl border border-envrt-charcoal/10 bg-white px-4 py-2 text-sm text-envrt-charcoal placeholder:text-envrt-muted/50 focus:border-envrt-teal/30 focus:outline-none focus:ring-2 focus:ring-envrt-teal/10 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "submitting" || status === "success"}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-envrt-green px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-envrt-green/90 disabled:opacity-60"
          >
            {status === "submitting" ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : status === "success" ? (
              "Check your inbox"
            ) : (
              "Subscribe"
            )}
          </button>
        </div>
        <TurnstileWidget onToken={setTurnstileToken} className="mt-2 flex justify-center" />
      </form>
      {status === "error" && message && (
        <p className="mt-2 text-center text-sm text-red-500">{message}</p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { HiddenTurnstile } from "@/components/ui/TurnstileWidget";

type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  variant?: "inline" | "card";
}

export function NewsletterSubscribe({ variant = "card" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
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
      setMessage(data.message ?? "You're subscribed.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (variant === "card") {
    return (
      <div className="mt-16 rounded-2xl border border-envrt-teal/10 bg-envrt-teal/5 p-6 text-center sm:p-8">
        <p className="text-lg font-semibold text-envrt-charcoal">
          Get new insights in your inbox
        </p>
        <p className="mt-2 text-sm text-envrt-muted">
          One email per month. No spam, unsubscribe anytime.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-5 max-w-md">
          <div className="flex items-center gap-3">
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
              className="min-w-0 flex-1 rounded-xl border border-envrt-charcoal/10 bg-white px-4 py-2.5 text-sm text-envrt-charcoal placeholder:text-envrt-muted focus:border-envrt-teal/30 focus:outline-none focus:ring-2 focus:ring-envrt-teal/10 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "submitting" || status === "success"}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-envrt-teal px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-envrt-teal/90 disabled:opacity-60"
            >
              {status === "submitting" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : status === "success" ? (
                "Subscribed"
              ) : (
                "Subscribe"
              )}
            </button>
            <HiddenTurnstile onToken={setTurnstileToken} />
          </div>
        </form>
        {message && (
          <p
            className={`mt-3 text-sm ${
              status === "success" ? "text-envrt-teal" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    );
  }

  // Inline variant (compact, for article footers)
  return (
    <div className="mt-8 border-t border-envrt-charcoal/5 pt-8">
      <p className="text-sm font-medium text-envrt-charcoal">
        Get new insights in your inbox
      </p>
      <p className="mt-1 text-xs text-envrt-muted">
        One email per month. No spam, unsubscribe anytime.
      </p>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="flex items-center gap-2">
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
            className="min-w-0 flex-1 rounded-xl border border-envrt-charcoal/10 bg-white px-4 py-2 text-sm text-envrt-charcoal placeholder:text-envrt-muted focus:border-envrt-teal/30 focus:outline-none focus:ring-2 focus:ring-envrt-teal/10 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "submitting" || status === "success"}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-envrt-teal px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-envrt-teal/90 disabled:opacity-60"
          >
            {status === "submitting" ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : status === "success" ? (
              "Subscribed"
            ) : (
              "Subscribe"
            )}
          </button>
          <HiddenTurnstile onToken={setTurnstileToken} />
        </div>
      </form>
      {message && (
        <p
          className={`mt-2 text-sm ${
            status === "success" ? "text-envrt-teal" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

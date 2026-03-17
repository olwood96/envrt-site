"use client";

import { useState, useRef, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";
import { HiddenTurnstile } from "@/components/ui/TurnstileWidget";

/* ── Custom Dropdown ──────────────────────────────────────────────────── */

interface DropdownOption {
  value: string;
  label: string;
  description: string;
}

const interestOptions: DropdownOption[] = [
  { value: "dpp-hub", label: "Your DPP Hub", description: "Regulation-ready passports" },
  { value: "impact-analyst", label: "Your Impact Analyst", description: "Lifecycle metrics and insights" },
  { value: "sustainability-team", label: "Your Sustainability Team", description: "Full sustainability operations" },
  { value: "not-sure", label: "Not sure yet", description: "I'd like to explore my options" },
];

function InterestDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = interestOptions.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-left text-sm outline-none transition-all ${
          open
            ? "border-envrt-teal/40 ring-1 ring-envrt-teal/20"
            : "border-envrt-charcoal/10 hover:border-envrt-charcoal/20"
        }`}
      >
        {selected ? (
          <span className="flex items-baseline gap-2">
            <span className="font-medium text-envrt-charcoal">{selected.label}</span>
            <span className="text-xs text-envrt-muted">{selected.description}</span>
          </span>
        ) : (
          <span className="text-envrt-muted">Select an option</span>
        )}
        <svg
          className={`h-4 w-4 flex-shrink-0 text-envrt-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Hidden native input for form submission */}
      <input type="hidden" name="interest" value={value} />

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1.5 overflow-hidden rounded-xl border border-envrt-charcoal/10 bg-white shadow-lg shadow-envrt-charcoal/8">
          {interestOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`flex w-full flex-col px-4 py-3 text-left transition-colors ${
                value === option.value
                  ? "bg-envrt-teal/[0.05]"
                  : "hover:bg-envrt-charcoal/[0.02]"
              }`}
            >
              <span className={`text-sm font-medium ${value === option.value ? "text-envrt-teal" : "text-envrt-charcoal"}`}>
                {option.label}
              </span>
              <span className="text-xs text-envrt-muted">{option.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [interest, setInterest] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.get("first-name") || "",
          lastName: formData.get("last-name") || "",
          email: formData.get("email") || "",
          company: formData.get("company") || "",
          interest: formData.get("interest") || "",
          message: formData.get("message") || "",
          "bot-field": formData.get("bot-field") || "",
          turnstileToken,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-16">
      <Container>
        <FadeUp>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-envrt-charcoal sm:text-5xl">
              Book a demo
            </h1>
            <p className="mt-4 text-base text-envrt-muted sm:text-lg">
              See how ENVRT can help your brand create compliant Digital Product
              Passports and communicate your sustainability story.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <SectionCard className="mx-auto mt-12 max-w-xl">
            <div className="p-8 sm:p-10">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-envrt-teal/10">
                    <svg className="h-8 w-8 text-envrt-teal" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-envrt-charcoal">
                    Thank you!
                  </h3>
                  <p className="mt-2 text-sm text-envrt-muted">
                    We&apos;ll be in touch shortly to schedule your demo.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="hidden">
                    <label>
                      Don&apos;t fill this out: <input name="bot-field" />
                    </label>
                  </p>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-envrt-charcoal">
                        First name
                      </label>
                      <input
                        type="text"
                        name="first-name"
                        required
                        className="w-full rounded-xl border border-envrt-charcoal/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-envrt-teal/40 focus:ring-1 focus:ring-envrt-teal/20"
                        placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-envrt-charcoal">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="last-name"
                        required
                        className="w-full rounded-xl border border-envrt-charcoal/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-envrt-teal/40 focus:ring-1 focus:ring-envrt-teal/20"
                        placeholder="Smith"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-envrt-charcoal">
                      Work email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full rounded-xl border border-envrt-charcoal/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-envrt-teal/40 focus:ring-1 focus:ring-envrt-teal/20"
                      placeholder="jane@yourbrand.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-envrt-charcoal">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      className="w-full rounded-xl border border-envrt-charcoal/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-envrt-teal/40 focus:ring-1 focus:ring-envrt-teal/20"
                      placeholder="Your brand name"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-envrt-charcoal">
                      What are you looking for?
                    </label>
                    <InterestDropdown value={interest} onChange={setInterest} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-envrt-charcoal">
                      Message{" "}
                      <span className="text-envrt-muted font-normal">(optional)</span>
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      className="w-full rounded-xl border border-envrt-charcoal/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-envrt-teal/40 focus:ring-1 focus:ring-envrt-teal/20 resize-none"
                      placeholder="Tell us about your sustainability goals..."
                    />
                  </div>

                  <HiddenTurnstile onToken={setTurnstileToken} className="justify-center" />

                  {error && (
                    <p className="text-center text-sm text-red-600">
                      Something went wrong. Please try again or email us directly at hello@envrt.com.
                    </p>
                  )}

                  <Button
                    type="submit"
                    data-cta="contact-form-submit"
                    className={`w-full ${submitting ? "pointer-events-none opacity-60" : ""}`}
                    size="lg"
                  >
                    {submitting ? "Sending..." : "Book a demo"}
                    {!submitting && <span className="ml-2">→</span>}
                  </Button>
                  <p className="text-center text-xs text-envrt-muted">
                    No commitment. We&apos;ll walk you through the platform with your data.
                  </p>
                </form>
              )}
            </div>
          </SectionCard>
        </FadeUp>
      </Container>
    </div>
  );
}

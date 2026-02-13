"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionCard } from "@/components/ui/SectionCard";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/Motion";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-envrt-charcoal">
                        First name
                      </label>
                      <input
                        type="text"
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
                      required
                      className="w-full rounded-xl border border-envrt-charcoal/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-envrt-teal/40 focus:ring-1 focus:ring-envrt-teal/20"
                      placeholder="Your brand name"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-envrt-charcoal">
                      Message{" "}
                      <span className="text-envrt-muted font-normal">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      className="w-full rounded-xl border border-envrt-charcoal/10 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-envrt-teal/40 focus:ring-1 focus:ring-envrt-teal/20 resize-none"
                      placeholder="Tell us about your sustainability goals..."
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Request a demo
                    <span className="ml-2">→</span>
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

import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Payment Confirmed — ENVRT",
  description: "Your ENVRT subscription is now active.",
  robots: { index: false },
};

export default function PaymentSuccessPage() {
  return (
    <div className="pt-28 pb-16">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-envrt-teal/10">
            <svg
              className="h-8 w-8 text-envrt-teal"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
            Payment confirmed
          </h1>

          <p className="mt-4 text-base text-envrt-muted sm:text-lg">
            Your ENVRT subscription is now active. Check your email for a link
            to set up your dashboard account.
          </p>

          <div className="mt-8 rounded-2xl border border-envrt-charcoal/5 bg-white p-6 text-left">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-envrt-teal">
              What happens next
            </h2>
            <ol className="mt-4 space-y-3 text-sm text-envrt-charcoal/80">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-envrt-teal/10 text-xs font-bold text-envrt-teal">
                  1
                </span>
                <span>
                  <strong className="text-envrt-charcoal">Check your email</strong> — we&apos;ve
                  sent you a link to set up your dashboard account.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-envrt-teal/10 text-xs font-bold text-envrt-teal">
                  2
                </span>
                <span>
                  <strong className="text-envrt-charcoal">Set your password</strong> — create
                  your login credentials for the ENVRT dashboard.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-envrt-teal/10 text-xs font-bold text-envrt-teal">
                  3
                </span>
                <span>
                  <strong className="text-envrt-charcoal">Set up your brand</strong> — enter
                  your brand details and first collection name.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-envrt-teal/10 text-xs font-bold text-envrt-teal">
                  4
                </span>
                <span>
                  <strong className="text-envrt-charcoal">ENVRT reviews &amp; activates</strong> — our
                  team will review your details and set up your workspace.
                </span>
              </li>
            </ol>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href="/" variant="secondary">
              Back to home
            </Button>
            <Button href="/contact" variant="ghost">
              Need help? Contact us
            </Button>
          </div>

          <p className="mt-6 text-xs text-envrt-muted">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <a href="/contact" className="text-envrt-teal hover:underline">
              contact us
            </a>
            .
          </p>
        </div>
      </Container>
    </div>
  );
}

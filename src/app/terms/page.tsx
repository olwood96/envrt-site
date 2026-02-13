import { Container } from "@/components/ui/Container";

export default function TermsPage() {
  return (
    <div className="pt-28 pb-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-envrt-charcoal">
            Terms of service
          </h1>
          <p className="mt-4 text-sm text-envrt-muted">Last updated: February 2026</p>
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-envrt-charcoal/70">
            <p>
              These terms of service (&quot;Terms&quot;) govern your use of the ENVRT platform and
              services.
            </p>
            <p>
              This is a placeholder page. Replace this content with your full terms of
              service before launching.
            </p>
            <h2 className="text-lg font-semibold text-envrt-charcoal">
              Use of services
            </h2>
            <p>
              ENVRT provides sustainability analytics and Digital Product Passport
              creation tools for fashion brands. By using our services, you agree to
              these terms.
            </p>
            <h2 className="text-lg font-semibold text-envrt-charcoal">Contact</h2>
            <p>
              If you have questions about these terms, please contact us at
              hello@envrt.com.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

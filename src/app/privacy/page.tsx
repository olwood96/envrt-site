import { Container } from "@/components/ui/Container";

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-envrt-charcoal">
            Privacy policy
          </h1>
          <p className="mt-4 text-sm text-envrt-muted">Last updated: February 2026</p>
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-envrt-charcoal/70">
            <p>
              This privacy policy describes how ENVRT (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) collects,
              uses, and shares information in connection with your use of our website and
              services.
            </p>
            <p>
              This is a placeholder page. Replace this content with your full privacy
              policy before launching.
            </p>
            <h2 className="text-lg font-semibold text-envrt-charcoal">
              Information we collect
            </h2>
            <p>
              We collect information you provide directly, such as your name, email
              address, and company when you fill out forms on our site.
            </p>
            <h2 className="text-lg font-semibold text-envrt-charcoal">Contact</h2>
            <p>
              If you have questions about this policy, please contact us at
              hello@envrt.com.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

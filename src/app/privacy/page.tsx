import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Privacy Policy | ENVRT",
  description:
    "How ENVRT collects, uses, and protects personal data across our sustainability data platform.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-envrt-charcoal">
            Privacy policy
          </h1>
          <p className="mt-4 text-sm text-envrt-muted">
            Last updated: February 2026
          </p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-envrt-charcoal/70">
            {/* ── 1. Who we are ── */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-envrt-charcoal">
                1. Who we are
              </h2>
              <p>
                ENVRT (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) provides a
                sustainability data platform for fashion brands. Our services include
                Digital Product Passports (DPPs), modelled lifecycle metrics,
                traceability visualisations, brand dashboards, collection forms, and
                evidence uploads.
              </p>
              <p>
                This policy explains how we collect, use, and protect personal data
                across our websites and services:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>envrt.com</strong> &mdash; marketing site
                </li>
                <li>
                  <strong>dashboard.envrt.com</strong> &mdash; brand and supplier
                  dashboard
                </li>
                <li>
                  <strong>dpp.envrt.com</strong> &mdash; public Digital Product Passport
                  pages
                </li>
                <li>
                  <strong>reports.envrt.com</strong> &mdash; report viewing pages
                </li>
              </ul>
              <p>
                If you have questions about this policy, see Section&nbsp;13 for
                contact details.
              </p>
            </section>

            {/* ── 2. Data we collect ── */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-envrt-charcoal">
                2. Data we collect
              </h2>
              <p>
                We collect different data depending on how you interact with our
                services.
              </p>

              <h3 className="text-base font-semibold text-envrt-charcoal">
                Website visitors (envrt.com)
              </h3>
              <ul className="list-disc space-y-1 pl-5">
                <li>Browser type, operating system, screen resolution</li>
                <li>
                  Pages visited, referring URL, approximate location (country/region
                  level)
                </li>
                <li>
                  IP address (which may be truncated or anonymised depending on
                  analytics configuration)
                </li>
                <li>
                  Information you submit through contact or signup forms (name, email,
                  company)
                </li>
              </ul>

              <h3 className="text-base font-semibold text-envrt-charcoal">
                Dashboard users (dashboard.envrt.com)
              </h3>
              <ul className="list-disc space-y-1 pl-5">
                <li>Account details: name, email address, company name, role</li>
                <li>
                  Authentication data (managed through our authentication provider)
                </li>
                <li>
                  Data you enter or upload: product information, supply chain data,
                  documents, PDFs, images
                </li>
                <li>
                  Activity within the dashboard such as logins, form submissions, and
                  file uploads
                </li>
              </ul>

              <h3 className="text-base font-semibold text-envrt-charcoal">
                DPP visitors (dpp.envrt.com)
              </h3>
              <p>
                DPP pages are public by design. See Section&nbsp;11 for more on public
                and private information. We may log basic access data such as page
                views, browser type, and approximate location at an aggregate level. We
                aim to minimise the collection of personal data from DPP visitors.
              </p>

              <h3 className="text-base font-semibold text-envrt-charcoal">
                Report viewers (reports.envrt.com)
              </h3>
              <p>
                If you access a report via a shared link, we may log basic access
                information such as browser type, timestamp, and referring URL. If you
                are a logged-in user, your access may be associated with your account.
              </p>
            </section>

            {/* ── 3. How we use data ── */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-envrt-charcoal">
                3. How we use data
              </h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>Providing our services</strong> &mdash; operating the
                  platform, processing uploads, generating DPPs, and producing modelled
                  metrics
                </li>
                <li>
                  <strong>Account management and support</strong> &mdash; managing your
                  account, responding to queries, and resolving issues
                </li>
                <li>
                  <strong>Security</strong> &mdash; detecting and preventing
                  unauthorised access, fraud, or abuse
                </li>
                <li>
                  <strong>Product improvement</strong> &mdash; understanding how the
                  platform is used so we can improve features, performance, and
                  reliability
                </li>
                <li>
                  <strong>Analytics</strong> &mdash; measuring traffic, usage patterns,
                  and engagement in aggregate
                </li>
                <li>
                  <strong>Communications</strong> &mdash; sending service-related
                  messages such as account notifications, updates, or responses to
                  enquiries. We will only send marketing communications where we have
                  appropriate consent or a lawful basis to do so
                </li>
              </ul>
            </section>

            {/* ── 4. Legal bases ── */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-envrt-charcoal">
                4. Legal bases for processing
              </h2>
              <p>
                We process personal data under the UK GDPR and EU GDPR. The legal bases
                we rely on include:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>Contract</strong> &mdash; processing that is necessary to
                  provide our services to you or to take steps at your request before
                  entering a contract. This applies to dashboard users with an active
                  account or subscription.
                </li>
                <li>
                  <strong>Legitimate interests</strong> &mdash; processing that is
                  necessary for our reasonable business interests, provided those
                  interests are not overridden by your rights. This includes security
                  monitoring, fraud prevention, product improvement, and analytics.
                </li>
                <li>
                  <strong>Consent</strong> &mdash; where you have given clear consent
                  for a specific purpose, such as receiving marketing emails or
                  accepting optional analytics cookies. You can withdraw consent at any
                  time.
                </li>
                <li>
                  <strong>Legal obligation</strong> &mdash; processing that is necessary
                  to comply with a legal or regulatory requirement.
                </li>
              </ul>
            </section>

            {/* ── 5. Sharing and subprocessors ── */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-envrt-charcoal">
                5. Sharing and subprocessors
              </h2>
              <p>We do not sell personal data.</p>
              <p>
                We share personal data only where necessary to operate our services. We
                use third-party service providers (&quot;subprocessors&quot;) in the
                following categories:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>Hosting and infrastructure</strong> &mdash; cloud hosting
                  providers that store and serve our platform and data
                </li>
                <li>
                  <strong>Database, authentication, and storage</strong> &mdash;
                  services that manage user accounts, authentication, and file storage
                </li>
                <li>
                  <strong>Analytics</strong> &mdash; tools that help us understand
                  website and platform usage in aggregate
                </li>
                <li>
                  <strong>Email and communications</strong> &mdash; services that
                  deliver transactional and service-related emails
                </li>
              </ul>
              <p>
                All subprocessors are bound by data processing agreements. We review
                these arrangements periodically.
              </p>
              <p>
                We may also share data where required by law, regulation, or legal
                process.
              </p>
              <p className="italic">
                A list of current subprocessors is available on request. Contact us
                using the details in Section&nbsp;13.
              </p>
            </section>

            {/* ── 6. International transfers ── */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-envrt-charcoal">
                6. International transfers
              </h2>
              <p>
                Our services are primarily hosted in the UK and EEA. However, some
                subprocessors may process data outside the UK or EEA.
              </p>
              <p>
                Where personal data is transferred internationally, we use appropriate
                safeguards such as Standard Contractual Clauses (SCCs) or the UK
                International Data Transfer Agreement (IDTA) to help protect your data.
              </p>
            </section>

            {/* ── 7. Retention ── */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-envrt-charcoal">
                7. Data retention
              </h2>
              <p>
                We retain personal data for as long as necessary to fulfil the purposes
                described in this policy and to meet our contractual obligations. As a
                general guide:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>Account data</strong> &mdash; retained for the duration of
                  your account, plus a reasonable period after closure (typically up to
                  12&nbsp;months) to handle any follow-up queries or obligations
                </li>
                <li>
                  <strong>Access logs and analytics data</strong> &mdash; typically
                  retained for up to 24&nbsp;months, then deleted or anonymised
                </li>
                <li>
                  <strong>Uploaded content</strong> (documents, images, product data)
                  &mdash; retained for the duration of the relevant brand&apos;s
                  subscription. After termination, we retain data for a limited period
                  to allow for data export, then delete it in accordance with our
                  agreements
                </li>
                <li>
                  <strong>Marketing consent records</strong> &mdash; retained for as
                  long as needed to demonstrate lawful consent
                </li>
              </ul>
              <p>
                We may retain certain data longer where required by law or to resolve
                disputes.
              </p>
            </section>

            {/* ── 8. Security ── */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-envrt-charcoal">
                8. Security
              </h2>
              <p>
                We take reasonable steps to protect personal data from unauthorised
                access, loss, and misuse. Our measures include:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Encryption in transit using TLS</li>
                <li>Access controls on all platform services</li>
                <li>
                  Role-based access within the dashboard, so users only see data
                  relevant to their role
                </li>
                <li>Regular review of access permissions</li>
                <li>Secure storage of uploaded files with restricted access</li>
              </ul>
              <p>
                No system is completely secure. We cannot guarantee the absolute
                security of your data, but we are committed to maintaining and improving
                our protections over time.
              </p>
            </section>

            {/* ── 9. Cookies and tracking ── */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-envrt-charcoal">
                9. Cookies and tracking
              </h2>

              <h3 className="text-base font-semibold text-envrt-charcoal">
                Essential cookies
              </h3>
              <p>
                We use essential cookies to keep the platform functioning. These handle
                things like session management and authentication. They cannot be
                disabled without breaking core functionality.
              </p>

              <h3 className="text-base font-semibold text-envrt-charcoal">
                Analytics cookies
              </h3>
              <p>
                We may use analytics cookies or similar technologies on our marketing
                site and dashboard to understand usage patterns. Where analytics cookies
                are optional, we will ask for your consent before setting them.
              </p>

              <h3 className="text-base font-semibold text-envrt-charcoal">
                Managing cookies
              </h3>
              <p>
                {/* If you have a cookie settings panel, replace the next sentence with a link to it. */}
                You can control cookies through your browser settings. Disabling certain
                cookies may affect your experience on the platform.
              </p>
            </section>

            {/* ── 10. Your rights ── */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-envrt-charcoal">
                10. Your rights
              </h2>
              <p>
                Under the UK GDPR and EU GDPR, you have the following rights in
                relation to your personal data:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>Access</strong> &mdash; request a copy of the personal data we
                  hold about you
                </li>
                <li>
                  <strong>Correction</strong> &mdash; ask us to correct inaccurate or
                  incomplete data
                </li>
                <li>
                  <strong>Deletion</strong> &mdash; ask us to delete your data, subject
                  to any legal or contractual retention requirements
                </li>
                <li>
                  <strong>Objection</strong> &mdash; object to processing based on
                  legitimate interests
                </li>
                <li>
                  <strong>Restriction</strong> &mdash; ask us to restrict processing in
                  certain circumstances
                </li>
                <li>
                  <strong>Portability</strong> &mdash; request your data in a
                  structured, machine-readable format
                </li>
                <li>
                  <strong>Withdraw consent</strong> &mdash; where processing is based on
                  consent, you can withdraw it at any time without affecting the
                  lawfulness of prior processing
                </li>
              </ul>
              <p>
                To exercise any of these rights, contact us using the details in
                Section&nbsp;13. We will respond within one month, or let you know if we
                need more time.
              </p>
              <p>
                If you are unsatisfied with how we handle your request, you have the
                right to lodge a complaint with a supervisory authority. In the UK, this
                is the Information Commissioner&apos;s Office (ICO) at{" "}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-envrt-charcoal"
                >
                  ico.org.uk
                </a>
                .
              </p>
            </section>

            {/* ── 11. Public vs private information ── */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-envrt-charcoal">
                11. Public and private information
              </h2>

              <h3 className="text-base font-semibold text-envrt-charcoal">
                Public: Digital Product Passports
              </h3>
              <p>
                DPP pages on dpp.envrt.com are public by design. The content displayed
                on a DPP page is controlled by the brand that created it. This may
                include product details, material information, traceability data, and
                modelled environmental metrics.
              </p>
              <p>
                Brands are responsible for deciding what information appears on their
                public DPP pages.
              </p>

              <h3 className="text-base font-semibold text-envrt-charcoal">
                Private: Evidence uploads and internal data
              </h3>
              <p>
                Evidence uploads (documents, PDFs, images) and internal supplier data
                submitted through the dashboard are private by default. Access is
                restricted by role-based controls.
              </p>
              <p>
                This data is not made public unless a brand explicitly chooses to
                publish or share it.
              </p>
            </section>

            {/* ── 12. Automated processing ── */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-envrt-charcoal">
                12. Automated processing
              </h2>
              <p>
                We use automated systems to generate modelled estimates and insights
                from data submitted by brands and their supply chains. This includes
                modelled lifecycle metrics such as CO2e and water scarcity estimates.
              </p>
              <p>
                These outputs are intended as decision-support tools. They are based on
                models, assumptions, and the data available at the time of calculation.
                They should not be treated as verified measurements.
              </p>
              <p>
                Brands are responsible for any public claims, disclosures, or decisions
                they make based on outputs from the platform.
              </p>
            </section>

            {/* ── 13. Contact ── */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-envrt-charcoal">
                13. Contact
              </h2>
              <p>
                If you have questions about this policy or want to exercise your data
                rights, contact us at:
              </p>
              <p>
                <a
                  href="mailto:privacy@envrt.com"
                  className="underline hover:text-envrt-charcoal"
                >
                  privacy@envrt.com
                </a>
              </p>
              {/* Replace with your registered company address */}
              <p>
                ENVRT Ltd
                <br />
                {/* [Street address] */}
                <br />
                {/* [City, Postcode] */}
                <br />
                United Kingdom
              </p>
            </section>

            {/* ── 14. Changes to this policy ── */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-envrt-charcoal">
                14. Changes to this policy
              </h2>
              <p>
                We may update this policy from time to time to reflect changes in our
                services, legal requirements, or how we handle personal data.
              </p>
              <p>
                Where changes are significant, we will notify dashboard users by email
                or through the platform. We encourage you to review this page
                periodically.
              </p>
              <p>
                The &quot;Last updated&quot; date at the top of this page shows when the
                most recent changes were made.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}

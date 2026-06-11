import type { Metadata } from "next";
import {
  LegalShell,
  LegalP,
  LegalH3,
  LegalUl,
  LegalLi,
  LegalStrong,
  LegalLink,
  type LegalSection,
} from "@/components/v3/LegalShell";

export const metadata: Metadata = {
  title: "Privacy policy | ENVRT",
  description:
    "How ENVRT collects, uses and protects personal data. UK GDPR aligned. Plain English explanation of what we store and why.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS: LegalSection[] = [
  {
    index: "01",
    title: "Who we are",
    body: (
      <>
        <LegalP>
          ENVRT (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) provides a
          sustainability data platform for fashion brands. Our services
          include Digital Product Passports (DPPs), modelled lifecycle
          metrics, transparency visualisations, brand dashboards, collection
          forms and evidence uploads.
        </LegalP>
        <LegalP>
          This policy explains how we collect, use and protect personal data
          across our websites and services:
        </LegalP>
        <LegalUl>
          <LegalLi>
            <LegalStrong>envrt.com</LegalStrong>, marketing site
          </LegalLi>
          <LegalLi>
            <LegalStrong>dashboard.envrt.com</LegalStrong>, brand and supplier
            dashboard
          </LegalLi>
          <LegalLi>
            <LegalStrong>dpp.envrt.com</LegalStrong>, public Digital Product
            Passport pages
          </LegalLi>
          <LegalLi>
            <LegalStrong>reports.envrt.com</LegalStrong>, report viewing pages
          </LegalLi>
        </LegalUl>
        <LegalP>
          If you have questions about this policy, see section 13 for contact
          details.
        </LegalP>
      </>
    ),
  },
  {
    index: "02",
    title: "Data we collect",
    body: (
      <>
        <LegalP>
          We collect different data depending on how you interact with our
          services.
        </LegalP>

        <LegalH3>Website visitors (envrt.com)</LegalH3>
        <LegalP>
          We collect anonymous analytics using a lightweight first-party
          beacon. This includes:
        </LegalP>
        <LegalUl>
          <LegalLi>Page path, referrer URL and UTM parameters</LegalLi>
          <LegalLi>Device type, screen resolution and browser language</LegalLi>
          <LegalLi>
            Approximate location (country, region and city) derived from
            server-side request headers provided by our hosting infrastructure,
            not from GPS, IP geolocation databases or device-level location
            services
          </LegalLi>
          <LegalLi>Scroll depth and time on page</LegalLi>
          <LegalLi>
            Session grouping via a sessionStorage identifier that is
            automatically cleared when the browser tab is closed
          </LegalLi>
          <LegalLi>
            Information you submit through contact or signup forms (name,
            email, company)
          </LegalLi>
        </LegalUl>
        <LegalP>
          We do not store IP addresses, use cookies, use localStorage
          fingerprinting, or perform any cross-site tracking on the marketing
          site.
        </LegalP>

        <LegalH3>Dashboard users (dashboard.envrt.com)</LegalH3>
        <LegalUl>
          <LegalLi>Account details: name, email address, company name, role</LegalLi>
          <LegalLi>
            Authentication data (managed through our authentication provider)
          </LegalLi>
          <LegalLi>
            Data you enter or upload: product information, supply chain data,
            documents, PDFs, images
          </LegalLi>
          <LegalLi>
            Usage analytics associated with your account: page path, page
            title, session identifier (sessionStorage, cleared on tab close),
            time on page, scroll depth, device type, screen resolution, browser
            language, approximate location (from server-side request headers),
            and navigation flow
          </LegalLi>
        </LegalUl>
        <LegalP>
          Dashboard analytics do not use cookies or localStorage for tracking
          purposes. No IP addresses are stored.
        </LegalP>

        <LegalH3>DPP visitors (dpp.envrt.com)</LegalH3>
        <LegalP>
          DPP pages are public by design. See section 11 for more on public and
          private information. We collect anonymous view data including page
          path, referrer URL, UTM parameters, device type, screen resolution,
          browser language, and approximate location (country, region, and
          city from server-side request headers). We do not store IP addresses,
          use cookies, use localStorage fingerprinting, or perform any
          cross-site tracking on DPP pages.
        </LegalP>

        <LegalH3>Report viewers (reports.envrt.com)</LegalH3>
        <LegalP>
          If you access a report via a shared link, we may log basic access
          information such as browser type, timestamp and referring URL. If
          you are a logged-in user, your access may be associated with your
          account.
        </LegalP>
      </>
    ),
  },
  {
    index: "03",
    title: "How we use data",
    body: (
      <LegalUl>
        <LegalLi>
          <LegalStrong>Providing our services</LegalStrong>, operating the
          platform, processing uploads, generating DPPs, and producing modelled
          metrics
        </LegalLi>
        <LegalLi>
          <LegalStrong>Account management and support</LegalStrong>, managing
          your account, responding to queries, and resolving issues
        </LegalLi>
        <LegalLi>
          <LegalStrong>Security</LegalStrong>, detecting and preventing
          unauthorised access, fraud, or abuse
        </LegalLi>
        <LegalLi>
          <LegalStrong>Product improvement</LegalStrong>, understanding how the
          platform is used so we can improve features, performance, and
          reliability
        </LegalLi>
        <LegalLi>
          <LegalStrong>Analytics</LegalStrong>, measuring traffic, usage
          patterns, and engagement in aggregate
        </LegalLi>
        <LegalLi>
          <LegalStrong>Communications</LegalStrong>, sending service-related
          messages such as account notifications, updates, or responses to
          enquiries. We will only send marketing communications where we have
          appropriate consent or a lawful basis to do so
        </LegalLi>
      </LegalUl>
    ),
  },
  {
    index: "04",
    title: "Legal bases for processing",
    body: (
      <>
        <LegalP>
          We process personal data under the UK GDPR and EU GDPR. The legal
          bases we rely on include:
        </LegalP>
        <LegalUl>
          <LegalLi>
            <LegalStrong>Contract</LegalStrong>, processing that is necessary
            to provide our services to you or to take steps at your request
            before entering a contract. This applies to dashboard users with an
            active account or subscription.
          </LegalLi>
          <LegalLi>
            <LegalStrong>Legitimate interests</LegalStrong>, processing that is
            necessary for our reasonable business interests, provided those
            interests are not overridden by your rights. This includes security
            monitoring, fraud prevention, product improvement, and analytics.
          </LegalLi>
          <LegalLi>
            <LegalStrong>Consent</LegalStrong>, where you have given clear
            consent for a specific purpose, such as receiving marketing emails
            or accepting optional analytics cookies. You can withdraw consent at
            any time.
          </LegalLi>
          <LegalLi>
            <LegalStrong>Legal obligation</LegalStrong>, processing that is
            necessary to comply with a legal or regulatory requirement.
          </LegalLi>
        </LegalUl>
      </>
    ),
  },
  {
    index: "05",
    title: "Sharing and subprocessors",
    body: (
      <>
        <LegalP>We do not sell personal data.</LegalP>
        <LegalP>
          We share personal data only where necessary to operate our services.
          We use third-party service providers (&quot;subprocessors&quot;) in
          the following categories:
        </LegalP>
        <LegalUl>
          <LegalLi>
            <LegalStrong>Hosting and infrastructure</LegalStrong>, cloud
            hosting providers that store and serve our platform and data
          </LegalLi>
          <LegalLi>
            <LegalStrong>Database, authentication and storage</LegalStrong>,
            services that manage user accounts, authentication and file
            storage
          </LegalLi>
          <LegalLi>
            <LegalStrong>Analytics</LegalStrong>, tools that help us understand
            website and platform usage in aggregate
          </LegalLi>
          <LegalLi>
            <LegalStrong>Email and communications</LegalStrong>, services that
            deliver transactional and service-related emails
          </LegalLi>
        </LegalUl>
        <LegalP>
          All subprocessors are bound by data processing agreements. We review
          these arrangements periodically.
        </LegalP>
        <LegalP>
          We may also share data where required by law, regulation, or legal
          process.
        </LegalP>
        <LegalP>
          A list of current subprocessors is available on request. Contact us
          using the details in section 13.
        </LegalP>
      </>
    ),
  },
  {
    index: "06",
    title: "International transfers",
    body: (
      <>
        <LegalP>
          Our services are primarily hosted in the UK and EEA. However, some
          subprocessors may process data outside the UK or EEA.
        </LegalP>
        <LegalP>
          Where personal data is transferred internationally, we use
          appropriate safeguards such as Standard Contractual Clauses (SCCs) or
          the UK International Data Transfer Agreement (IDTA) to help protect
          your data.
        </LegalP>
      </>
    ),
  },
  {
    index: "07",
    title: "Data retention",
    body: (
      <>
        <LegalP>
          We retain personal data for as long as necessary to fulfil the
          purposes described in this policy and to meet our contractual
          obligations. As a general guide:
        </LegalP>
        <LegalUl>
          <LegalLi>
            <LegalStrong>Account data</LegalStrong>, retained for the duration
            of your account, plus a reasonable period after closure (typically
            up to 12 months) to handle any follow-up queries or obligations
          </LegalLi>
          <LegalLi>
            <LegalStrong>Access logs and analytics data</LegalStrong>,
            typically retained for up to 24 months, then deleted or anonymised
          </LegalLi>
          <LegalLi>
            <LegalStrong>Uploaded content</LegalStrong> (documents, images,
            product data), retained for the duration of the relevant
            brand&apos;s subscription. After termination, we retain data for a
            limited period to allow for data export, then delete it in
            accordance with our agreements
          </LegalLi>
          <LegalLi>
            <LegalStrong>Marketing consent records</LegalStrong>, retained for
            as long as needed to demonstrate lawful consent
          </LegalLi>
        </LegalUl>
        <LegalP>
          We may retain certain data longer where required by law or to resolve
          disputes.
        </LegalP>
      </>
    ),
  },
  {
    index: "08",
    title: "Security",
    body: (
      <>
        <LegalP>
          We take reasonable steps to protect personal data from unauthorised
          access, loss and misuse. Our measures include:
        </LegalP>
        <LegalUl>
          <LegalLi>Encryption in transit using TLS</LegalLi>
          <LegalLi>Access controls on all platform services</LegalLi>
          <LegalLi>
            Role-based access within the dashboard, so users only see data
            relevant to their role
          </LegalLi>
          <LegalLi>Regular review of access permissions</LegalLi>
          <LegalLi>Secure storage of uploaded files with restricted access</LegalLi>
        </LegalUl>
        <LegalP>
          No system is completely secure. We cannot guarantee the absolute
          security of your data, but we are committed to maintaining and
          improving our protections over time.
        </LegalP>
      </>
    ),
  },
  {
    index: "09",
    title: "Cookies and tracking",
    body: (
      <>
        <LegalH3>Essential cookies</LegalH3>
        <LegalP>
          We use essential cookies only where required to keep the platform
          functioning, such as session management and authentication on the
          dashboard. These cannot be disabled without breaking core
          functionality.
        </LegalP>

        <LegalH3>Analytics</LegalH3>
        <LegalP>
          We do not use analytics cookies anywhere on the platform. Our
          analytics are entirely cookie-free and do not use localStorage or any
          form of browser fingerprinting. Where session grouping is needed, we
          use a sessionStorage identifier that is automatically cleared when
          the browser tab is closed and cannot be used to track users across
          sessions or sites.
        </LegalP>

        <LegalH3>Third-party tracking</LegalH3>
        <LegalP>
          We do not use third-party tracking scripts, advertising pixels,
          retargeting tools, or any form of cross-site tracking. We do not
          share analytics data with third parties. All analytics are
          first-party and collected solely for platform improvement.
        </LegalP>

        <LegalH3>Geographic data</LegalH3>
        <LegalP>
          Approximate geographic location (country, region and city) is
          derived from server-side request headers provided by our hosting
          infrastructure. This is not based on GPS, IP geolocation databases
          or device-level location services. No IP addresses are stored in our
          analytics data.
        </LegalP>
      </>
    ),
  },
  {
    index: "10",
    title: "Your rights",
    body: (
      <>
        <LegalP>
          Under the UK GDPR and EU GDPR, you have the following rights in
          relation to your personal data:
        </LegalP>
        <LegalUl>
          <LegalLi>
            <LegalStrong>Access</LegalStrong>, request a copy of the personal
            data we hold about you
          </LegalLi>
          <LegalLi>
            <LegalStrong>Correction</LegalStrong>, ask us to correct inaccurate
            or incomplete data
          </LegalLi>
          <LegalLi>
            <LegalStrong>Deletion</LegalStrong>, ask us to delete your data,
            subject to any legal or contractual retention requirements
          </LegalLi>
          <LegalLi>
            <LegalStrong>Objection</LegalStrong>, object to processing based on
            legitimate interests
          </LegalLi>
          <LegalLi>
            <LegalStrong>Restriction</LegalStrong>, ask us to restrict
            processing in certain circumstances
          </LegalLi>
          <LegalLi>
            <LegalStrong>Portability</LegalStrong>, request your data in a
            structured, machine-readable format
          </LegalLi>
          <LegalLi>
            <LegalStrong>Withdraw consent</LegalStrong>, where processing is
            based on consent, you can withdraw it at any time without affecting
            the lawfulness of prior processing
          </LegalLi>
        </LegalUl>
        <LegalP>
          To exercise any of these rights, contact us using the details in
          section 13. We will respond within one month, or let you know if we
          need more time.
        </LegalP>
        <LegalP>
          If you are unsatisfied with how we handle your request, you have the
          right to lodge a complaint with a supervisory authority. In the UK,
          this is the Information Commissioner&apos;s Office (ICO) at{" "}
          <LegalLink href="https://ico.org.uk" external>
            ico.org.uk
          </LegalLink>
          .
        </LegalP>
      </>
    ),
  },
  {
    index: "11",
    title: "Public and private information",
    body: (
      <>
        <LegalH3>Public: Digital Product Passports</LegalH3>
        <LegalP>
          DPP pages on dpp.envrt.com are public by design. The content
          displayed on a DPP page is controlled by the brand that created it.
          This may include product details, material information, transparency
          data, and modelled environmental metrics.
        </LegalP>
        <LegalP>
          Brands are responsible for deciding what information appears on their
          public DPP pages.
        </LegalP>

        <LegalH3>Private: Evidence uploads and internal data</LegalH3>
        <LegalP>
          Evidence uploads (documents, PDFs, images) and internal supplier data
          submitted through the dashboard are private by default. Access is
          restricted by role-based controls.
        </LegalP>
        <LegalP>
          This data is not made public unless a brand explicitly chooses to
          publish or share it.
        </LegalP>
      </>
    ),
  },
  {
    index: "12",
    title: "Automated processing",
    body: (
      <>
        <LegalP>
          We use automated systems to generate modelled estimates and insights
          from data submitted by brands and their supply chains. This includes
          modelled lifecycle metrics such as CO2e and water scarcity estimates.
        </LegalP>
        <LegalP>
          These outputs are intended as decision-support tools. They are based
          on models, assumptions and the data available at the time of
          calculation. They should not be treated as verified measurements.
        </LegalP>
        <LegalP>
          Brands are responsible for any public claims, disclosures or
          decisions they make based on outputs from the platform.
        </LegalP>
      </>
    ),
  },
  {
    index: "13",
    title: "Contact",
    body: (
      <>
        <LegalP>
          If you have questions about this policy or want to exercise your data
          rights, contact us at:
        </LegalP>
        <LegalP>
          <LegalLink href="mailto:info@envrt.com">info@envrt.com</LegalLink>
        </LegalP>
        <LegalP>ENVRT Ltd, United Kingdom.</LegalP>
      </>
    ),
  },
  {
    index: "14",
    title: "Changes to this policy",
    body: (
      <>
        <LegalP>
          We may update this policy from time to time to reflect changes in our
          services, legal requirements, or how we handle personal data.
        </LegalP>
        <LegalP>
          Where changes are significant, we will notify dashboard users by
          email or through the platform. We encourage you to review this page
          periodically.
        </LegalP>
        <LegalP>
          The &quot;Last updated&quot; date at the top of this page shows when
          the most recent changes were made.
        </LegalP>
      </>
    ),
  },
];

export default function PrivacyV3Page() {
  return (
    <LegalShell
      cornerLabel="Privacy"
      pageTitle="Privacy policy"
      pageBody="How ENVRT collects, uses and protects personal data across the marketing site, dashboard, public DPP pages and reports. Plain language, no marketing gloss."
      lastUpdated="Last updated 1 March 2026"
      sections={SECTIONS}
    />
  );
}

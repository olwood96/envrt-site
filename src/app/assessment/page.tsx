import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Accordion } from "@/components/ui/Accordion";
import { readinessAssessmentFaqItems } from "@/lib/config";
import AssessmentTool from "@/components/assessment/AssessmentTool";

export default function AssessmentPage() {
  return (
    <>
      <section className="pb-12 pt-28 sm:pb-16 sm:pt-32">
        <Container className="max-w-3xl">
          <div className="text-center">
            <Badge className="mb-6">DPP Readiness Assessment</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-5xl">
              Is your fashion brand ready for the Digital Product Passport?
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-envrt-muted sm:text-lg">
              A free, structured 10-minute assessment that scores your brand
              across the four dimensions of DPP readiness: supply chain
              transparency, product data completeness, regulatory awareness and
              data infrastructure. Get a personalised report covering your
              exposure to the EU ESPR, the UK DMCCA and the EU Green Claims
              Directive.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-envrt-teal/10 bg-envrt-teal/[0.03] px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-widest text-envrt-teal">
              What is DPP readiness?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-envrt-charcoal/85">
              DPP readiness is the measure of whether a fashion brand has the
              data, processes and tooling in place to produce a credible
              Digital Product Passport when the EU&apos;s ESPR textile delegated
              act takes effect. A ready brand can evidence its supply chain at
              least to fabric tier, holds product-level material and weight
              data in a structured system, understands its regulatory deadlines
              and uses dedicated tooling rather than ad-hoc spreadsheets. This
              assessment measures all four.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
            {[
              "Free, no account required, email required for personalised report",
              "Five sections, 25 questions, around 10 minutes",
              "Scored across four weighted dimensions",
              "Full HTML report emailed within minutes",
              "Mapped to the EU ESPR, UK DMCCA and Green Claims Directive",
              "Includes a green claims risk flag where exposure is detected",
            ].map((text) => (
              <div
                key={text}
                className="flex items-start gap-2.5 text-sm text-envrt-charcoal/80"
              >
                <svg
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-envrt-teal"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="8" cy="8" r="6.5" />
                  <path d="M5.5 8.5l2 2 3.5-4" />
                </svg>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="#assessment-start"
              className="inline-flex items-center justify-center rounded-xl bg-envrt-teal px-8 py-4 text-base font-semibold text-white transition-all hover:bg-envrt-teal/90 sm:text-lg"
            >
              Start the assessment <span className="ml-2">&rarr;</span>
            </Link>
          </div>
        </Container>
      </section>

      <AssessmentTool />

      <section className="border-t border-envrt-charcoal/5 bg-white py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-envrt-charcoal sm:text-3xl">
            How the DPP Readiness Assessment works
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-envrt-charcoal/80">
            <p>
              The assessment scores your brand across four dimensions. Supply
              chain transparency and product data completeness each weight 30
              per cent of the overall score because both are foundational to
              every other compliance output. Regulatory awareness and data
              infrastructure each weight 20 per cent because they shape how
              quickly the foundational gaps can be closed.
            </p>
            <p>
              Each answer carries a calibrated point value within its dimension.
              Multi-select questions on certifications and regulations award
              partial credit per selection up to a capped maximum. The overall
              score is the weighted average and maps to one of five readiness
              bands: Critical Exposure, Early Stage, Developing, Compliance
              Ready or Advanced.
            </p>
            <p>
              Where you indicate that your brand makes public sustainability
              claims without verified product-level data, the assessment flags
              a Green Claims Risk on your report. Under the EU Green Claims
              Directive and the UK DMCCA, unsubstantiated environmental claims
              carry direct legal exposure from 2026 onward.
            </p>
            <p>
              Your results are emailed as a structured HTML report with
              dimension scores, timeline risk and prioritised actions ranked
              against the barriers you identified. The on-screen results page
              additionally surfaces recommended reading based on your
              lowest-scoring dimension and a band-specific next step.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-envrt-charcoal/5 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-envrt-charcoal sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-6">
            <Accordion items={readinessAssessmentFaqItems} />
          </div>
        </Container>
      </section>

      <section className="border-t border-envrt-charcoal/5 bg-envrt-cream/40 py-16 sm:py-20">
        <Container className="max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-envrt-charcoal sm:text-3xl">
            Background reading
          </h2>
          <p className="mt-3 text-base leading-relaxed text-envrt-charcoal/80">
            The assessment is built around the regulations and methodology your
            brand will need to navigate. Start here to deepen the context.
          </p>
          <div className="mt-6 space-y-3">
            {[
              {
                title:
                  "EU Digital Product Passport for Textiles: What Fashion Brands Need to Know",
                href: "/insights/digital-product-passport-textiles-guide",
              },
              {
                title: "The EU Just Published Its DPP Data Methodology",
                href: "/insights/eu-dpp-data-methodology-fashion-brands",
              },
              {
                title:
                  "Product-Level Data Is Now the EU's Default",
                href: "/insights/product-level-data-dpp-requirement",
              },
              {
                title:
                  "What Is Greenwashing in Fashion? A Brand's Guide to Avoiding It",
                href: "/insights/greenwashing-in-fashion",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl border border-envrt-charcoal/8 bg-white p-4 transition-all hover:border-envrt-teal/30 hover:shadow-sm"
              >
                <p className="text-sm font-semibold text-envrt-charcoal">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-envrt-teal">Read article &rarr;</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

import { Container } from "@/components/ui/Container";
import { InsightsCard } from "@/components/insights/InsightCard";
import { getAllPostsMeta } from "@/lib/insights";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights | ENVRT",
  description:
    "Insights on sustainability data, Digital Product Passports, supply chain traceability, and the future of fashion transparency.",
  openGraph: {
    title: "Insights | ENVRT",
    description:
      "Insights on sustainability data, Digital Product Passports, supply chain traceability, and the future of fashion transparency.",
    url: "https://envrt.com/insights",
    type: "website",
  },
  alternates: {
    canonical: "https://envrt.com/insights",
  },
};

export default function InsightsIndexPage() {
  const posts = getAllPostsMeta();

  return (
    <div className="pt-28 pb-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-envrt-charcoal sm:text-5xl">
            Insights
          </h1>
          <p className="mt-4 text-base text-envrt-muted sm:text-lg">
            Insights on sustainability, traceability, and the future of fashion
            transparency.
          </p>

          {posts.length === 0 ? (
            <p className="mt-16 text-center text-envrt-muted">
              No posts yet. Check back soon.
            </p>
          ) : (
            <div className="mt-12 space-y-6">
              {posts.map((post) => (
                <InsightsCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

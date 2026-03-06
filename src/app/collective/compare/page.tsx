import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getFeaturedDpp } from "@/lib/collective/fetch";
import { CollectiveComparisonView } from "@/components/collective/CollectiveComparisonView";
import type { CollectiveCardData } from "@/lib/collective/types";

export const metadata: Metadata = {
  title: "Compare Products | ENVRT Collective",
  description:
    "Compare sustainability metrics across products side-by-side.",
};

interface PageProps {
  searchParams: { products?: string };
}

export default async function ComparePage({ searchParams }: PageProps) {
  const { products } = searchParams;

  if (!products) notFound();

  // Parse: brand/collection/sku,brand/collection/sku,...
  const entries = products.split(",").filter(Boolean);
  if (entries.length < 2 || entries.length > 4) notFound();

  // Fetch all DPPs in parallel
  const cards: (CollectiveCardData | null)[] = await Promise.all(
    entries.map(async (entry) => {
      const parts = entry.split("/");
      if (parts.length < 3) return null;
      const brandSlug = parts[0];
      // The product SKU is the last part, collection is everything in between
      const productSku = decodeURIComponent(parts[parts.length - 1]);
      const brandSlugDecoded = decodeURIComponent(brandSlug);

      // We search by brandSlug + productSku (collection is in the URL for cosmetics)
      return getFeaturedDpp(brandSlugDecoded, productSku);
    })
  );

  const validCards = cards.filter(
    (c): c is CollectiveCardData => c != null
  );

  if (validCards.length < 2) notFound();

  const brandNames = Array.from(new Set(validCards.map((c) => c.brand.name)));

  return (
    <div className="pt-28 pb-16">
      <Container>
        <Link
          href="/collective"
          className="inline-flex items-center gap-1 text-sm text-envrt-muted transition-colors hover:text-envrt-charcoal"
        >
          <span>←</span>
          Back to The Collective
        </Link>

        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
            {brandNames.join(" vs ")}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-envrt-charcoal sm:text-4xl">
            Product comparison
          </h1>
          <p className="mt-2 text-sm text-envrt-muted">
            Comparing {validCards.length} products side by side.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-envrt-charcoal/5 bg-white p-6 sm:p-8">
          <CollectiveComparisonView cards={validCards} />
        </div>
      </Container>
    </div>
  );
}

import { Container } from "@/components/ui/Container";
import { getFeaturedDpps } from "@/lib/collective/fetch";
import { CollectiveGrid } from "@/components/collective/CollectiveGrid";

export const revalidate = 300; // ISR 5 minutes

export default async function CollectivePage() {
  const { cards, filters } = await getFeaturedDpps();

  return (
    <div className="pt-28 pb-16">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-envrt-teal">
            The Collective
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-envrt-charcoal sm:text-5xl">
            Transparency in action
          </h1>
          <p className="mt-4 text-base text-envrt-muted sm:text-lg">
            Explore Digital Product Passports from brands using ENVRT. See real
            sustainability data, environmental metrics, and supply chain
            traceability.
          </p>
        </div>

        {cards.length === 0 ? (
          <p className="mt-16 text-center text-envrt-muted">
            No featured products yet. Check back soon.
          </p>
        ) : (
          <div className="mt-12">
            <CollectiveGrid cards={cards} filters={filters} />
          </div>
        )}
      </Container>
    </div>
  );
}

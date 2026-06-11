// Schema.org HowTo block. Used for "How it works" + the DPP timeline
// regulatory milestones (each milestone = a step in the journey to
// compliance). Steps can carry an optional dated label so AI Overviews
// and Rich Results show "Step N: title" cleanly.

type HowToStep = {
  name: string;
  text: string;
  url?: string;
};

export function HowToJsonLd({
  name,
  description,
  steps,
  url,
}: {
  name: string;
  description: string;
  steps: HowToStep[];
  url: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    url,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

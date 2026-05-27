interface WebApplicationJsonLdProps {
  name: string;
  url: string;
  description: string;
  applicationCategory?: string;
  isQuiz?: boolean;
}

export function WebApplicationJsonLd({
  name,
  url,
  description,
  applicationCategory = "BusinessApplication",
  isQuiz = false,
}: WebApplicationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isQuiz ? ["WebApplication", "Quiz"] : "WebApplication",
    name,
    url,
    description,
    applicationCategory,
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript enabled browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@type": "Organization",
      name: "ENVRT",
      url: "https://envrt.com",
    },
    ...(isQuiz && {
      educationalUse: "Self-Assessment",
      assesses:
        "Digital Product Passport readiness for fashion and textile brands under the EU ESPR framework",
      learningResourceType: "Assessment",
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

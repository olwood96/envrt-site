export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ENVRT",
    url: "https://envrt.com",
    description:
      "Digital Product Passports, lifecycle metrics and sustainability analytics, all in one place.",
    publisher: {
      "@type": "Organization",
      name: "ENVRT",
      url: "https://envrt.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

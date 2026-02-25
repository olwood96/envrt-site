export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ENVRT",
    url: "https://envrt.com",
    logo: "https://envrt.com/brand/envrt-logo.png",
    description:
      "Digital Product Passports, lifecycle metrics and sustainability analytics for fashion brands.",
    email: "info@envrt.com",
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@envrt.com",
      contactType: "sales",
      availableLanguage: "English",
    },
    founders: [
      {
        "@type": "Person",
        name: "Charles Woolwich",
        jobTitle: "Founder & CEO",
      },
      {
        "@type": "Person",
        name: "Oliver Woodcock",
        jobTitle: "Founder & CTO",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

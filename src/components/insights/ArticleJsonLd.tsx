import type { InsightsPostMeta } from "@/lib/insights";

interface ArticleJsonLdProps {
  post: InsightsPostMeta;
  url: string;
}

export function ArticleJsonLd({ post, url }: ArticleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Organization",
      name: post.author === "ENVRT" ? "ENVRT" : post.author,
      url: "https://envrt.com",
    },
    publisher: {
      "@type": "Organization",
      name: "ENVRT",
      url: "https://envrt.com",
      logo: {
        "@type": "ImageObject",
        url: "https://envrt.com/logo.png",
      },
    },
    url,
    datePublished: post.date,
    ...(post.updated && { dateModified: post.updated }),
    ...(post.ogImage && {
      image: `https://envrt.com${post.ogImage}`,
    }),
    keywords: post.keywords.join(", "),
    wordCount: post.readingTime * 230,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

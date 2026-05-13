// lib/seo.ts
// Centralized SEO utilities: metadata generation, JSON-LD schemas,
// Open Graph, canonical URLs, and structured data

import type { Metadata } from "next";

// ── Site Config ───────────────────────────────────────────────────────────────
export const siteConfig = {
  name: "AutoPilotSMB",
  description:
    "The #1 resource for AI tools, automation strategies, and productivity systems for small businesses, solopreneurs, and agencies.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://autopilotsmb.com",
  ogImage: "/og-default.png",
  twitter: "@AutoPilotSMB",
  author: "AutoPilotSMB Team",
  keywords: [
    "AI tools for small business",
    "business automation",
    "AI productivity",
    "small business AI",
    "automation tools",
    "solopreneur tools",
    "AI marketing tools",
  ],
};

// ── Base Metadata ─────────────────────────────────────────────────────────────
export function buildMetadata({
  title,
  description,
  slug,
  ogImage,
  noIndex = false,
  type = "website",
}: {
  title?: string;
  description?: string;
  slug?: string;
  ogImage?: string;
  noIndex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — AI Tools & Automation for Small Businesses`;

  const metaDesc = description || siteConfig.description;
  const canonical = slug
    ? `${siteConfig.url}/${slug}`
    : siteConfig.url;
  const image = ogImage || siteConfig.ogImage;

  return {
    title: fullTitle,
    description: metaDesc,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type,
      title: fullTitle,
      description: metaDesc,
      url: canonical,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDesc,
      images: [image],
      creator: siteConfig.twitter,
      site: siteConfig.twitter,
    },
  };
}

// ── JSON-LD Schemas ───────────────────────────────────────────────────────────

export function blogPostSchema({
  title,
  description,
  slug,
  authorName,
  publishedAt,
  updatedAt,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  authorName: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${siteConfig.url}/blog/${slug}`,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    image: image
      ? {
          "@type": "ImageObject",
          url: image,
          width: 1200,
          height: 630,
        }
      : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${slug}`,
    },
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    sameAs: [
      "https://twitter.com/AutoPilotSMB",
      "https://linkedin.com/company/autopilotsmb",
    ],
  };
}

export function softwareApplicationSchema({
  name,
  description,
  url,
  price,
  rating,
  reviewCount,
}: {
  name: string;
  description: string;
  url: string;
  price: string;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "USD",
    },
    ...(rating && reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating,
            reviewCount,
          },
        }
      : {}),
  };
}

// ── Reading time ──────────────────────────────────────────────────────────────
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 225;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

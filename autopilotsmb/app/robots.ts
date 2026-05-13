import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/_next/",
        ],
      },
      {
        // Block AI training crawlers (optional — remove if you want AI visibility)
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "CCBot",
          "anthropic-ai",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

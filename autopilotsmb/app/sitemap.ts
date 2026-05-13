import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/seo";

export const revalidate = 3600; // Rebuild every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // ── Static pages ────────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // ── Blog posts ──────────────────────────────────────────────────────────────
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    });

    blogPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Database may not be available during build — skip dynamic pages
    console.warn("[sitemap] Could not fetch posts from database");
  }

  // ── AI Tools ────────────────────────────────────────────────────────────────
  let toolPages: MetadataRoute.Sitemap = [];
  try {
    const tools = await prisma.tool.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    toolPages = tools.map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: tool.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    console.warn("[sitemap] Could not fetch tools from database");
  }

  return [...staticPages, ...blogPages, ...toolPages];
}

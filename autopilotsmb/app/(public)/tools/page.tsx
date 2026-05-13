// app/(public)/tools/page.tsx
// AI Tool Directory — searchable, filterable, rated
// Full tool catalog with category filters, pricing labels, affiliate buttons

import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { buildMetadata, softwareApplicationSchema } from "@/lib/seo";
import AdSlot from "@/components/AdSlot";
import { NewsletterCTA } from "@/components/CTA";
import { Star, ExternalLink, Search, Zap, Filter } from "lucide-react";

export const metadata = buildMetadata({
  title: "Best AI Tools for Small Business — Directory",
  description:
    "Browse 200+ AI tools independently reviewed and rated for small businesses. Filter by category, pricing, and use case. Find the right AI tool for your business.",
  slug: "tools",
});

interface ToolsPageProps {
  searchParams: Promise<{
    category?: string;
    pricing?: string;
    q?: string;
    sort?: string;
  }>;
}

async function getTools(params: {
  category?: string;
  pricing?: string;
  q?: string;
  sort?: string;
}) {
  const { category, pricing, q, sort } = params;

  const where = {
    published: true,
    ...(category && { category: { slug: category } }),
    ...(pricing && { pricing: pricing as any }),
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { tagline: { contains: q, mode: "insensitive" as const } },
        { description: { contains: q, mode: "insensitive" as const } },
      ],
    }),
  };

  const orderBy =
    sort === "rating"
      ? { rating: "desc" as const }
      : sort === "name"
      ? { name: "asc" as const }
      : { featured: "desc" as const };

  const [tools, categories] = await Promise.all([
    prisma.tool.findMany({
      where,
      orderBy,
      include: {
        category: { select: { name: true, slug: true } },
        affiliateLinks: { select: { id: true, url: true }, take: 1 },
      },
    }),
    prisma.category.findMany({
      include: { _count: { select: { tools: true } } },
      orderBy: { tools: { _count: "desc" } },
    }),
  ]);

  return { tools, categories };
}

// Static tool data for fallback (when DB is empty)
const staticTools = [
  { name: "ChatGPT", slug: "chatgpt", tagline: "OpenAI's flagship AI assistant for text, code, and analysis", category: "AI Writing", pricing: "FREEMIUM", priceLabel: "Free / $20/mo", rating: 4.8, reviewCount: 2840, featured: true, website: "https://chat.openai.com" },
  { name: "Jasper AI", slug: "jasper-ai", tagline: "Enterprise-grade AI content platform for marketing teams", category: "AI Writing", pricing: "PAID", priceLabel: "From $39/mo", rating: 4.6, reviewCount: 1240, featured: true, website: "https://jasper.ai" },
  { name: "Zapier", slug: "zapier", tagline: "No-code automation connecting 6,000+ apps and services", category: "Automation", pricing: "FREEMIUM", priceLabel: "Free / $19.99/mo", rating: 4.7, reviewCount: 3100, featured: true, website: "https://zapier.com" },
  { name: "Make (Integromat)", slug: "make", tagline: "Visual workflow automation for complex business processes", category: "Automation", pricing: "FREEMIUM", priceLabel: "Free / $9/mo", rating: 4.5, reviewCount: 890, featured: false, website: "https://make.com" },
  { name: "Surfer SEO", slug: "surfer-seo", tagline: "AI-powered SEO platform for writing content that ranks", category: "SEO Tools", pricing: "PAID", priceLabel: "From $89/mo", rating: 4.6, reviewCount: 720, featured: true, website: "https://surferseo.com" },
  { name: "Copy.ai", slug: "copy-ai", tagline: "AI copywriting platform for marketing content at scale", category: "AI Writing", pricing: "FREEMIUM", priceLabel: "Free / $36/mo", rating: 4.4, reviewCount: 980, featured: false, website: "https://copy.ai" },
  { name: "Notion AI", slug: "notion-ai", tagline: "AI-powered knowledge management and team workspace", category: "Productivity", pricing: "FREEMIUM", priceLabel: "Free / $8/mo", rating: 4.5, reviewCount: 1560, featured: true, website: "https://notion.so" },
  { name: "Semrush", slug: "semrush", tagline: "All-in-one SEO, content, and competitive intelligence platform", category: "SEO Tools", pricing: "PAID", priceLabel: "From $129.95/mo", rating: 4.7, reviewCount: 2100, featured: true, website: "https://semrush.com" },
  { name: "Midjourney", slug: "midjourney", tagline: "AI image generation for stunning visuals and brand assets", category: "AI Images", pricing: "PAID", priceLabel: "From $10/mo", rating: 4.8, reviewCount: 1800, featured: true, website: "https://midjourney.com" },
  { name: "Otter.ai", slug: "otter-ai", tagline: "AI meeting transcription and summary for productive teams", category: "Productivity", pricing: "FREEMIUM", priceLabel: "Free / $17/mo", rating: 4.4, reviewCount: 640, featured: false, website: "https://otter.ai" },
];

const pricingOptions = [
  { value: "", label: "All Pricing" },
  { value: "FREE", label: "Free" },
  { value: "FREEMIUM", label: "Freemium" },
  { value: "PAID", label: "Paid" },
  { value: "TRIAL", label: "Free Trial" },
];

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const params = await searchParams;
  const { tools: dbTools, categories } = await getTools(params);

  // Use DB tools if available, otherwise static
  const displayTools = dbTools.length > 0 ? dbTools : staticTools;
  const activeCategory = params.category;
  const activePricing = params.pricing;

  const toolSchemas = displayTools.slice(0, 5).map((t: any) =>
    softwareApplicationSchema({
      name: t.name,
      description: t.tagline,
      url: (t as any).website || "",
      price: t.priceLabel || "0",
      rating: t.rating || undefined,
      reviewCount: t.reviewCount,
    })
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Best AI Tools for Small Business",
            itemListElement: toolSchemas.map((schema: any, idx: number) => ({
              "@type": "ListItem",
              position: idx + 1,
              item: schema,
            })),
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="badge badge-blue mb-4">200+ Tools Reviewed</div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            The Best AI Tools for{" "}
            <span className="gradient-text-blue">Small Business</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Independently reviewed AI tools, rated by real small business owners.
            Filter by use case, pricing, and category to find your perfect fit.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-8">
          <form action="/tools" method="get" className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              name="q"
              type="search"
              defaultValue={params.q}
              placeholder="Search 200+ AI tools..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-electric focus:ring-1 focus:ring-blue-electric/25 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-electric text-white rounded-lg px-4 py-1.5 text-sm font-medium hover:bg-blue-dim transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Top ad */}
        <AdSlot slot="tools-top" format="horizontal" className="mb-10" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* Categories */}
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Category
                </h3>
                <div className="space-y-1">
                  <Link
                    href="/tools"
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      !activeCategory
                        ? "bg-blue-electric/15 text-blue-electric"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    All Tools
                    <span className="text-xs text-zinc-600">{displayTools.length}</span>
                  </Link>
                  {categories.length > 0
                    ? categories.map((cat: any) => (
                        <Link
                          key={cat.id}
                          href={`/tools?category=${cat.slug}`}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                            activeCategory === cat.slug
                              ? "bg-blue-electric/15 text-blue-electric"
                              : "text-zinc-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {cat.name}
                          <span className="text-xs text-zinc-600">
                            {cat._count.tools}
                          </span>
                        </Link>
                      ))
                    : ["AI Writing", "Automation", "SEO Tools", "Productivity", "AI Images"].map(
                        (cat) => (
                          <Link
                            key={cat}
                            href={`/tools?category=${cat.toLowerCase().replace(/ /g, "-")}`}
                            className="flex px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            {cat}
                          </Link>
                        )
                      )}
                </div>
              </div>

              {/* Pricing filter */}
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Pricing</h3>
                <div className="space-y-1">
                  {pricingOptions.map((opt) => (
                    <Link
                      key={opt.value}
                      href={`/tools${opt.value ? `?pricing=${opt.value}` : ""}`}
                      className={`flex px-3 py-2 rounded-lg text-sm transition-colors ${
                        (activePricing || "") === opt.value
                          ? "bg-blue-electric/15 text-blue-electric"
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sidebar ad */}
              <AdSlot slot="tools-sidebar" format="vertical" />
            </div>
          </aside>

          {/* Tool grid */}
          <div className="lg:col-span-3">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-zinc-500">
                Showing <span className="text-white font-semibold">{displayTools.length}</span> tools
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-600">Sort:</span>
                {["featured", "rating", "name"].map((s) => (
                  <Link
                    key={s}
                    href={`/tools?sort=${s}${activeCategory ? `&category=${activeCategory}` : ""}`}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors capitalize ${
                      (params.sort || "featured") === s
                        ? "bg-zinc-800 border-zinc-700 text-white"
                        : "border-zinc-800 text-zinc-500 hover:text-white"
                    }`}
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayTools.map((tool: any, idx: number) => (
                <div key={tool.slug || tool.name}>
                  <ToolCard tool={tool} />
                  {(idx + 1) % 8 === 0 && (
                    <div className="sm:col-span-2 mt-4">
                      <AdSlot slot={`tools-inline-${idx}`} format="horizontal" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <NewsletterCTA
          source="tools-page"
          title="Get Our AI Tools Roundup Newsletter"
          description="Weekly digest of the best new AI tools, exclusive discounts, and automation guides — straight to your inbox."
        />
      </div>
    </>
  );
}

// ── Tool Card Component ────────────────────────────────────────────────────────
function ToolCard({ tool }: { tool: any }) {
  const pricingConfig: Record<string, { label: string; class: string }> = {
    FREE: { label: "Free", class: "badge-green" },
    FREEMIUM: { label: "Freemium", class: "badge-blue" },
    PAID: { label: "Paid", class: "badge-orange" },
    TRIAL: { label: "Free Trial", class: "badge-blue" },
  };

  const pricing = pricingConfig[tool.pricing] || { label: tool.pricing, class: "badge-blue" };

  return (
    <div className="card card-glow p-5 h-full flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {tool.logoUrl ? (
              <Image
                src={tool.logoUrl}
                alt={tool.name}
                width={44}
                height={44}
                className="object-contain p-1"
              />
            ) : (
              <Zap className="w-5 h-5 text-blue-electric" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-white font-display leading-tight">{tool.name}</h3>
            {tool.category && (
              <span className="text-xs text-zinc-500">
                {tool.category?.name || tool.category}
              </span>
            )}
          </div>
        </div>
        <span className={`badge ${pricing.class} flex-shrink-0`}>{pricing.label}</span>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed mb-4 flex-1">
        {tool.tagline}
      </p>

      {/* Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.round(tool.rating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-zinc-700"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-white">
            {(tool.rating || 0).toFixed(1)}
          </span>
          {tool.reviewCount > 0 && (
            <span className="text-xs text-zinc-600">
              ({tool.reviewCount.toLocaleString()})
            </span>
          )}
        </div>
        {tool.priceLabel && (
          <span className="text-xs text-zinc-500 font-mono">{tool.priceLabel}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <a
          href={
            tool.affiliateLinks?.[0]?.url ||
            tool.website ||
            "#"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 btn-primary text-sm py-2 justify-center"
          onClick={() => {
            if (tool.affiliateLinks?.[0]?.id) {
              fetch(`/api/affiliate/track?id=${tool.affiliateLinks[0].id}`, { method: "POST" }).catch(() => {});
            }
          }}
        >
          Try Free
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        {tool.slug && (
          <Link
            href={`/tools/${tool.slug}`}
            className="btn-secondary text-sm py-2 px-3"
          >
            Review
          </Link>
        )}
      </div>
    </div>
  );
}

// app/(public)/page.tsx
// Homepage — the primary landing page for AutoPilotSMB
// Sections: Hero, Stats, Categories, Featured Tools, Blog, Newsletter, Testimonials, CTA

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, TrendingUp, Users, BookOpen, Wrench, Star, CheckCircle, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import PostCard from "@/components/PostCard";
import { NewsletterCTA } from "@/components/CTA";
import AdSlot from "@/components/AdSlot";

export const metadata = buildMetadata({
  title: "AI Tools & Automation for Small Businesses",
  description:
    "AutoPilotSMB is your guide to AI tools, automation systems, and productivity strategies that help small businesses grow faster with less effort.",
});

// ── Data fetching ──────────────────────────────────────────────────────────────
async function getHomeData() {
  const [featuredPosts, featuredTools, categories] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 6,
      include: {
        author: { select: { name: true, image: true } },
        categories: { select: { name: true, slug: true } },
        tags: { select: { name: true, slug: true } },
      },
    }),
    prisma.tool.findMany({
      where: { published: true, featured: true },
      orderBy: { rating: "desc" },
      take: 6,
      include: { category: { select: { name: true } } },
    }),
    prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { posts: { _count: "desc" } },
      take: 6,
    }),
  ]);

  return { featuredPosts, featuredTools, categories };
}

// ── Testimonials (static for now — move to DB if needed) ──────────────────────
const testimonials = [
  {
    quote: "AutoPilotSMB helped me cut my content creation time by 70%. The AI tool reviews are incredibly detailed and honest.",
    author: "Sarah M.",
    role: "Marketing Agency Owner",
    avatar: null,
    rating: 5,
  },
  {
    quote: "I implemented 3 automation workflows from one of their guides and saved 15 hours per week. Absolutely game-changing.",
    author: "James K.",
    role: "E-commerce Solopreneur",
    avatar: null,
    rating: 5,
  },
  {
    quote: "The AI tools directory is the most comprehensive I've found. Filters, pricing labels, real reviews — perfect.",
    author: "Priya N.",
    role: "Freelance Consultant",
    avatar: null,
    rating: 5,
  },
];

const categories = [
  { name: "AI Writing", slug: "ai-writing", icon: "✍️", count: 24, color: "from-blue-electric/20 to-transparent" },
  { name: "Automation", slug: "automation", icon: "⚡", count: 18, color: "from-purple-500/20 to-transparent" },
  { name: "Marketing AI", slug: "marketing-ai", icon: "📈", count: 15, color: "from-green-500/20 to-transparent" },
  { name: "Productivity", slug: "productivity", icon: "🚀", count: 21, color: "from-orange-500/20 to-transparent" },
  { name: "Customer Service", slug: "customer-service", icon: "💬", count: 12, color: "from-pink-500/20 to-transparent" },
  { name: "Analytics", slug: "analytics", icon: "📊", count: 9, color: "from-cyan-500/20 to-transparent" },
];

export default async function HomePage() {
  const { featuredPosts, featuredTools } = await getHomeData();

  return (
    <div className="overflow-hidden">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center bg-grid">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-electric/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-electric/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-4xl">
            {/* Announcement badge */}
            <div className="inline-flex items-center gap-2 bg-blue-electric/10 border border-blue-electric/25 rounded-full px-4 py-1.5 mb-8">
              <Zap className="w-3.5 h-3.5 text-blue-electric" fill="currentColor" />
              <span className="text-xs font-semibold text-blue-electric uppercase tracking-wider">
                200+ AI Tools Reviewed
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display text-white leading-[1.05] tracking-tight mb-6">
              Run Your Business on{" "}
              <span className="gradient-text">Autopilot</span>{" "}
              with AI
            </h1>

            <p className="text-xl text-zinc-400 leading-relaxed mb-10 max-w-2xl">
              Discover the best AI tools, automation workflows, and productivity
              systems used by 50,000+ small businesses to grow faster — without
              burning out.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link href="/tools" className="btn-primary text-base py-3.5 px-7 group">
                Explore AI Tools
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/blog" className="btn-secondary text-base py-3.5 px-7">
                Read Free Guides
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { label: "AI Tools Reviewed", value: "200+" },
                { label: "Monthly Readers", value: "50k+" },
                { label: "Newsletter Subscribers", value: "12k+" },
                { label: "Hours Saved / Week", value: "∞" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold font-display text-white">{stat.value}</p>
                  <p className="text-sm text-zinc-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AD SLOT ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4">
        <AdSlot slot="1234567890" format="horizontal" />
      </div>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold font-display text-white">
                Browse by Category
              </h2>
              <p className="text-zinc-500 mt-1">Find tools and guides for every use case</p>
            </div>
            <Link
              href="/blog"
              className="hidden sm:flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              All categories <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className={`group card card-glow p-4 flex flex-col items-center text-center bg-gradient-to-b ${cat.color} hover:scale-105 transition-all duration-200`}
              >
                <span className="text-2xl mb-2">{cat.icon}</span>
                <span className="text-sm font-semibold text-zinc-200 group-hover:text-white">
                  {cat.name}
                </span>
                <span className="text-xs text-zinc-500 mt-1">{cat.count} articles</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED TOOLS ───────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0D0D0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="badge badge-blue mb-3">Tool Directory</div>
              <h2 className="text-3xl font-bold font-display text-white">
                Top-Rated AI Tools
              </h2>
              <p className="text-zinc-500 mt-1">Independently reviewed and rated</p>
            </div>
            <Link
              href="/tools"
              className="hidden sm:flex items-center gap-2 text-sm text-blue-electric hover:text-blue-glow transition-colors"
            >
              View all tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            // Static fallback when DB is empty
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {staticTools.map((tool) => (
                <StaticToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/tools" className="btn-secondary inline-flex">
              Browse All 200+ Tools <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── LATEST BLOG POSTS ─────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="badge badge-blue mb-3">Latest Guides</div>
              <h2 className="text-3xl font-bold font-display text-white">
                Free AI Guides & Tutorials
              </h2>
              <p className="text-zinc-500 mt-1">
                Practical, actionable content for small business owners
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden sm:flex items-center gap-2 text-sm text-blue-electric hover:text-blue-glow transition-colors"
            >
              View all posts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredPosts.length > 0 ? (
            <>
              {/* Featured post (large) */}
              {featuredPosts[0] && (
                <div className="mb-6">
                  <PostCard post={featuredPosts[0]} featured />
                </div>
              )}
              {/* Remaining 4 in grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredPosts.slice(1, 5).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : (
            // Static fallback
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {staticPosts.map((post) => (
                <StaticPostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsletterCTA source="homepage" />
      </div>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0D0D0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="badge badge-blue mb-4">Trusted by 50,000+ Readers</div>
            <h2 className="text-3xl font-bold font-display text-white">
              What Our Readers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.author} className="card card-glow p-6">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-zinc-400 text-sm leading-relaxed mb-5">
                  "{t.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-electric/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-electric">
                      {t.author[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.author}</p>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA BANNER ─────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl bg-gradient-to-br from-blue-electric/20 via-zinc-900 to-zinc-900 border border-blue-electric/25 overflow-hidden text-center p-12 md:p-16">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4 leading-tight">
                Ready to Automate<br />Your Business?
              </h2>
              <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
                Start with our free AI tools directory and guides. No credit card
                required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tools" className="btn-primary text-base py-3.5 px-8 group glow-blue">
                  Browse AI Tools
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/blog" className="btn-secondary text-base py-3.5 px-8">
                  Read Free Guides
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
                {["No signup required", "100% free content", "Updated weekly"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-zinc-400">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <AdSlot slot="0987654321" format="horizontal" />
      </div>
    </div>
  );
}

// ── Static fallbacks (used when DB is empty) ──────────────────────────────────
const staticTools = [
  { name: "ChatGPT", tagline: "The world's most popular AI assistant for business tasks", pricing: "FREEMIUM", priceLabel: "Free / $20/mo", rating: 4.8 },
  { name: "Zapier", tagline: "Connect 6,000+ apps and automate workflows without code", pricing: "FREEMIUM", priceLabel: "Free / $19.99/mo", rating: 4.7 },
  { name: "Jasper AI", tagline: "AI content platform built for marketing teams and agencies", pricing: "PAID", priceLabel: "From $39/mo", rating: 4.6 },
  { name: "Notion AI", tagline: "Turn your Notion workspace into an AI-powered command center", pricing: "FREEMIUM", priceLabel: "Free / $8/mo", rating: 4.5 },
  { name: "Surfer SEO", tagline: "AI-powered SEO tool for ranking content on Google", pricing: "PAID", priceLabel: "From $89/mo", rating: 4.6 },
  { name: "Make (Integromat)", tagline: "Visual automation platform for complex business workflows", pricing: "FREEMIUM", priceLabel: "Free / $9/mo", rating: 4.5 },
];

function StaticToolCard({ tool }: { tool: typeof staticTools[0] }) {
  const pricingColor: Record<string, string> = {
    FREE: "badge-green",
    FREEMIUM: "badge-blue",
    PAID: "badge-orange",
  };

  return (
    <Link href="/tools" className="group card card-glow p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-blue-electric/15 flex items-center justify-center">
          <Wrench className="w-5 h-5 text-blue-electric" />
        </div>
        <span className={`badge ${pricingColor[tool.pricing] || "badge-blue"}`}>
          {tool.pricing}
        </span>
      </div>
      <h3 className="font-bold text-white group-hover:text-blue-electric transition-colors mb-1 font-display">
        {tool.name}
      </h3>
      <p className="text-xs text-zinc-500 flex-1 leading-relaxed">{tool.tagline}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-zinc-400">{tool.rating}</span>
        </div>
        <span className="text-xs text-zinc-500">{tool.priceLabel}</span>
      </div>
    </Link>
  );
}

const staticPosts = [
  { slug: "best-ai-tools-small-business-2024", title: "15 Best AI Tools for Small Businesses in 2024 (Tested & Reviewed)", excerpt: "We tested 50+ AI tools to find the ones that actually save time and make money for small business owners. Here are our top picks.", category: "AI Tools", readingTime: 12 },
  { slug: "how-to-automate-social-media-ai", title: "How to Automate Your Entire Social Media Strategy with AI", excerpt: "Step-by-step guide to creating, scheduling, and optimizing social media content with AI tools — saving 10+ hours per week.", category: "Automation", readingTime: 8 },
  { slug: "ai-content-marketing-guide", title: "The Complete AI Content Marketing Guide for Solopreneurs", excerpt: "How to use AI to write blog posts, emails, and social content that ranks on Google and converts readers into customers.", category: "Marketing AI", readingTime: 15 },
];

function StaticPostCard({ post }: { post: typeof staticPosts[0] }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group card card-glow p-5 flex flex-col">
      <span className="badge badge-blue mb-3 self-start">{post.category}</span>
      <h3 className="font-bold text-zinc-100 group-hover:text-white mb-2 line-clamp-2 font-display leading-snug">
        {post.title}
      </h3>
      <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed flex-1">{post.excerpt}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-zinc-500">{post.readingTime} min read</span>
        <span className="text-xs text-blue-electric font-semibold group-hover:underline">Read →</span>
      </div>
    </Link>
  );
}

// ── DB Tool card ──────────────────────────────────────────────────────────────
function ToolCard({ tool }: { tool: any }) {
  const pricingColor: Record<string, string> = {
    FREE: "badge-green",
    FREEMIUM: "badge-blue",
    PAID: "badge-orange",
    TRIAL: "badge-blue",
  };

  return (
    <Link href={`/tools/${tool.slug}`} className="group card card-glow p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-blue-electric/15 flex items-center justify-center">
          {tool.logoUrl ? (
            <Image src={tool.logoUrl} alt={tool.name} width={28} height={28} className="object-contain" />
          ) : (
            <Wrench className="w-5 h-5 text-blue-electric" />
          )}
        </div>
        <span className={`badge ${pricingColor[tool.pricing] || "badge-blue"}`}>
          {tool.pricing}
        </span>
      </div>
      <h3 className="font-bold text-white group-hover:text-blue-electric transition-colors mb-1 font-display">
        {tool.name}
      </h3>
      <p className="text-xs text-zinc-500 flex-1 leading-relaxed">{tool.tagline}</p>
      <div className="mt-4 flex items-center justify-between">
        {tool.rating > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-zinc-400">{tool.rating.toFixed(1)}</span>
          </div>
        )}
        {tool.priceLabel && (
          <span className="text-xs text-zinc-500 ml-auto">{tool.priceLabel}</span>
        )}
      </div>
    </Link>
  );
}

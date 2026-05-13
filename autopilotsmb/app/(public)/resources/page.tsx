// app/(public)/resources/page.tsx
// Resources page — free downloads, digital products, templates, toolkits

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { NewsletterCTA } from "@/components/CTA";
import AdSlot from "@/components/AdSlot";
import { Download, ShoppingCart, Star, Lock, FileText, BookOpen, Layers, Video } from "lucide-react";

export const metadata = buildMetadata({
  title: "Free Resources & Digital Products",
  description:
    "Download free AI templates, automation playbooks, and business toolkits. Plus premium digital products to 10x your small business.",
  slug: "resources",
});

async function getProducts() {
  return prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

// Static products for DB-empty fallback
const staticProducts = [
  {
    id: "1",
    slug: "ai-automation-playbook",
    name: "AI Automation Playbook for Small Business",
    description: "50-page guide covering 25 automation workflows with step-by-step setup instructions for Zapier, Make, and ChatGPT. Save 15+ hours per week.",
    price: 2700,
    type: "EBOOK",
    coverImage: null,
    featured: true,
    free: false,
    rating: 4.9,
    downloads: 847,
  },
  {
    id: "2",
    slug: "ai-prompt-library",
    name: "500+ AI Prompt Library for Marketers",
    description: "Ready-to-use ChatGPT and Claude prompts for content creation, email marketing, social media, SEO, and customer service.",
    price: 1700,
    type: "TOOLKIT",
    coverImage: null,
    featured: true,
    free: false,
    rating: 4.8,
    downloads: 1240,
  },
  {
    id: "3",
    slug: "seo-content-templates",
    name: "AI SEO Content Templates Pack",
    description: "10 plug-and-play content frameworks optimized for Google rankings. Includes blog posts, listicles, comparison articles, and pillar pages.",
    price: 1200,
    type: "TEMPLATE",
    coverImage: null,
    featured: false,
    free: false,
    rating: 4.7,
    downloads: 523,
  },
  {
    id: "4",
    slug: "free-ai-tools-checklist",
    name: "Free: 50 Best Free AI Tools Checklist",
    description: "Curated list of the 50 best completely free AI tools for small businesses — no credit card required. Updated monthly.",
    price: 0,
    type: "EBOOK",
    coverImage: null,
    featured: false,
    free: true,
    rating: 4.6,
    downloads: 3200,
  },
];

const typeIcons: Record<string, any> = {
  EBOOK: BookOpen,
  TEMPLATE: FileText,
  TOOLKIT: Layers,
  COURSE: Video,
};

export default async function ResourcesPage() {
  const dbProducts = await getProducts();
  const products = dbProducts.length > 0 ? dbProducts : staticProducts;

  const freeProducts = staticProducts.filter((p) => p.free || p.price === 0);
  const paidProducts = staticProducts.filter((p) => !p.free && p.price > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="badge badge-green mb-4">Free & Premium Resources</div>
        <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
          Resources to Grow Faster with AI
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Free templates, guides, and premium toolkits to help you automate your
          business and save 10+ hours every week.
        </p>
      </div>

      <AdSlot slot="resources-top" format="horizontal" className="mb-10" />

      {/* Free Downloads */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Download className="w-5 h-5 text-green-400" />
          <h2 className="text-2xl font-bold font-display text-white">Free Downloads</h2>
          <span className="badge badge-green">100% Free</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {freeProducts.map((product) => {
            const Icon = typeIcons[product.type] || BookOpen;
            return (
              <div key={product.id} className="card card-glow p-6 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/15 border border-green-500/25 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="badge badge-green">FREE</span>
                </div>

                <h3 className="font-bold text-white font-display mb-2 leading-snug">
                  {product.name}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed flex-1 mb-4">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-zinc-400">
                      {(product.rating || 4.5).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {product.downloads?.toLocaleString()} downloads
                  </span>
                </div>

                <Link
                  href="#newsletter"
                  className="btn-primary w-full justify-center text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download Free
                </Link>
                <p className="text-[10px] text-zinc-600 mt-2 text-center">
                  Enter email to receive download link
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Premium Products */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart className="w-5 h-5 text-blue-electric" />
          <h2 className="text-2xl font-bold font-display text-white">Premium Toolkits</h2>
          <span className="badge badge-blue">Instant Access</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paidProducts.map((product) => {
            const Icon = typeIcons[product.type] || BookOpen;
            const priceFormatted = `$${(product.price / 100).toFixed(0)}`;

            return (
              <div
                key={product.id}
                className={`card p-6 flex flex-col relative overflow-hidden ${
                  (product as any).featured
                    ? "border-blue-electric/40 bg-gradient-to-b from-blue-electric/5 to-transparent"
                    : "card-glow"
                }`}
              >
                {(product as any).featured && (
                  <div className="absolute top-3 right-3">
                    <span className="badge badge-blue text-[10px]">⭐ Best Seller</span>
                  </div>
                )}

                <div className="w-12 h-12 rounded-xl bg-blue-electric/15 border border-blue-electric/25 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-electric" />
                </div>

                <h3 className="font-bold text-white font-display mb-2 leading-snug pr-16">
                  {product.name}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed flex-1 mb-4">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-zinc-400">
                      {(product.rating || 4.7).toFixed(1)}
                    </span>
                    <span className="text-xs text-zinc-600 ml-1">
                      ({product.downloads} sold)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white font-display">
                      {priceFormatted}
                    </span>
                    <span className="text-xs text-zinc-500 block">one-time</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    href={`/checkout/${product.slug}`}
                    className="btn-primary w-full justify-center"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Buy Now — {priceFormatted}
                  </Link>
                  <div className="flex items-center justify-center gap-1.5">
                    <Lock className="w-3 h-3 text-zinc-600" />
                    <span className="text-[10px] text-zinc-600">
                      Secure checkout · Instant delivery
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Newsletter with free lead magnet */}
      <section id="newsletter">
        <NewsletterCTA
          source="resources-page"
          title="Get All Free Downloads Instantly"
          description="Subscribe to our newsletter and get instant access to all free resources — plus a new guide every week."
        />
      </section>
    </div>
  );
}

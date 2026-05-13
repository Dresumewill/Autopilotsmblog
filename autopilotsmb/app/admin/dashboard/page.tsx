// app/admin/dashboard/page.tsx
// Admin dashboard — analytics overview, quick actions, recent activity

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  FileText, Package, Users, Eye, TrendingUp, Plus,
  ArrowUpRight, Mail, Zap, Link2,
} from "lucide-react";

async function getDashboardStats() {
  const [
    postCount,
    publishedPostCount,
    productCount,
    subscriberCount,
    recentPosts,
    topPosts,
    affiliateStats,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.product.count({ where: { published: true } }),
    prisma.newsletterSubscriber.count(),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { author: { select: { name: true } } },
      select: {
        id: true, title: true, slug: true, published: true,
        createdAt: true, views: true, author: true,
      },
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { views: "desc" },
      take: 5,
      select: { id: true, title: true, slug: true, views: true },
    }),
    prisma.affiliateLink.aggregate({
      _sum: { clicks: true },
      _count: true,
    }),
  ]);

  return {
    postCount,
    publishedPostCount,
    productCount,
    subscriberCount,
    recentPosts,
    topPosts,
    totalAffiliateClicks: affiliateStats._sum.clicks || 0,
    affiliateLinkCount: affiliateStats._count,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: "Total Posts",
      value: stats.postCount,
      sub: `${stats.publishedPostCount} published`,
      icon: FileText,
      color: "blue",
      href: "/admin/posts",
    },
    {
      label: "Newsletter Subscribers",
      value: stats.subscriberCount.toLocaleString(),
      sub: "+0 this week",
      icon: Mail,
      color: "green",
      href: "/admin/subscribers",
    },
    {
      label: "Affiliate Clicks",
      value: stats.totalAffiliateClicks.toLocaleString(),
      sub: `${stats.affiliateLinkCount} active links`,
      icon: Link2,
      color: "purple",
      href: "/admin/affiliates",
    },
    {
      label: "Products",
      value: stats.productCount,
      sub: "Active listings",
      icon: Package,
      color: "orange",
      href: "/admin/products",
    },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-electric/15 border-blue-electric/25 text-blue-electric",
    green: "bg-green-500/15 border-green-500/25 text-green-400",
    purple: "bg-purple-500/15 border-purple-500/25 text-purple-400",
    orange: "bg-orange-500/15 border-orange-500/25 text-orange-400",
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/posts?action=new" className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="card card-glow p-5 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${colorMap[card.color]}`}>
                <card.icon className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </div>
            <p className="text-2xl font-bold font-display text-white">{card.value}</p>
            <p className="text-sm text-zinc-400 mt-0.5">{card.label}</p>
            <p className="text-xs text-zinc-600 mt-1">{card.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent posts */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Recent Posts</h2>
            <Link href="/admin/posts" className="text-xs text-blue-electric hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentPosts.length > 0 ? (
              stats.recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm text-zinc-200 truncate">{post.title}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`badge text-[10px] ${post.published ? "badge-green" : "bg-zinc-800 text-zinc-500 border-zinc-700"}`}>
                      {post.published ? "Live" : "Draft"}
                    </span>
                    <Link href={`/admin/posts/${post.id}/edit`} className="text-xs text-zinc-500 hover:text-white transition-colors">
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-500">No posts yet</p>
                <Link href="/admin/posts?action=new" className="btn-primary text-xs py-1.5 px-3 mt-3 inline-flex">
                  Create First Post
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Top posts by views */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-electric" />
              Top Posts
            </h2>
          </div>
          <div className="space-y-3">
            {stats.topPosts.length > 0 ? (
              stats.topPosts.map((post, idx) => (
                <div key={post.id} className="flex items-center gap-3 py-2 border-b border-zinc-800 last:border-0">
                  <span className="text-xl font-bold font-display text-zinc-700 w-6">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 truncate">{post.title}</p>
                    <p className="text-xs text-zinc-600 mt-0.5 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views.toLocaleString()} views
                    </p>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="text-xs text-zinc-500 hover:text-white transition-colors"
                  >
                    View →
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-500">No published posts yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 p-5 card">
        <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Write Post", href: "/admin/posts?action=new", icon: FileText },
            { label: "Add Product", href: "/admin/products?action=new", icon: Package },
            { label: "Add Tool", href: "/admin/tools?action=new", icon: Zap },
            { label: "View Site", href: "/", icon: ArrowUpRight },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              target={action.label === "View Site" ? "_blank" : undefined}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-400 hover:text-white hover:border-zinc-700 transition-all group"
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

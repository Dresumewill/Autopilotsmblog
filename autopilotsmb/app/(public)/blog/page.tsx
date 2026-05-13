// app/(public)/blog/page.tsx
// Blog listing with category/tag filtering, pagination, sidebar

import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";
import { NewsletterCTA } from "@/components/CTA";
import { Search, Tag } from "lucide-react";

export const metadata = buildMetadata({
  title: "AI Tools & Automation Blog",
  description:
    "Free guides, tutorials, and reviews on AI tools, automation workflows, and productivity strategies for small businesses and solopreneurs.",
  slug: "blog",
});

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    page?: string;
    q?: string;
  }>;
}

const POSTS_PER_PAGE = 9;

async function getPosts(params: {
  category?: string;
  tag?: string;
  page: number;
  q?: string;
}) {
  const { category, tag, page, q } = params;
  const skip = (page - 1) * POSTS_PER_PAGE;

  const where = {
    published: true,
    ...(category && { categories: { some: { slug: category } } }),
    ...(tag && { tags: { some: { slug: tag } } }),
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { excerpt: { contains: q, mode: "insensitive" as const } },
      ],
    }),
  };

  const [posts, total, categories, popularTags] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: POSTS_PER_PAGE,
      include: {
        author: { select: { name: true, image: true } },
        categories: { select: { name: true, slug: true } },
        tags: { select: { name: true, slug: true } },
      },
    }),
    prisma.post.count({ where }),
    prisma.category.findMany({
      include: { _count: { select: { posts: { where: { published: true } } } } },
      orderBy: { posts: { _count: "desc" } },
      take: 10,
    }),
    prisma.tag.findMany({
      include: { _count: { select: { posts: { where: { published: true } } } } },
      orderBy: { posts: { _count: "desc" } },
      take: 20,
    }),
  ]);

  return { posts, total, categories, popularTags };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const { posts, total, categories, popularTags } = await getPosts({
    category: params.category,
    tag: params.tag,
    page,
    q: params.q,
  });

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);
  const activeCategory = params.category;
  const activeTag = params.tag;

  // Static fallback categories when DB is empty
  const displayCategories = categories.length > 0 ? categories : [
    { id: "1", slug: "ai-tools", name: "AI Tools", _count: { posts: 24 } },
    { id: "2", slug: "automation", name: "Automation", _count: { posts: 18 } },
    { id: "3", slug: "marketing-ai", name: "Marketing AI", _count: { posts: 15 } },
    { id: "4", slug: "productivity", name: "Productivity", _count: { posts: 21 } },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="badge badge-blue mb-4">Free Guides & Tutorials</div>
        <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-3">
          {activeCategory
            ? `Category: ${categories.find((c) => c.slug === activeCategory)?.name || activeCategory}`
            : activeTag
            ? `Tag: ${activeTag}`
            : "AI Automation Blog"}
        </h1>
        <p className="text-zinc-400 text-lg">
          Practical guides for small businesses, solopreneurs, and agencies.
        </p>
      </div>

      {/* Top ad */}
      <AdSlot slot="blog-top" format="horizontal" className="mb-10" />

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/blog"
          className={`badge cursor-pointer transition-all ${
            !activeCategory && !activeTag
              ? "badge-blue"
              : "bg-zinc-800 text-zinc-400 hover:text-white border-zinc-700"
          }`}
        >
          All Posts ({total})
        </Link>
        {displayCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/blog?category=${cat.slug}`}
            className={`badge cursor-pointer transition-all ${
              activeCategory === cat.slug
                ? "badge-blue"
                : "bg-zinc-800 text-zinc-400 hover:text-white border-zinc-700"
            }`}
          >
            {cat.name} ({cat._count.posts})
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3">
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {posts.map((post, idx) => (
                  <div key={post.id}>
                    <PostCard post={post} />
                    {/* Inline ad every 6 posts */}
                    {(idx + 1) % 6 === 0 && idx < posts.length - 1 && (
                      <div className="sm:col-span-2 xl:col-span-3 my-4">
                        <AdSlot slot={`inline-${idx}`} format="horizontal" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {page > 1 && (
                    <Link
                      href={`/blog?page=${page - 1}${activeCategory ? `&category=${activeCategory}` : ""}${activeTag ? `&tag=${activeTag}` : ""}`}
                      className="btn-secondary text-sm py-2 px-4"
                    >
                      ← Previous
                    </Link>
                  )}
                  <span className="text-zinc-500 text-sm px-4">
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={`/blog?page=${page + 1}${activeCategory ? `&category=${activeCategory}` : ""}${activeTag ? `&tag=${activeTag}` : ""}`}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            // Empty state
            <div className="text-center py-20">
              <Tag className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
              <p className="text-zinc-500 mb-6">
                {params.q
                  ? `No results for "${params.q}"`
                  : "Posts will appear here once published."}
              </p>
              <Link href="/blog" className="btn-secondary text-sm">
                Clear filters
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Search */}
          <div className="card p-4">
            <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </h3>
            <form action="/blog" method="get">
              <input
                name="q"
                type="search"
                defaultValue={params.q}
                placeholder="Search articles..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-electric"
              />
            </form>
          </div>

          {/* Categories sidebar */}
          <div className="card p-4">
            <h3 className="font-semibold text-white text-sm mb-3">Categories</h3>
            <div className="space-y-1">
              {displayCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === cat.slug
                      ? "bg-blue-electric/15 text-blue-electric"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat.name}
                  <span className="text-xs text-zinc-600">{cat._count.posts}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Tags */}
          {popularTags.length > 0 && (
            <div className="card p-4">
              <h3 className="font-semibold text-white text-sm mb-3">Popular Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {popularTags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className={`badge text-[10px] cursor-pointer transition-all ${
                      activeTag === tag.slug
                        ? "badge-blue"
                        : "bg-zinc-800 text-zinc-500 hover:text-white border-zinc-700"
                    }`}
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Sidebar ad */}
          <AdSlot slot="sidebar-blog" format="vertical" label />

          {/* Newsletter inline */}
          <NewsletterCTA variant="inline" source="blog-sidebar" />
        </aside>
      </div>
    </div>
  );
}

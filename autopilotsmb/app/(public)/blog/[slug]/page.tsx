// app/(public)/blog/[slug]/page.tsx
// Individual blog post page
// Features: MDX rendering, TOC, schema markup, related posts, affiliate CTAs, ads

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { prisma } from "@/lib/prisma";
import { buildMetadata, blogPostSchema, breadcrumbSchema, faqSchema } from "@/lib/seo";
import PostCard from "@/components/PostCard";
import AffiliateBox from "@/components/AffiliateBox";
import AdSlot from "@/components/AdSlot";
import { NewsletterCTA } from "@/components/CTA";
import ShareSection from "@/components/ShareSection";
import {
  Clock, Calendar, Tag, ChevronRight, ArrowLeft
} from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// ── Static params for SSG ──────────────────────────────────────────────────────
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    slug: `blog/${post.slug}`,
    ogImage: post.ogImage || post.coverImage || undefined,
    type: "article",
  });
}

// ── Data ───────────────────────────────────────────────────────────────────────
async function getPost(slug: string) {
  return prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      author: { select: { name: true, image: true, email: true } },
      categories: { select: { id: true, name: true, slug: true } },
      tags: { select: { id: true, name: true, slug: true } },
    },
  });
}

async function getRelatedPosts(postId: string, categoryIds: string[]) {
  return prisma.post.findMany({
    where: {
      published: true,
      id: { not: postId },
      categories: { some: { id: { in: categoryIds } } },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { name: true, image: true } },
      categories: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
    },
  });
}

// ── Custom MDX components ─────────────────────────────────────────────────────
const mdxComponents = {
  // Styled headings
  h2: ({ children, ...props }: any) => (
    <h2 className="text-2xl font-bold font-display text-white mt-10 mb-4 scroll-mt-20" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-xl font-bold font-display text-white mt-8 mb-3 scroll-mt-20" {...props}>
      {children}
    </h3>
  ),
  // Callout blockquote
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-blue-electric bg-blue-electric/5 pl-5 py-3 pr-4 rounded-r-lg my-6 italic text-zinc-300">
      {children}
    </blockquote>
  ),
  // Code blocks
  pre: ({ children }: any) => (
    <pre className="bg-[#111113] border border-zinc-800 rounded-xl p-5 overflow-x-auto my-6 text-sm">
      {children}
    </pre>
  ),
  // Inline code
  code: ({ children, className }: any) => {
    if (!className) {
      return (
        <code className="bg-zinc-800 text-blue-glow px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      );
    }
    return <code className={className}>{children}</code>;
  },
  // Tables
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-left text-sm font-semibold text-white">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="border border-zinc-800 px-4 py-2.5 text-sm text-zinc-400">{children}</td>
  ),
  // Images
  img: ({ src, alt }: any) => (
    <div className="my-6 rounded-xl overflow-hidden border border-zinc-800">
      <img src={src} alt={alt} className="w-full h-auto" loading="lazy" />
      {alt && <p className="text-xs text-zinc-500 text-center py-2 px-4 bg-zinc-900">{alt}</p>}
    </div>
  ),
};

// ── Page ───────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(
    post.id,
    post.categories.map((c) => c.id)
  );

  // Increment view count (fire and forget)
  prisma.post
    .update({ where: { id: post.id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  const publishedAt = post.publishedAt || post.createdAt;
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const articleSchema = blogPostSchema({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    authorName: post.author.name || "AutoPilotSMB",
    publishedAt: publishedAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    image: post.ogImage || post.coverImage || undefined,
  });

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: process.env.NEXT_PUBLIC_SITE_URL || "" },
    { name: "Blog", url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog` },
    {
      name: post.title,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
    },
  ]);

  return (
    <>
      {/* JSON-LD schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-zinc-300 transition-colors">Blog</Link>
          {post.categories[0] && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link
                href={`/blog?category=${post.categories[0].slug}`}
                className="hover:text-zinc-300 transition-colors"
              >
                {post.categories[0].name}
              </Link>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── Main content ─────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            {/* Back button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>

            {/* Category */}
            {post.categories[0] && (
              <Link href={`/blog?category=${post.categories[0].slug}`}>
                <span className="badge badge-blue mb-4 inline-block">
                  {post.categories[0].name}
                </span>
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-zinc-800">
              {post.author && (
                <div className="flex items-center gap-2.5">
                  {post.author.image ? (
                    <Image
                      src={post.author.image}
                      alt={post.author.name || ""}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-electric/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-electric">
                        {post.author.name?.[0] || "A"}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-zinc-300">
                    {post.author.name}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1 text-sm text-zinc-500">
                <Calendar className="w-4 h-4" />
                <time dateTime={publishedAt.toISOString()}>{formattedDate}</time>
              </div>

              {post.readingTime && (
                <div className="flex items-center gap-1 text-sm text-zinc-500">
                  <Clock className="w-4 h-4" />
                  {post.readingTime} min read
                </div>
              )}

              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-zinc-600">{post.views} views</span>
              </div>
            </div>

            {/* Cover image */}
            {post.coverImage && (
              <div className="mb-8 rounded-2xl overflow-hidden border border-zinc-800 aspect-video relative">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Top ad */}
            <AdSlot slot="post-top" format="horizontal" className="mb-8" />

            {/* MDX Content */}
            <div className="prose prose-invert prose-blog max-w-none">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeHighlight, rehypeSlug],
                  },
                }}
              />
            </div>

            {/* Mid-content ad */}
            <AdSlot slot="post-mid" format="rectangle" className="my-10" />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-zinc-800">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-zinc-500" />
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/blog?tag=${tag.slug}`}
                      className="badge bg-zinc-800 text-zinc-400 hover:text-white border-zinc-700 transition-colors cursor-pointer"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share section */}
            <ShareSection title={post.title} slug={post.slug} />

            {/* Newsletter */}
            <div className="my-10">
              <NewsletterCTA source={`post-${post.slug}`} />
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold font-display text-white mb-6">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedPosts.map((rp) => (
                    <PostCard key={rp.id} post={rp} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Sticky wrapper */}
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Sidebar ad */}
              <AdSlot slot="post-sidebar" format="vertical" />

              {/* Featured affiliate */}
              <AffiliateBox
                id="featured-sidebar"
                name="Jasper AI"
                tagline="Write better content 10x faster with AI"
                url="https://www.jasper.ai?fpr=autopilotsmb"
                features={[
                  "50+ copywriting templates",
                  "SEO-optimized content",
                  "Brand voice training",
                ]}
                cta="Try Free for 7 Days"
                rating={4.8}
                priceLabel="From $39/mo"
                variant="sidebar"
              />

              {/* Newsletter inline */}
              <NewsletterCTA variant="inline" source="post-sidebar" />

              {/* Back to blog */}
              <Link href="/blog" className="btn-secondary w-full justify-center text-sm flex">
                ← More Articles
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}


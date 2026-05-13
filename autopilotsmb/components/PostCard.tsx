// components/PostCard.tsx
// Reusable blog post card — used in listing pages and homepage
// Supports featured (horizontal) and standard (vertical) layouts

import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, Tag } from "lucide-react";

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    coverImage?: string | null;
    publishedAt?: Date | string | null;
    readingTime?: number | null;
    categories?: { name: string; slug: string; color?: string | null }[];
    tags?: { name: string; slug: string }[];
    author?: {
      name?: string | null;
      image?: string | null;
    };
  };
  featured?: boolean;
  compact?: boolean;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PostCard({ post, featured = false, compact = false }: PostCardProps) {
  if (compact) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group flex gap-4 items-start py-4 border-b border-zinc-800 last:border-0 hover:border-zinc-700 transition-colors"
      >
        {post.coverImage && (
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-zinc-800">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={64}
              height={64}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white line-clamp-2 leading-snug">
            {post.title}
          </h3>
          {post.readingTime && (
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTime} min read
            </p>
          )}
        </div>
      </Link>
    );
  }

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group card card-glow overflow-hidden flex flex-col md:flex-row gap-0 h-full"
      >
        {/* Cover */}
        <div className="md:w-1/2 h-52 md:h-auto bg-zinc-800/50 relative overflow-hidden flex-shrink-0">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-electric/20 to-zinc-800 flex items-center justify-center">
              <Tag className="w-12 h-12 text-blue-electric/40" />
            </div>
          )}
          {/* Category badge */}
          {post.categories?.[0] && (
            <div className="absolute top-3 left-3">
              <span className="badge badge-blue">{post.categories[0].name}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            {post.publishedAt && (
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(post.publishedAt)}
              </span>
            )}
            {post.readingTime && (
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTime} min read
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-zinc-100 group-hover:text-white mb-3 line-clamp-2 leading-tight font-display">
            {post.title}
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          {/* Author */}
          {post.author && (
            <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center gap-2.5">
              {post.author.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name || "Author"}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-electric/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-electric">
                    {post.author.name?.[0] || "A"}
                  </span>
                </div>
              )}
              <span className="text-xs text-zinc-400">{post.author.name}</span>
              <span className="ml-auto text-xs text-blue-electric font-medium group-hover:underline">
                Read more →
              </span>
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Standard card
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group card card-glow overflow-hidden flex flex-col h-full"
    >
      {/* Cover */}
      <div className="h-44 bg-zinc-800/50 relative overflow-hidden flex-shrink-0">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-electric/15 to-zinc-900 flex items-center justify-center">
            <Tag className="w-10 h-10 text-blue-electric/30" />
          </div>
        )}
        {post.categories?.[0] && (
          <div className="absolute top-3 left-3">
            <span className="badge badge-blue">{post.categories[0].name}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-center gap-3 mb-2.5">
          {post.publishedAt && (
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.publishedAt)}
            </span>
          )}
          {post.readingTime && (
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readingTime} min
            </span>
          )}
        </div>

        <h3 className="font-bold text-zinc-100 group-hover:text-white mb-2 line-clamp-2 leading-snug font-display">
          {post.title}
        </h3>
        <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed flex-1">
          {post.excerpt}
        </p>

        <span className="mt-4 text-xs font-semibold text-blue-electric group-hover:gap-2 flex items-center gap-1 transition-all">
          Read article
          <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
        </span>
      </div>
    </Link>
  );
}

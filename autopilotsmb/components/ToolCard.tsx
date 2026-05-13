"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ExternalLink, Zap } from "lucide-react";

interface ToolCardProps {
  tool: {
    name: string;
    slug?: string;
    tagline: string;
    logoUrl?: string | null;
    website?: string;
    pricing: string;
    priceLabel?: string | null;
    rating?: number | null;
    reviewCount?: number;
    category?: { name: string; slug: string } | string | null;
    affiliateLinks?: { id: string; url: string }[];
  };
}

const pricingConfig: Record<string, { label: string; class: string }> = {
  FREE: { label: "Free", class: "badge-green" },
  FREEMIUM: { label: "Freemium", class: "badge-blue" },
  PAID: { label: "Paid", class: "badge-orange" },
  TRIAL: { label: "Free Trial", class: "badge-blue" },
};

export default function ToolCard({ tool }: ToolCardProps) {
  const pricing = pricingConfig[tool.pricing] || { label: tool.pricing, class: "badge-blue" };
  const rating = tool.rating ?? 0;

  const handleTryClick = () => {
    if (tool.affiliateLinks?.[0]?.id) {
      fetch(`/api/affiliate/track?id=${tool.affiliateLinks[0].id}`, { method: "POST" }).catch(() => {});
    }
  };

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
                {typeof tool.category === "string" ? tool.category : tool.category.name}
              </span>
            )}
          </div>
        </div>
        <span className={`badge ${pricing.class} flex-shrink-0`}>{pricing.label}</span>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed mb-4 flex-1">{tool.tagline}</p>

      {/* Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-zinc-700"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-white">{rating.toFixed(1)}</span>
          {tool.reviewCount && tool.reviewCount > 0 && (
            <span className="text-xs text-zinc-600">({tool.reviewCount.toLocaleString()})</span>
          )}
        </div>
        {tool.priceLabel && (
          <span className="text-xs text-zinc-500 font-mono">{tool.priceLabel}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <a
          href={tool.affiliateLinks?.[0]?.url || tool.website || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 btn-primary text-sm py-2 justify-center"
          onClick={handleTryClick}
        >
          Try Free
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        {tool.slug && (
          <Link href={`/tools/${tool.slug}`} className="btn-secondary text-sm py-2 px-3">
            Review
          </Link>
        )}
      </div>
    </div>
  );
}

// components/AffiliateBox.tsx
// Affiliate CTA boxes — inline and sidebar variants
// Tracks clicks via API, FTC-compliant disclosure included

"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Star, TrendingUp, Shield } from "lucide-react";

interface AffiliateBoxProps {
  id: string;           // affiliate link DB id (for tracking)
  name: string;         // tool name
  tagline: string;      // short pitch
  logoUrl?: string;     // tool logo
  url: string;          // the affiliate URL
  commission?: string;  // e.g. "Free trial available"
  rating?: number;
  features?: string[];
  cta?: string;
  variant?: "inline" | "sidebar" | "banner";
  priceLabel?: string;
}

export default function AffiliateBox({
  id,
  name,
  tagline,
  logoUrl,
  url,
  commission,
  rating,
  features = [],
  cta = "Try Free",
  variant = "inline",
  priceLabel,
}: AffiliateBoxProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = async () => {
    setClicked(true);
    // Fire-and-forget click tracking
    try {
      await fetch(`/api/affiliate/track?id=${id}`, { method: "POST" });
    } catch (e) {
      // Non-critical — don't block navigation
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (variant === "banner") {
    return (
      <div className="relative my-8 rounded-2xl border border-blue-electric/30 bg-gradient-to-r from-[#0066ff08] to-[#0066ff03] overflow-hidden">
        {/* Glow top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-electric/50 to-transparent" />

        <div className="flex flex-col sm:flex-row items-center gap-6 p-6">
          {logoUrl && (
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-zinc-800 overflow-hidden border border-zinc-700 flex items-center justify-center">
              <Image src={logoUrl} alt={name} width={56} height={56} className="object-contain p-1" />
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs text-zinc-500 mb-1 uppercase tracking-widest font-semibold">Sponsored Tool</p>
            <h3 className="text-lg font-bold text-white font-display">{name}</h3>
            <p className="text-zinc-400 text-sm mt-1">{tagline}</p>
          </div>
          {priceLabel && (
            <div className="text-center">
              <p className="text-xs text-zinc-500 mb-1">Starting at</p>
              <p className="text-xl font-bold text-white">{priceLabel}</p>
            </div>
          )}
          <button
            onClick={handleClick}
            className="btn-primary flex-shrink-0 flex items-center gap-2"
          >
            {cta}
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="rounded-xl border border-zinc-800 bg-[#111113] overflow-hidden">
        <div className="bg-gradient-to-b from-blue-electric/10 to-transparent p-4 border-b border-zinc-800">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Recommended Tool
          </p>
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0">
                <Image src={logoUrl} alt={name} width={40} height={40} className="object-contain p-1" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-blue-electric/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-blue-electric" />
              </div>
            )}
            <div>
              <h4 className="font-bold text-white text-sm">{name}</h4>
              {rating && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.round(rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-zinc-700"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-zinc-500 ml-1">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-zinc-400 mb-3">{tagline}</p>

          {features.length > 0 && (
            <ul className="space-y-1.5 mb-4">
              {features.map((f) => (
                <li key={f} className="text-xs text-zinc-500 flex items-start gap-2">
                  <Shield className="w-3 h-3 text-blue-electric mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          {priceLabel && (
            <p className="text-xs text-zinc-500 mb-3">
              Starting at{" "}
              <span className="text-white font-semibold">{priceLabel}</span>
            </p>
          )}

          <button
            onClick={handleClick}
            className="w-full btn-primary justify-center text-sm py-2.5"
          >
            {clicked ? "Opening..." : cta}
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <p className="text-[10px] text-zinc-600 mt-2 text-center">
            Affiliate link — we may earn a commission
          </p>
        </div>
      </div>
    );
  }

  // Default: inline
  return (
    <div className="my-6 rounded-xl border border-zinc-800 bg-[#111113] p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-3 flex-1">
        {logoUrl ? (
          <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0">
            <Image src={logoUrl} alt={name} width={40} height={40} className="object-contain p-1" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-blue-electric/15 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-blue-electric" />
          </div>
        )}
        <div>
          <p className="font-semibold text-white text-sm">{name}</p>
          <p className="text-xs text-zinc-500">{tagline}</p>
        </div>
      </div>

      {commission && (
        <span className="badge badge-green text-[10px]">{commission}</span>
      )}

      <button
        onClick={handleClick}
        className="btn-secondary text-sm py-2 px-4 flex-shrink-0 flex items-center gap-2"
      >
        {cta} <ExternalLink className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

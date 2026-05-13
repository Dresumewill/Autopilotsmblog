// components/CTA.tsx
// Reusable CTA sections: newsletter signup, product upsell, etc.

"use client";

import { useState } from "react";
import { Mail, Zap, ArrowRight, Check } from "lucide-react";

interface NewsletterCTAProps {
  variant?: "full" | "inline" | "sticky";
  title?: string;
  description?: string;
  source?: string; // tracking source
}

export function NewsletterCTA({
  variant = "full",
  title = "Get AI Automation Playbooks — Free",
  description = "Join 12,000+ small business owners getting weekly guides on AI tools, automation systems, and productivity strategies.",
  source = "homepage",
}: NewsletterCTAProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  if (variant === "inline") {
    return (
      <div className="rounded-xl border border-zinc-800 bg-[#111113] p-6">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-4 h-4 text-blue-electric" />
          <h3 className="font-bold text-white text-sm">{title}</h3>
        </div>
        <p className="text-zinc-500 text-xs mb-4 leading-relaxed">{description}</p>

        {status === "success" ? (
          <div className="flex items-center gap-2 text-sm text-green-400">
            <Check className="w-4 h-4" />
            You're in! Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-electric transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full btn-primary text-sm py-2.5 justify-center"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe Free"}
            </button>
            {status === "error" && (
              <p className="text-xs text-red-400">{errorMsg}</p>
            )}
          </form>
        )}
        <p className="text-[10px] text-zinc-600 mt-2">No spam. Unsubscribe anytime.</p>
      </div>
    );
  }

  // Full width variant
  return (
    <section
      id="newsletter"
      className="relative my-20 rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-[#0A0A0B] border border-zinc-800"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-electric/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-blue-electric/50 to-transparent" />

      <div className="relative z-10 max-w-2xl mx-auto text-center px-6 py-16">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-electric/15 border border-blue-electric/25 mb-6">
          <Zap className="w-7 h-7 text-blue-electric" />
        </div>

        <div className="badge badge-blue mb-4">Free Weekly Newsletter</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-4 leading-tight">
          {title}
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-8">{description}</p>

        {status === "success" ? (
          <div className="inline-flex items-center gap-3 bg-green-500/10 border border-green-500/25 rounded-xl px-6 py-4">
            <Check className="w-5 h-5 text-green-400" />
            <div className="text-left">
              <p className="font-semibold text-white text-sm">You're subscribed!</p>
              <p className="text-xs text-zinc-400">Check your inbox for a welcome email.</p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 bg-zinc-900/80 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-electric focus:ring-1 focus:ring-blue-electric/30 transition-all"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary whitespace-nowrap flex-shrink-0 group"
            >
              {status === "loading" ? (
                "Subscribing..."
              ) : (
                <>
                  Join Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-sm text-red-400 mt-2">{errorMsg}</p>
        )}

        <p className="text-zinc-600 text-xs mt-4">
          Join 12,000+ subscribers · No spam · Unsubscribe anytime
        </p>

        {/* Social proof */}
        <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
          {[
            { label: "Weekly guides", value: "52+" },
            { label: "AI tools reviewed", value: "200+" },
            { label: "Subscribers", value: "12k+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-bold text-white font-display">{stat.value}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Sticky CTA bar for blog posts ─────────────────────────────────────────────
export function StickyCTA({ title = "Get our Free AI Toolkit", href = "#newsletter" }: { title?: string; href?: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="bg-[#111113] border-t border-zinc-800 px-4 py-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-zinc-300 truncate">{title}</p>
        <a href={href} className="btn-primary text-xs py-2 px-4 flex-shrink-0">
          Get it Free
        </a>
      </div>
    </div>
  );
}

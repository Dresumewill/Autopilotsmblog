"use client";

import { Share2, Twitter, Linkedin, Link2 } from "lucide-react";

export default function ShareSection({ title, slug }: { title: string; slug: string }) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`;

  return (
    <div className="mt-10 pt-8 border-t border-zinc-800">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share this article
        </span>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs py-2 px-3 flex items-center gap-2"
        >
          <Twitter className="w-3.5 h-3.5" />
          Twitter
        </a>
        <a
          href={`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs py-2 px-3 flex items-center gap-2"
        >
          <Linkedin className="w-3.5 h-3.5" />
          LinkedIn
        </a>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
            } catch {}
          }}
          className="btn-secondary text-xs py-2 px-3 flex items-center gap-2"
        >
          <Link2 className="w-3.5 h-3.5" />
          Copy Link
        </button>
      </div>
    </div>
  );
}

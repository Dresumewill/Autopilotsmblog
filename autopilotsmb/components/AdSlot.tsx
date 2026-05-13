// components/AdSlot.tsx
// AdSense-ready ad placement component
// Renders actual ads in production, placeholder in development

"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  label?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdSlot({
  slot,
  format = "auto",
  className = "",
  label = true,
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (!adsenseId || isDev) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, [adsenseId, isDev]);

  // Dev/no-adsense placeholder
  if (!adsenseId || isDev) {
    const dimensions: Record<string, string> = {
      auto: "h-24",
      rectangle: "h-64",
      horizontal: "h-24",
      vertical: "h-[600px]",
    };

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <p className="text-[10px] text-zinc-600 text-center mb-1 uppercase tracking-widest">
            Advertisement
          </p>
        )}
        <div
          className={`w-full ${dimensions[format]} bg-zinc-900 border border-dashed border-zinc-800 rounded-lg flex items-center justify-center`}
        >
          <div className="text-center">
            <p className="text-xs text-zinc-600 font-mono">Ad Slot: {slot}</p>
            <p className="text-[10px] text-zinc-700">{format} format</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      {label && (
        <p className="text-[10px] text-zinc-600 text-center mb-1 uppercase tracking-widest">
          Advertisement
        </p>
      )}
      <ins
        ref={adRef}
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

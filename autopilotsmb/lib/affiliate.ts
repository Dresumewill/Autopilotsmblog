// lib/affiliate.ts
// Affiliate link tracking and management utilities
// Tracks clicks via API route, stores in DB for analytics

import { prisma } from "@/lib/prisma";

// ── Track a click ─────────────────────────────────────────────────────────────
export async function trackAffiliateClick(affiliateLinkId: string) {
  try {
    await prisma.affiliateLink.update({
      where: { id: affiliateLinkId },
      data: { clicks: { increment: 1 } },
    });
  } catch (error) {
    console.error("Failed to track affiliate click:", error);
  }
}

// ── Get all affiliate links for analytics ─────────────────────────────────────
export async function getAffiliateAnalytics() {
  return prisma.affiliateLink.findMany({
    include: { tool: { select: { name: true, slug: true } } },
    orderBy: { clicks: "desc" },
  });
}

// ── Recommended affiliate programs (static reference) ─────────────────────────
// These are the best AI tool affiliate programs for the niche
export const recommendedPrograms = [
  {
    tool: "Jasper AI",
    commission: "30% recurring",
    cookieDuration: "30 days",
    program: "Impact",
    notes: "High-ticket, great for content creators",
  },
  {
    tool: "Copy.ai",
    commission: "45% first year",
    cookieDuration: "60 days",
    program: "Direct",
    notes: "High conversion rate",
  },
  {
    tool: "Notion AI",
    commission: "$10 per referral",
    cookieDuration: "90 days",
    program: "Direct",
    notes: "Huge user base",
  },
  {
    tool: "Zapier",
    commission: "20% recurring for 1 year",
    cookieDuration: "30 days",
    program: "Impact",
    notes: "Automation — perfect for this audience",
  },
  {
    tool: "Semrush",
    commission: "$200 per sale",
    cookieDuration: "120 days",
    program: "Impact",
    notes: "High ticket, excellent for SEO content",
  },
  {
    tool: "Surfer SEO",
    commission: "25% recurring",
    cookieDuration: "60 days",
    program: "Direct",
    notes: "Strong conversion with tutorial content",
  },
];

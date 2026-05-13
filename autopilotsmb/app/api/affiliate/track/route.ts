import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ─── POST /api/affiliate/track ────────────────────────────────────────────────
// Records an affiliate link click and returns the destination URL

export async function POST(request: NextRequest) {
  let body: { linkId?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { linkId } = body;

  if (!linkId) {
    return NextResponse.json({ error: "linkId is required" }, { status: 400 });
  }

  try {
    // Atomically increment clicks and return the link
    const link = await prisma.affiliateLink.update({
      where: { id: linkId },
      data: { clicks: { increment: 1 } },
      select: { url: true, name: true },
    });

    return NextResponse.json({ url: link.url });
  } catch (error) {
    // If link not found, Prisma throws P2025
    const code = (error as { code?: string }).code;
    if (code === "P2025") {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }
    console.error("[POST /api/affiliate/track]", error);
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
  }
}

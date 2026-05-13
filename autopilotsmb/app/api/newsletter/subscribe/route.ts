import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const SubscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  source: z.string().max(100).optional().default("website"),
});

// Simple in-memory rate limiting (replace with Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60_000; // 1 minute
  const max = 3;

  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + window });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

// ─── POST /api/newsletter/subscribe ──────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = SubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 422 }
    );
  }

  const { email, source } = parsed.data;

  try {
    // Upsert — idempotent for existing subscribers
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {
        // Re-subscribe if they had unsubscribed
        active: true,
        source: source ?? "website",
      },
      create: {
        email,
        source: source ?? "website",
        active: true,
      },
    });

    const isNew = subscriber.createdAt.getTime() > Date.now() - 5000;

    // TODO: Send welcome email via your ESP (ConvertKit, Mailchimp, etc.)
    // await sendWelcomeEmail(email);

    return NextResponse.json({
      success: true,
      message: isNew
        ? "You're subscribed! Check your inbox for a welcome email."
        : "You're already subscribed. Thanks!",
    });
  } catch (error) {
    console.error("[POST /api/newsletter/subscribe]", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}

// ─── DELETE /api/newsletter/subscribe ────────────────────────────────────────
// Unsubscribe via email token (simplified — use signed tokens in production)

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  try {
    await prisma.newsletterSubscriber.updateMany({
      where: { email },
      data: { active: false },
    });
    return NextResponse.json({ success: true, message: "Unsubscribed successfully." });
  } catch (error) {
    console.error("[DELETE /api/newsletter/subscribe]", error);
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}

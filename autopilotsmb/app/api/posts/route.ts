import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

// ─── Validation Schema ────────────────────────────────────────────────────────

const PostCreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  coverImage: z.string().url().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).default([]),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  canonicalUrl: z.string().url().optional(),
});

// ─── GET /api/posts ───────────────────────────────────────────────────────────
// Returns paginated list of posts (public: only published; admin: all)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "10")));
  const category = searchParams.get("category") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const published = searchParams.get("published"); // null = only published, "all" = all (admin)
  const search = searchParams.get("q") ?? undefined;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: Record<string, unknown> = {};

  // Default to published only unless explicitly requesting all
  if (published !== "all") {
    where.published = true;
  }

  if (category) {
    where.categories = { some: { slug: category } };
  }

  if (tag) {
    where.tags = { some: { slug: tag } };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          published: true,
          featured: true,
          views: true,
          publishedAt: true,
          createdAt: true,
          category: { select: { id: true, name: true, slug: true } },
          tags: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true, image: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/posts]", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// ─── POST /api/posts ──────────────────────────────────────────────────────────
// Creates a new post (admin only)

export async function POST(request: NextRequest) {
  // Verify admin session
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PostCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const { tagIds, categoryId, ...data } = parsed.data;

  try {
    // Check slug uniqueness
    const existing = await prisma.post.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const post = await prisma.post.create({
      data: {
        ...data,
        publishedAt: data.published ? new Date() : null,
        authorId: session.user.id,
        ...(categoryId ? { categoryId } : {}),
        ...(tagIds.length > 0
          ? { tags: { connect: tagIds.map((id) => ({ id })) } }
          : {}),
      },
      include: {
        category: true,
        tags: true,
        author: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/posts]", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const PostUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1).optional(),
  coverImage: z.string().url().optional().nullable(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});

// ─── GET /api/posts/[id] ──────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        tags: true,
        author: { select: { id: true, name: true, image: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("[GET /api/posts/[id]]", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// ─── PATCH /api/posts/[id] ────────────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PostUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const { tagIds, categoryId, ...data } = parsed.data;

  try {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Auto-set publishedAt when first publishing
    const publishedAt =
      data.published && !existing.published ? new Date() : existing.publishedAt;

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...data,
        publishedAt,
        ...(categoryId !== undefined
          ? categoryId
            ? { categoryId }
            : { category: { disconnect: true } }
          : {}),
        ...(tagIds !== undefined
          ? { tags: { set: tagIds.map((tid) => ({ id: tid })) } }
          : {}),
      },
      include: { category: true, tags: true },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("[PATCH /api/posts/[id]]", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// ─── DELETE /api/posts/[id] ───────────────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/posts/[id]]", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

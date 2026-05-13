import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const ProductUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  type: z.enum(["EBOOK", "TEMPLATE", "COURSE", "TOOLKIT"]).optional(),
  price: z.number().int().min(0).optional(),
  currency: z.string().length(3).optional(),
  coverImage: z.string().url().optional().nullable(),
  stripeProductId: z.string().optional().nullable(),
  stripePriceId: z.string().optional().nullable(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = ProductUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 422 });

  try {
    const product = await prisma.product.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ product });
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "P2025") return NextResponse.json({ error: "Product not found" }, { status: 404 });
    console.error("[PATCH /api/products/[id]]", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "P2025") return NextResponse.json({ error: "Product not found" }, { status: 404 });
    console.error("[DELETE /api/products/[id]]", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

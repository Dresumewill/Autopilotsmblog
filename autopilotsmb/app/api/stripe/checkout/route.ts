import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

// ─── POST /api/stripe/checkout ────────────────────────────────────────────────
// Creates a Stripe Checkout session for a product

export async function POST(request: NextRequest) {
  let body: { productId?: string; email?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { productId, email } = body;

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.stripeProductId || !product.stripePriceId) {
      return NextResponse.json({ error: "Product not found or not configured" }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: product.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        productId: product.id,
        customerEmail: email ?? "",
      },
      customer_email: email || undefined,
      success_url: `${siteUrl}/resources?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/resources?canceled=1`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[POST /api/stripe/checkout]", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

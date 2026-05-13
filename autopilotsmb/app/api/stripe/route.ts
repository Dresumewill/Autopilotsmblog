import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// ─── POST /api/stripe ─────────────────────────────────────────────────────────
// Handles Stripe webhook events

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[Stripe webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ── Payment completed ──────────────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status === "paid") {
          await handleSuccessfulPayment(session);
        }
        break;
      }

      // ── Payment intent succeeded (for one-time payments) ──────────────────
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe] PaymentIntent succeeded: ${paymentIntent.id}`);
        break;
      }

      // ── Subscription events (future use) ──────────────────────────────────
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[Stripe] Subscription ${event.type}: ${subscription.id}`);
        break;
      }

      default:
        console.log(`[Stripe] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe webhook] Handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

// ─── Checkout session creator (called from client) ────────────────────────────
// Note: In production, create a separate /api/stripe/checkout route

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const { metadata } = session;

  if (!metadata?.productId || !metadata?.customerEmail) {
    console.warn("[Stripe] Missing metadata in checkout session:", session.id);
    return;
  }

  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: metadata.productId },
  });

  if (!product) {
    console.error("[Stripe] Product not found:", metadata.productId);
    return;
  }

  // Create order record
  await prisma.order.create({
    data: {
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent?.id ?? null),
      customerEmail: metadata.customerEmail,
      amount: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      status: "COMPLETED",
      productId: metadata.productId,
    },
  });

  // TODO: Send purchase confirmation email + download link
  // await sendPurchaseEmail(metadata.customerEmail, product);

  console.log(
    `[Stripe] Order created for ${metadata.customerEmail} — product: ${product.title}`
  );
}

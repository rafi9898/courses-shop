import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { sendOrderAccessEmail } from "@/lib/email/order-access-email";
import { savePaidOrderFromCheckoutSession } from "@/lib/orders";
import { sendTelegramOrderNotification } from "@/lib/telegram/order-notifications";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const order = await savePaidOrderFromCheckoutSession(session);
    await sendTelegramOrderNotification(order.id).catch((error) => {
      console.error("Telegram order notification failed", error);
    });
    await sendOrderAccessEmail(order.id);
  }

  return NextResponse.json({ received: true });
}

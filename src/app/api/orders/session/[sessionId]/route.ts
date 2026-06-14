import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { fulfillPaidOrder } from "@/lib/order-fulfillment";
import { orderAccessInclude, serializeOrderAccess } from "@/lib/order-access";
import { savePaidOrderFromCheckoutSession } from "@/lib/orders";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  {
    params
  }: {
    params: Promise<{ sessionId: string }>;
  }
) {
  const { sessionId } = await params;

  if (!isStripeCheckoutSessionId(sessionId)) {
    return NextResponse.json({ order: null }, { status: 404 });
  }

  try {
    let order = await prisma.order.findUnique({
      where: {
        stripeCheckoutSessionId: sessionId
      },
      include: orderAccessInclude
    });

    if (!order) {
      order = await savePaidTestOrderFromStripe(sessionId);

      if (!order) {
        return NextResponse.json({ order: null }, { status: 404 });
      }
    }

    await fulfillPaidOrder(order.id);

    order = await prisma.order.findUnique({
      where: {
        stripeCheckoutSessionId: sessionId
      },
      include: orderAccessInclude
    });

    if (!order) {
      return NextResponse.json({ order: null }, { status: 404 });
    }

    return NextResponse.json({
      order: await serializeOrderAccess(order)
    });
  } catch {
    return NextResponse.json({ error: "Order lookup is unavailable." }, { status: 503 });
  }
}

async function savePaidTestOrderFromStripe(sessionId: string) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (process.env.NODE_ENV === "production" || !stripeSecretKey?.startsWith("sk_test_")) {
    return null;
  }

  const stripe = new Stripe(stripeSecretKey);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return null;
  }

  await savePaidOrderFromCheckoutSession(session);

  return prisma.order.findUnique({
    where: {
      stripeCheckoutSessionId: sessionId
    },
    include: orderAccessInclude
  });
}

function isStripeCheckoutSessionId(sessionId: string) {
  return /^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId);
}

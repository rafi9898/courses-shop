import { NextResponse, type NextRequest } from "next/server";
import { orderAccessInclude, serializeOrderAccess } from "@/lib/order-access";
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

  try {
    const order = await prisma.order.findUnique({
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

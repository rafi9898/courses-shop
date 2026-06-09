import { NextResponse, type NextRequest } from "next/server";
import { orderAccessInclude, serializeOrderAccess } from "@/lib/order-access";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  {
    params
  }: {
    params: Promise<{ token: string }>;
  }
) {
  const { token } = await params;

  if (!isOrderAccessToken(token)) {
    return NextResponse.json({ order: null }, { status: 404 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: {
        accessToken: token
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

function isOrderAccessToken(token: string) {
  return /^[a-f0-9]{64}$/.test(token);
}

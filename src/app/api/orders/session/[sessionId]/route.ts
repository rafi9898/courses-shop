import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUdemyAccessLinks } from "@/lib/udemy-access";

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
      include: {
        items: true,
        invoice: true
      }
    });

    if (!order) {
      return NextResponse.json({ order: null }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        locale: order.locale,
        currency: order.currency,
        status: order.status,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount.toString(),
        customerEmail: order.customerEmail,
        accessEmailSentAt: order.accessEmailSentAt?.toISOString() ?? null,
        paidAt: order.paidAt?.toISOString() ?? null,
        invoice: order.invoice
          ? {
              invoiceNumber: order.invoice.invoiceNumber,
              status: order.invoice.status,
              buyerEmail: order.invoice.buyerEmail,
              issuedAt: order.invoice.issuedAt.toISOString(),
              pdfUrl: order.invoice.pdfUrl
            }
          : null,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productType: item.productType,
          title: item.title,
          quantity: item.quantity,
          unitAmount: item.unitAmount.toString(),
          lineTotalAmount: item.lineTotalAmount.toString()
        })),
        accessLinks: getUdemyAccessLinks(
          order.items.map((item) => ({
            productId: item.productId,
            productType: item.productType
          })),
          order.locale
        )
      }
    });
  } catch {
    return NextResponse.json({ error: "Order lookup is unavailable." }, { status: 503 });
  }
}

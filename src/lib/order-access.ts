import { type Prisma } from "@prisma/client";
import { getInvoiceDownloadPath } from "@/lib/routes";
import { getUdemyAccessLinks } from "@/lib/udemy-access";

export const orderAccessInclude = {
  items: true,
  invoice: true
} satisfies Prisma.OrderInclude;

type OrderAccessRecord = Prisma.OrderGetPayload<{
  include: typeof orderAccessInclude;
}>;

export async function serializeOrderAccess(order: OrderAccessRecord) {
  const accessLinks = await getUdemyAccessLinks(
    order.items.map((item) => ({
      productId: item.productId,
      productType: item.productType
    })),
    order.locale
  );

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    accessToken: order.accessToken,
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
          id: order.invoice.id,
          invoiceNumber: order.invoice.invoiceNumber,
          status: order.invoice.status,
          buyerEmail: order.invoice.buyerEmail,
          issuedAt: order.invoice.issuedAt.toISOString(),
          pdfUrl: order.invoice.pdfUrl ? getInvoiceDownloadPath(order.invoice.id, order.accessToken) : null
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
    accessLinks
  };
}

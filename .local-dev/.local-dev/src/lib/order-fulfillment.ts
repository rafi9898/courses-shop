import { PaymentStatus } from "@prisma/client";
import { sendOrderAccessEmail } from "@/lib/email/order-access-email";
import { ensureInvoicePdfForOrder } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { sendTelegramOrderNotification } from "@/lib/telegram/order-notifications";

type FulfillmentStatus = "completed" | "skipped" | "failed";

type FulfillmentResult = {
  invoicePdf: FulfillmentStatus;
  email: FulfillmentStatus;
  telegram: FulfillmentStatus;
};

export async function fulfillPaidOrder(orderId: string, options: { forceEmail?: boolean; forceTelegram?: boolean } = {}) {
  const result: FulfillmentResult = {
    invoicePdf: "skipped",
    email: "skipped",
    telegram: "skipped"
  };
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      paymentStatus: true
    }
  });

  if (!order || order.paymentStatus !== PaymentStatus.PAID) {
    return result;
  }

  try {
    await ensureInvoicePdfForOrder(order.id);
    result.invoicePdf = "completed";
  } catch (error) {
    result.invoicePdf = "failed";
    console.error("Invoice PDF generation failed", error);
  }

  try {
    await sendTelegramOrderNotification(order.id, { force: options.forceTelegram });
    result.telegram = "completed";
  } catch (error) {
    result.telegram = "failed";
    console.error("Telegram order notification failed", error);
  }

  const invoice = await prisma.invoice.findUnique({
    where: { orderId: order.id },
    select: { pdfUrl: true }
  });

  if (invoice && !invoice.pdfUrl) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        accessEmailError: "Invoice PDF is not available; e-mail was not sent."
      }
    });
    return result;
  }

  try {
    await sendOrderAccessEmail(order.id, { force: options.forceEmail });
    result.email = "completed";
  } catch (error) {
    result.email = "failed";
    console.error("Order access e-mail failed", error);
  }

  return result;
}

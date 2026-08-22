import fs from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getInvoicePdfPath } from "@/lib/invoices/pdf";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  {
    params
  }: {
    params: Promise<{ orderId: string }>;
  }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { orderId } = await params;
  const order = await prisma.order
    .findUnique({
      where: { id: orderId },
      select: {
        id: true,
        invoice: {
          select: {
            id: true,
            pdfUrl: true
          }
        }
      }
    })
    .catch(() => null);

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  await prisma.order.delete({ where: { id: orderId } });

  if (order.invoice?.pdfUrl) {
    await fs.unlink(getInvoicePdfPath(order.invoice.id)).catch(() => null);
  }

  revalidatePath("/admin");

  return NextResponse.json({ ok: true });
}


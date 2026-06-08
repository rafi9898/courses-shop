import fs from "node:fs/promises";
import { NextResponse, type NextRequest } from "next/server";
import { getInvoicePdfPath } from "@/lib/invoices/pdf";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  {
    params
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  const { invoiceId } = await params;
  const token = request.nextUrl.searchParams.get("token");
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      order: {
        select: {
          accessToken: true
        }
      }
    }
  });

  if (!invoice || !invoice.pdfUrl) {
    return NextResponse.json({ error: "Invoice PDF was not found." }, { status: 404 });
  }

  if (!token || token !== invoice.order.accessToken) {
    return NextResponse.json({ error: "Invoice PDF access denied." }, { status: 403 });
  }

  try {
    const file = await fs.readFile(getInvoicePdfPath(invoice.id));

    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoice.invoiceNumber.replaceAll("/", "-")}.pdf"`
      }
    });
  } catch {
    return NextResponse.json({ error: "Invoice PDF file is unavailable." }, { status: 404 });
  }
}

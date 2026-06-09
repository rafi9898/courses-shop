import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import PDFDocument from "pdfkit";
import { formatPrice, isLocale, type Locale } from "@/lib/i18n/config";

type InvoiceForPdf = {
  id: string;
  invoiceNumber: string;
  locale: string;
  currency: string;
  sellerName: string;
  sellerAddress: string;
  sellerTaxId: string | null;
  buyerName: string;
  buyerCompany: string | null;
  buyerEmail: string;
  buyerCountry: string;
  buyerTaxId: string | null;
  buyerAddressLine1: string;
  buyerPostalCode: string;
  buyerCity: string;
  subtotalAmount: { toString(): string };
  discountAmount: { toString(): string };
  totalAmount: { toString(): string };
  issuedAt: Date;
  order: {
    orderNumber: string;
    items: Array<{
      title: string;
      quantity: number;
      unitAmount: { toString(): string };
      lineTotalAmount: { toString(): string };
    }>;
  };
};

const invoiceDir = path.join(process.cwd(), "storage", "invoices");
const fallbackFontPaths = {
  regular: [
    process.env.INVOICE_FONT_REGULAR_PATH,
    "/usr/share/fonts/dejavu/DejaVuSans.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/Library/Fonts/Arial Unicode.ttf",
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
  ],
  bold: [process.env.INVOICE_FONT_BOLD_PATH, "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"]
};

export async function generateInvoicePdf(invoice: InvoiceForPdf) {
  await fs.mkdir(invoiceDir, { recursive: true });

  const filePath = getInvoicePdfPath(invoice.id);
  const buffer = await renderInvoicePdf(invoice);
  await fs.writeFile(filePath, buffer);

  return {
    filePath,
    pdfUrl: `/api/invoices/${invoice.id}/pdf`
  };
}

export function getInvoicePdfPath(invoiceId: string) {
  return path.join(invoiceDir, `${invoiceId}.pdf`);
}

function renderInvoicePdf(invoice: InvoiceForPdf) {
  const locale: Locale = isLocale(invoice.locale) ? invoice.locale : "pl";
  const labels = getLabels(locale);

  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    const chunks: Buffer[] = [];
    const fonts = registerInvoiceFonts(doc);

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.font(fonts.bold).fontSize(24).fillColor("#0f172a").text(labels.invoice, 48, 48);
    doc.font(fonts.regular).fontSize(10).fillColor("#475569").text(`${labels.invoiceNumber}: ${invoice.invoiceNumber}`, 48, 82);
    doc.text(`${labels.issuedAt}: ${formatDate(invoice.issuedAt, locale)}`, 48, 98);
    doc.text(`${labels.orderNumber}: ${invoice.order.orderNumber}`, 48, 114);

    doc.moveTo(48, 144).lineTo(547, 144).strokeColor("#e5e7eb").stroke();

    doc.font(fonts.bold).fontSize(12).fillColor("#0f172a").text(labels.seller, 48, 168);
    doc.font(fonts.regular).fontSize(10).fillColor("#475569").text(invoice.sellerName, 48, 188);
    doc.text(invoice.sellerAddress, 48, 204, { width: 220 });
    if (invoice.sellerTaxId) doc.text(`${labels.taxId}: ${invoice.sellerTaxId}`, 48, 236);

    doc.font(fonts.bold).fontSize(12).fillColor("#0f172a").text(labels.buyer, 310, 168);
    doc.font(fonts.regular).fontSize(10).fillColor("#475569").text(invoice.buyerCompany || invoice.buyerName, 310, 188);
    if (invoice.buyerCompany) doc.text(invoice.buyerName, 310, 204);
    doc.text(invoice.buyerAddressLine1, 310, invoice.buyerCompany ? 220 : 204);
    doc.text(`${invoice.buyerPostalCode} ${invoice.buyerCity}`, 310, invoice.buyerCompany ? 236 : 220);
    doc.text(invoice.buyerCountry, 310, invoice.buyerCompany ? 252 : 236);
    doc.text(invoice.buyerEmail, 310, invoice.buyerCompany ? 268 : 252);
    if (invoice.buyerTaxId) doc.text(`${labels.taxId}: ${invoice.buyerTaxId}`, 310, invoice.buyerCompany ? 284 : 268);

    const tableTop = 330;
    doc.roundedRect(48, tableTop, 499, 28, 6).fill("#f5f2ff");
    doc.fillColor("#4218ff").font(fonts.bold).fontSize(9);
    doc.text(labels.item, 62, tableTop + 10, { width: 230 });
    doc.text(labels.quantity, 314, tableTop + 10, { width: 50, align: "right" });
    doc.text(labels.unitPrice, 378, tableTop + 10, { width: 70, align: "right" });
    doc.text(labels.amount, 462, tableTop + 10, { width: 70, align: "right" });

    let y = tableTop + 44;
    doc.font(fonts.regular).fontSize(10).fillColor("#0f172a");
    invoice.order.items.forEach((item, index) => {
      if (y > 690) {
        doc.addPage();
        y = 64;
      }

      doc.text(`${index + 1}. ${item.title}`, 62, y, { width: 230 });
      doc.text(String(item.quantity), 314, y, { width: 50, align: "right" });
      doc.text(formatPrice(Number(item.unitAmount), locale), 378, y, { width: 70, align: "right" });
      doc.text(formatPrice(Number(item.lineTotalAmount), locale), 462, y, { width: 70, align: "right" });
      doc.moveTo(62, y + 22).lineTo(532, y + 22).strokeColor("#eef2f7").stroke();
      y += 34;
    });

    y += 18;
    drawTotalRow(doc, fonts, labels.subtotal, formatPrice(Number(invoice.subtotalAmount), locale), y);
    y += 22;
    drawTotalRow(doc, fonts, labels.discount, `-${formatPrice(Number(invoice.discountAmount), locale)}`, y);
    y += 28;
    doc.font(fonts.bold).fontSize(14).fillColor("#4218ff");
    doc.text(labels.total, 350, y, { width: 90, align: "right" });
    doc.text(formatPrice(Number(invoice.totalAmount), locale), 442, y, { width: 90, align: "right" });

    doc.font(fonts.regular).fontSize(9).fillColor("#64748b").text(labels.footer, 48, 760, { width: 499, align: "center" });
    doc.end();
  });
}

function registerInvoiceFonts(doc: PDFKit.PDFDocument) {
  const regularPath = findExistingFontPath(fallbackFontPaths.regular);
  const boldPath = findExistingFontPath(fallbackFontPaths.bold) ?? regularPath;

  if (!regularPath) {
    return {
      regular: "Helvetica",
      bold: "Helvetica-Bold"
    };
  }

  doc.registerFont("InvoiceRegular", regularPath);
  doc.registerFont("InvoiceBold", boldPath ?? regularPath);

  return {
    regular: "InvoiceRegular",
    bold: "InvoiceBold"
  };
}

function findExistingFontPath(paths: Array<string | undefined>) {
  return paths.find((fontPath): fontPath is string => {
    if (!fontPath) return false;
    return fsSync.existsSync(fontPath);
  });
}

function drawTotalRow(doc: PDFKit.PDFDocument, fonts: { regular: string; bold: string }, label: string, value: string, y: number) {
  doc.font(fonts.regular).fontSize(10).fillColor("#475569");
  doc.text(label, 350, y, { width: 90, align: "right" });
  doc.font(fonts.bold).fillColor("#0f172a").text(value, 442, y, { width: 90, align: "right" });
}

function getLabels(locale: Locale) {
  const labels = {
    pl: {
      invoice: "Faktura",
      invoiceNumber: "Numer faktury",
      issuedAt: "Data wystawienia",
      orderNumber: "Numer zamówienia",
      seller: "Sprzedawca",
      buyer: "Nabywca",
      taxId: "NIP/VAT ID",
      item: "Pozycja",
      quantity: "Ilość",
      unitPrice: "Cena",
      amount: "Wartość",
      subtotal: "Wartość produktów",
      discount: "Rabat",
      total: "Suma",
      footer: "Faktura wygenerowana automatycznie."
    },
    de: {
      invoice: "Rechnung",
      invoiceNumber: "Rechnungsnummer",
      issuedAt: "Ausstellungsdatum",
      orderNumber: "Bestellnummer",
      seller: "Verkäufer",
      buyer: "Käufer",
      taxId: "USt-IdNr.",
      item: "Position",
      quantity: "Menge",
      unitPrice: "Preis",
      amount: "Betrag",
      subtotal: "Zwischensumme",
      discount: "Rabatt",
      total: "Summe",
      footer: "Rechnung automatisch generiert."
    },
    en: {
      invoice: "Invoice",
      invoiceNumber: "Invoice number",
      issuedAt: "Issue date",
      orderNumber: "Order number",
      seller: "Seller",
      buyer: "Buyer",
      taxId: "Tax/VAT ID",
      item: "Item",
      quantity: "Qty",
      unitPrice: "Price",
      amount: "Amount",
      subtotal: "Subtotal",
      discount: "Discount",
      total: "Total",
      footer: "Invoice generated automatically."
    }
  };

  return labels[locale];
}

function formatDate(value: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "pl" ? "pl-PL" : locale === "de" ? "de-DE" : "en-US", {
    dateStyle: "medium"
  }).format(value);
}

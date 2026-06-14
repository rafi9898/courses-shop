import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import { InvoiceStatus, PaymentStatus, Prisma, ProductType } from "@prisma/client";
import Stripe from "stripe";
import { getPublicCatalog } from "@/lib/catalog-data";
import { buildCustomBundlePricingCourses, normalizeCustomBundleCourseIds } from "@/lib/custom-bundle";
import { getActiveDiscountCodes, getDiscountCodeForFulfillment } from "@/lib/discount-code-data";
import { calculateCartTotals, getDiscountedUnitAmount } from "@/lib/discounts";
import { isLocale, localeMeta, type Locale } from "@/lib/i18n/config";
import { parseInvoiceData } from "@/lib/invoice";
import { generateInvoicePdf, getInvoicePdfPath } from "@/lib/invoices/pdf";
import { type Product } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

export async function savePaidOrderFromCheckoutSession(session: Stripe.Checkout.Session) {
  const locale = parseSessionLocale(session);
  const productKeys = parseProductKeys(session.metadata?.product_keys);
  const customBundleCourseIds = parseCustomBundleCourseIds(session.metadata?.custom_bundle_course_ids);
  const discountCode = session.metadata?.discount_code || null;
  const catalog = await getPublicCatalog(locale);

  // For fulfillment, we fetch the specific code from metadata if it exists,
  // bypassing the "active" filter (which might hide codes that just reached their limit).
  const discounts = await getActiveDiscountCodes();
  const discountPool = [...discounts];

  if (discountCode && !discountPool.some((d) => d.code === discountCode.toUpperCase())) {
    const forcedDiscount = await getDiscountCodeForFulfillment(discountCode);
    if (forcedDiscount) {
      discountPool.push(forcedDiscount);
    }
  }

  const products: Product[] = [...catalog.courses, ...catalog.bundles];
  const customBundleCourseIdSet = new Set(customBundleCourseIds);
  const regularProductKeys = productKeys.filter((item) => !(item.productType === "course" && customBundleCourseIdSet.has(item.productId)));
  const regularOrderProducts = regularProductKeys
    .map((item) => products.find((product) => product.id === item.productId && product.type === item.productType))
    .filter((product): product is Product => Boolean(product));
  const normalCourseIds = regularProductKeys.filter((item) => item.productType === "course").map((item) => item.productId);
  const customBundle = buildCustomBundlePricingCourses(catalog.courses, locale, customBundleCourseIds, normalCourseIds);
  const orderProducts = [...regularOrderProducts, ...customBundle.courses];

  if (orderProducts.length === 0 || orderProducts.length !== productKeys.length) {
    throw new Error(`Cannot save order for checkout session ${session.id}: invalid products.`);
  }

  if (customBundleCourseIds.length > 0 && customBundle.courses.length < 2) {
    throw new Error(`Cannot save order for checkout session ${session.id}: invalid custom bundle.`);
  }

  const totals = calculateCartTotals(orderProducts, locale, discountCode, discountPool);
  const paymentIntentId = getStripeId(session.payment_intent);
  const customerEmail = session.customer_details?.email ?? session.customer_email ?? null;
  const customerName = session.customer_details?.name ?? null;
  const paidAt = session.created ? new Date(session.created * 1000) : new Date();
  const existingOrder = await prisma.order.findUnique({
    where: {
      stripeCheckoutSessionId: session.id
    },
    select: {
      id: true
    }
  });

  const order = await prisma.order.upsert({
    where: {
      stripeCheckoutSessionId: session.id
    },
    update: {
      status: "PAID",
      paymentStatus: PaymentStatus.PAID,
      stripePaymentIntentId: paymentIntentId,
      customerEmail,
      customerName,
      paidAt
    },
    create: {
      orderNumber: createOrderNumber(),
      accessToken: createOrderAccessToken(),
      locale,
      currency: localeMeta[locale].currency,
      status: "PAID",
      paymentStatus: PaymentStatus.PAID,
      regularTotalAmount: toDecimalInput(totals.regularTotal),
      subtotalAmount: toDecimalInput(totals.subtotal),
      discountCode: totals.discount?.code ?? null,
      discountAmount: toDecimalInput(totals.discountAmount),
      totalAmount: toDecimalInput(totals.total),
      customerEmail,
      customerName,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
      paidAt,
      items: {
        create: orderProducts.map((product) => {
          const unitAmount = getDiscountedUnitAmount({ id: product.id, type: product.type, price: product.price[locale] }, discountCode, discountPool);

          return {
            productId: product.id,
            productType: product.type === "course" ? ProductType.COURSE : ProductType.BUNDLE,
            title: product.title[locale],
            quantity: 1,
            regularUnitAmount: toDecimalInput(product.regularPrice[locale]),
            unitAmount: toDecimalInput(unitAmount),
            lineTotalAmount: toDecimalInput(unitAmount)
          };
        })
      }
    },
    include: {
      items: true
    }
  });

  if (totals.discount && !existingOrder) {
    await prisma.discountCode.update({
      where: { code: totals.discount.code },
      data: { usedCount: { increment: 1 } }
    }).catch((error) => {
      console.error(`Failed to increment usedCount for discount code ${totals.discount?.code}:`, error);
    });
  }

  if (session.metadata?.invoice_requested === "true") {
    await createInvoiceForOrder(order.id, session);
  }

  return prisma.order.findUniqueOrThrow({
    where: { id: order.id },
    include: {
      items: true
    }
  });
}

async function createInvoiceForOrder(orderId: string, session: Stripe.Checkout.Session) {
  const invoiceData = parseInvoiceData({
    buyerName: session.metadata?.invoice_buyer_name,
    buyerCompany: session.metadata?.invoice_buyer_company,
    buyerEmail: session.metadata?.invoice_buyer_email,
    buyerCountry: session.metadata?.invoice_buyer_country,
    buyerTaxId: session.metadata?.invoice_buyer_tax_id,
    buyerAddressLine1: session.metadata?.invoice_buyer_address_line1,
    buyerPostalCode: session.metadata?.invoice_buyer_postal_code,
    buyerCity: session.metadata?.invoice_buyer_city
  });

  if (!invoiceData) {
    throw new Error(`Cannot create invoice for checkout session ${session.id}: invalid invoice data.`);
  }

  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId }
  });

  let invoice = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      invoice = await prisma.invoice.upsert({
        where: { orderId },
        update: {
          buyerName: invoiceData.buyerName,
          buyerCompany: invoiceData.buyerCompany || null,
          buyerEmail: invoiceData.buyerEmail,
          buyerCountry: invoiceData.buyerCountry,
          buyerTaxId: invoiceData.buyerTaxId || null,
          buyerAddressLine1: invoiceData.buyerAddressLine1,
          buyerPostalCode: invoiceData.buyerPostalCode,
          buyerCity: invoiceData.buyerCity,
          subtotalAmount: order.subtotalAmount,
          discountAmount: order.discountAmount,
          totalAmount: order.totalAmount
        },
        create: {
          orderId,
          invoiceNumber: await createInvoiceNumber(attempt),
          status: InvoiceStatus.ISSUED,
          locale: order.locale,
          currency: order.currency,
          sellerName: process.env.SELLER_NAME || "PROJECT_NAME",
          sellerAddress: process.env.SELLER_ADDRESS || "Seller address not configured",
          sellerTaxId: process.env.SELLER_TAX_ID || null,
          buyerName: invoiceData.buyerName,
          buyerCompany: invoiceData.buyerCompany || null,
          buyerEmail: invoiceData.buyerEmail,
          buyerCountry: invoiceData.buyerCountry,
          buyerTaxId: invoiceData.buyerTaxId || null,
          buyerAddressLine1: invoiceData.buyerAddressLine1,
          buyerPostalCode: invoiceData.buyerPostalCode,
          buyerCity: invoiceData.buyerCity,
          subtotalAmount: order.subtotalAmount,
          discountAmount: order.discountAmount,
          totalAmount: order.totalAmount
        }
      });
      break;
    } catch (error) {
      const isInvoiceNumberCollision =
        error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" && String(error.meta?.target).includes("invoiceNumber");

      if (!isInvoiceNumberCollision || attempt === 4) {
        throw error;
      }
    }
  }

  if (!invoice) {
    throw new Error(`Cannot create invoice for checkout session ${session.id}: invoice number generation failed.`);
  }

  const invoiceForPdf = await prisma.invoice.findUniqueOrThrow({
    where: { id: invoice.id },
    include: {
      order: {
        include: {
          items: true
        }
      }
    }
  });
  const pdf = await generateInvoicePdf(invoiceForPdf);

  await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      pdfUrl: pdf.pdfUrl
    }
  });
}

export async function ensureInvoicePdfForOrder(orderId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { orderId },
    include: {
      order: {
        include: {
          items: true
        }
      }
    }
  });

  if (!invoice) {
    return null;
  }

  if (invoice.pdfUrl) {
    try {
      await fs.access(getInvoicePdfPath(invoice.id));
      return invoice;
    } catch {
      // The database has a PDF URL, but the file is missing. Regenerate it below.
    }
  }

  const pdf = await generateInvoicePdf(invoice);

  return prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      pdfUrl: pdf.pdfUrl
    }
  });
}

function parseSessionLocale(session: Stripe.Checkout.Session): Locale {
  const locale = session.metadata?.locale;

  if (!locale || !isLocale(locale)) {
    throw new Error(`Cannot save order for checkout session ${session.id}: invalid locale.`);
  }

  return locale;
}

function parseProductKeys(productKeys?: string | null) {
  if (!productKeys) return [];

  return productKeys
    .split(",")
    .map((key) => {
      const [productType, productId] = key.split(":");
      if ((productType !== "course" && productType !== "bundle") || !productId) return null;

      return {
        productType,
        productId
      };
    })
    .filter((item): item is { productType: Product["type"]; productId: string } => Boolean(item));
}

function parseCustomBundleCourseIds(value?: string | null) {
  if (!value) return [];
  return normalizeCustomBundleCourseIds(value.split(","));
}

function getStripeId(value: string | Stripe.PaymentIntent | null) {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

function toDecimalInput(value: number) {
  return new Prisma.Decimal(value.toFixed(2));
}

function createOrderNumber() {
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${timestamp}-${suffix}`;
}

function createOrderAccessToken() {
  return randomBytes(32).toString("hex");
}

async function createInvoiceNumber(sequenceOffset = 0) {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const periodStart = new Date(year, date.getMonth(), 1);
  const periodEnd = new Date(year, date.getMonth() + 1, 1);
  const invoicesThisMonth = await prisma.invoice.count({
    where: {
      issuedAt: {
        gte: periodStart,
        lt: periodEnd
      }
    }
  });
  const sequence = String(invoicesThisMonth + 1 + sequenceOffset).padStart(3, "0");

  return `FV/${year}/${month}/${sequence}`;
}

import { InvoiceStatus, PaymentStatus, Prisma, ProductType } from "@prisma/client";
import Stripe from "stripe";
import { calculateCartTotals, getDiscountedUnitAmount } from "@/lib/discounts";
import { isLocale, localeMeta, type Locale } from "@/lib/i18n/config";
import { parseInvoiceData } from "@/lib/invoice";
import { bundles, courses, type Product } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

const products: Product[] = [...courses, ...bundles];

export async function savePaidOrderFromCheckoutSession(session: Stripe.Checkout.Session) {
  const locale = parseSessionLocale(session);
  const productKeys = parseProductKeys(session.metadata?.product_keys);
  const discountCode = session.metadata?.discount_code || null;
  const orderProducts = productKeys
    .map((item) => products.find((product) => product.id === item.productId && product.type === item.productType))
    .filter((product): product is Product => Boolean(product));

  if (orderProducts.length === 0 || orderProducts.length !== productKeys.length) {
    throw new Error(`Cannot save order for checkout session ${session.id}: invalid products.`);
  }

  const totals = calculateCartTotals(orderProducts, locale, discountCode);
  const paymentIntentId = getStripeId(session.payment_intent);
  const customerEmail = session.customer_details?.email ?? session.customer_email ?? null;
  const customerName = session.customer_details?.name ?? null;
  const paidAt = session.created ? new Date(session.created * 1000) : new Date();

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
          const unitAmount = getDiscountedUnitAmount(product.price[locale], discountCode);

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

  await createInvoiceForOrder(order.id, session);

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

  await prisma.invoice.upsert({
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
      invoiceNumber: createInvoiceNumber(),
      status: InvoiceStatus.DRAFT,
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

function createInvoiceNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `FV/${year}/${month}/${suffix}`;
}

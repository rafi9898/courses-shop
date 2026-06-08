import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { type CheckoutCartItemInput, getCartItemKey } from "@/lib/cart";
import { getPublicCatalog } from "@/lib/catalog-data";
import { calculateCartTotals, getDiscount, getDiscountedUnitAmount } from "@/lib/discounts";
import { isLocale, localeMeta } from "@/lib/i18n/config";
import { parseInvoiceData } from "@/lib/invoice";
import { type Product } from "@/lib/mock-data";
import { getCheckoutCancelPath, getCheckoutSuccessPath } from "@/lib/routes";

type CheckoutRequestBody = {
  locale?: unknown;
  items?: unknown;
  discountCode?: unknown;
  invoiceRequested?: unknown;
  invoiceData?: unknown;
};

export async function POST(request: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as CheckoutRequestBody | null;
  const locale = typeof body?.locale === "string" && isLocale(body.locale) ? body.locale : null;
  const items = parseItems(body?.items);
  const discountCode = typeof body?.discountCode === "string" && getDiscount(body.discountCode) ? getDiscount(body.discountCode)?.code : null;
  const invoiceRequested = body?.invoiceRequested === true;
  const invoiceData = invoiceRequested ? parseInvoiceData(body?.invoiceData) : null;

  if (!locale || items.length === 0 || (invoiceRequested && !invoiceData)) {
    return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
  }

  const catalog = await getPublicCatalog(locale);
  const products: Product[] = [...catalog.courses, ...catalog.bundles];
  const checkoutProducts = items
    .map((item) => products.find((product) => product.type === item.productType && product.id === item.productId))
    .filter((product): product is Product => Boolean(product));

  if (checkoutProducts.length !== items.length) {
    return NextResponse.json({ error: "One or more products are unavailable." }, { status: 400 });
  }

  const totals = calculateCartTotals(checkoutProducts, locale, discountCode);
  const stripe = new Stripe(stripeSecretKey);
  const origin = getAppOrigin(request);
  const successUrl = `${origin}${getCheckoutSuccessPath(locale)}?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}${getCheckoutCancelPath(locale)}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    billing_address_collection: "auto",
    customer_creation: "if_required",
    customer_email: invoiceData?.buyerEmail,
    metadata: {
      locale,
      currency: localeMeta[locale].currency,
      discount_code: discountCode ?? "",
      product_keys: items.map(getCartItemKey).join(","),
      product_count: String(items.length),
      regular_total: String(totals.regularTotal),
      subtotal: String(totals.subtotal),
      discount_amount: String(totals.discountAmount),
      total: String(totals.total),
      invoice_requested: invoiceRequested ? "true" : "false",
      invoice_buyer_name: invoiceData?.buyerName ?? "",
      invoice_buyer_company: invoiceData?.buyerCompany ?? "",
      invoice_buyer_email: invoiceData?.buyerEmail ?? "",
      invoice_buyer_country: invoiceData?.buyerCountry ?? "",
      invoice_buyer_tax_id: invoiceData?.buyerTaxId ?? "",
      invoice_buyer_address_line1: invoiceData?.buyerAddressLine1 ?? "",
      invoice_buyer_postal_code: invoiceData?.buyerPostalCode ?? "",
      invoice_buyer_city: invoiceData?.buyerCity ?? ""
    },
    line_items: checkoutProducts.map((product) => ({
      quantity: 1,
      price_data: {
        currency: localeMeta[locale].currency.toLowerCase(),
        unit_amount: toStripeAmount(getDiscountedUnitAmount(product.price[locale], discountCode)),
        product_data: {
          name: product.title[locale],
          metadata: {
            product_id: product.id,
            product_type: product.type,
            locale
          }
        }
      }
    }))
  });

  return NextResponse.json({ url: session.url });
}

function parseItems(items: unknown): CheckoutCartItemInput[] {
  if (!Array.isArray(items)) return [];

  const uniqueItems = new Map<string, CheckoutCartItemInput>();

  for (const item of items) {
    if (!isCheckoutItem(item)) continue;
    uniqueItems.set(getCartItemKey(item), item);
  }

  return Array.from(uniqueItems.values());
}

function isCheckoutItem(item: unknown): item is CheckoutCartItemInput {
  if (!item || typeof item !== "object") return false;

  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.productId === "string" &&
    (candidate.productType === "course" || candidate.productType === "bundle")
  );
}

function toStripeAmount(amount: number) {
  return Math.round(amount * 100);
}

function getAppOrigin(request: NextRequest) {
  const requestOrigin = request.headers.get("origin");
  if (requestOrigin) return requestOrigin;

  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return "http://localhost:3000";
}

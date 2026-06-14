import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { type CheckoutCartItemInput, getCartItemKey } from "@/lib/cart";
import { getPublicCatalog } from "@/lib/catalog-data";
import { buildCustomBundlePricingCourses, normalizeCustomBundleCourseIds } from "@/lib/custom-bundle";
import { getActiveDiscountCodes } from "@/lib/discount-code-data";
import { calculateCartTotals, getDiscount, getDiscountedUnitAmount } from "@/lib/discounts";
import { isLocale, localeMeta } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { parseInvoiceData } from "@/lib/invoice";
import { type Product } from "@/lib/mock-data";
import { getCheckoutCancelPath, getCheckoutSuccessPath } from "@/lib/routes";

type CheckoutRequestBody = {
  locale?: unknown;
  items?: unknown;
  customBundleCourseIds?: unknown;
  discountCode?: unknown;
  customerEmail?: unknown;
  utmSource?: unknown;
  invoiceRequested?: unknown;
  invoiceData?: unknown;
  termsAccepted?: unknown;
};

export async function POST(request: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripeConfigError = getStripeConfigError(stripeSecretKey);

  if (!stripeSecretKey || stripeConfigError) {
    return NextResponse.json({ error: stripeConfigError }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as CheckoutRequestBody | null;
  const locale = typeof body?.locale === "string" && isLocale(body.locale) ? body.locale : null;
  const items = parseItems(body?.items);
  const customBundleCourseIds = parseCustomBundleCourseIds(body?.customBundleCourseIds);
  const customerEmail = parseEmail(body?.customerEmail);
  const utmSource = typeof body?.utmSource === "string" ? body.utmSource : null;
  const invoiceRequested = body?.invoiceRequested === true;
  const invoiceData = invoiceRequested ? parseInvoiceData(body?.invoiceData) : null;
  const termsAccepted = body?.termsAccepted === true;

  if (!locale || (items.length === 0 && customBundleCourseIds.length === 0) || !customerEmail || (invoiceRequested && !invoiceData)) {
    return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
  }

  if (!termsAccepted) {
    return NextResponse.json({ error: getDictionary(locale).checkoutPage.termsRequired }, { status: 400 });
  }

  const catalog = await getPublicCatalog(locale);
  const discounts = await getActiveDiscountCodes();
  const discountPool = discounts.length > 0 ? discounts : undefined;
  const discountCode = typeof body?.discountCode === "string" && getDiscount(body.discountCode, discountPool) ? getDiscount(body.discountCode, discountPool)?.code : null;

  const products: Product[] = [...catalog.courses, ...catalog.bundles];
  const checkoutProducts = items
    .map((item) => products.find((product) => product.type === item.productType && product.id === item.productId))
    .filter((product): product is Product => Boolean(product));
  const normalCourseIds = items.filter((item) => item.productType === "course").map((item) => item.productId);
  const customBundle = buildCustomBundlePricingCourses(catalog.courses, locale, customBundleCourseIds, normalCourseIds);

  if (checkoutProducts.length !== items.length) {
    return NextResponse.json({ error: "One or more products are unavailable." }, { status: 400 });
  }

  if (customBundleCourseIds.length > 0 && customBundle.courses.length < 2) {
    return NextResponse.json({ error: "Custom bundle requires at least two available courses." }, { status: 400 });
  }

  const checkoutPricingProducts = [...checkoutProducts, ...customBundle.courses];
  const totals = calculateCartTotals(checkoutPricingProducts, locale, discountCode, discountPool);
  const stripe = new Stripe(stripeSecretKey);
  const origin = getAppOrigin(request);
  const successUrl = `${origin}${getCheckoutSuccessPath(locale)}?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}${getCheckoutCancelPath(locale)}`;

  const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ["card", "paypal", "klarna"];
  if (locale === "pl") {
    paymentMethodTypes.push("blik", "p24");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: paymentMethodTypes,
    success_url: successUrl,
    cancel_url: cancelUrl,
    billing_address_collection: "auto",
    customer_creation: "if_required",
    customer_email: customerEmail,
    metadata: {
      locale,
      currency: localeMeta[locale].currency,
      customer_email: customerEmail,
      discount_code: discountCode ?? "",
      product_keys: checkoutPricingProducts.map((product) => getCartItemKey({ productId: product.id, productType: product.type })).join(","),
      product_count: String(checkoutPricingProducts.length),
      custom_bundle_course_ids: customBundle.courses.length > 0 ? customBundle.courseIds.join(",") : "",
      custom_bundle_discount_percent: String(customBundle.discountPercent),
      regular_total: String(totals.regularTotal),
      subtotal: String(totals.subtotal),
      discount_amount: String(totals.discountAmount),
      total: String(totals.total),
      utm_source: utmSource ?? "",
      invoice_requested: invoiceRequested ? "true" : "false",
      terms_accepted: "true",
      invoice_buyer_name: invoiceData?.buyerName ?? "",
      invoice_buyer_company: invoiceData?.buyerCompany ?? "",
      invoice_buyer_email: invoiceData?.buyerEmail ?? "",
      invoice_buyer_country: invoiceData?.buyerCountry ?? "",
      invoice_buyer_tax_id: invoiceData?.buyerTaxId ?? "",
      invoice_buyer_address_line1: invoiceData?.buyerAddressLine1 ?? "",
      invoice_buyer_postal_code: invoiceData?.buyerPostalCode ?? "",
      invoice_buyer_city: invoiceData?.buyerCity ?? ""
    },
    line_items: checkoutPricingProducts.map((product) => ({
      quantity: 1,
      price_data: {
        currency: localeMeta[locale].currency.toLowerCase(),
        unit_amount: toStripeAmount(getDiscountedUnitAmount({ id: product.id, type: product.type, price: product.price[locale] }, discountCode, discountPool)),
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

function getStripeConfigError(stripeSecretKey?: string) {
  if (!stripeSecretKey) return "Stripe is not configured.";

  const isTestKey = stripeSecretKey.startsWith("sk_test_") || stripeSecretKey.startsWith("rk_test_");
  const isLiveKey = stripeSecretKey.startsWith("sk_live_") || stripeSecretKey.startsWith("rk_live_");

  if (process.env.NODE_ENV !== "production" && !isTestKey) {
    return isLiveKey
      ? "Local Stripe checkout is blocked for live keys. Use STRIPE_SECRET_KEY=sk_test_... in .env."
      : "Local Stripe checkout requires a Stripe test secret key: STRIPE_SECRET_KEY=sk_test_...";
  }

  return null;
}

function parseCustomBundleCourseIds(value: unknown) {
  if (!Array.isArray(value)) return [];

  return normalizeCustomBundleCourseIds(
    value
      .slice(0, 50)
      .filter((item): item is string => typeof item === "string")
  );
}

function parseEmail(value: unknown) {
  if (typeof value !== "string") return null;

  const email = value.trim().slice(0, 254).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function parseItems(items: unknown): CheckoutCartItemInput[] {
  if (!Array.isArray(items)) return [];

  const uniqueItems = new Map<string, CheckoutCartItemInput>();

  for (const item of items.slice(0, 50)) {
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
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (configuredOrigin) return configuredOrigin.replace(/\/$/, "");

  const requestOrigin = request.headers.get("origin");
  if (process.env.NODE_ENV !== "production" && requestOrigin) return requestOrigin;
  return "http://localhost:3000";
}

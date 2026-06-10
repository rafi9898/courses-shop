"use client";

import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { StripeCheckoutButton } from "@/components/checkout/stripe-checkout-button";
import { useCart } from "@/components/cart/cart-provider";
import { CustomBundleCard } from "@/components/commerce/custom-bundle-card";
import { Thumbnail } from "@/components/commerce/product-card";
import { ButtonLink } from "@/components/ui/button";
import { type CheckoutCartItemInput } from "@/lib/cart";
import { summarizeCustomBundle } from "@/lib/custom-bundle";
import { calculateCartTotals } from "@/lib/discounts";
import { formatPrice, type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { emptyInvoiceData, isInvoiceDataComplete, type InvoiceData } from "@/lib/invoice";
import { type Bundle, type Course, type Product } from "@/lib/mock-data";
import { getBundlePath, getCoursePath } from "@/lib/routes";

export function CheckoutPage({
  locale,
  dictionary,
  courses,
  bundles
}: {
  locale: Locale;
  dictionary: Dictionary;
  courses: Course[];
  bundles: Bundle[];
}) {
  const { items, customBundleCourseIds, hydrated, removeItem, clearCustomBundle, appliedDiscountCode, discounts } = useCart();
  const [customerEmail, setCustomerEmail] = useState("");
  const [invoiceRequested, setInvoiceRequested] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(emptyInvoiceData);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const products: Product[] = useMemo(() => [...courses, ...bundles], [bundles, courses]);
  const discountPool = discounts.length > 0 ? discounts : undefined;
  const checkoutProducts = items
    .map((item) => products.find((product) => product.id === item.productId && product.type === item.productType))
    .filter((product): product is Product => Boolean(product));
  const normalCartCourseIds = items.filter((item) => item.productType === "course").map((item) => item.productId);
  const customBundleSummary = summarizeCustomBundle(courses, locale, customBundleCourseIds, normalCartCourseIds);
  const customBundleProducts = customBundleSummary.courses.length >= 2 ? customBundleSummary.courses : [];
  const pricingProducts = [...checkoutProducts, ...customBundleProducts];

  useEffect(() => {
    if (!hydrated) return;

    items.forEach((item) => {
      const exists = products.some((product) => product.id === item.productId && product.type === item.productType);

      if (!exists) {
        removeItem(item.productType, item.productId);
      }
    });
  }, [hydrated, items, products, removeItem]);

  const checkoutItems: CheckoutCartItemInput[] = checkoutProducts.map((product) => ({
    productId: product.id,
    productType: product.type
  }));
  const totals = calculateCartTotals(pricingProducts, locale, appliedDiscountCode, discountPool);
  const customerEmailComplete = isEmailLike(customerEmail);
  const invoiceComplete = !invoiceRequested || isInvoiceDataComplete(invoiceData);
  const checkoutReady = customerEmailComplete && invoiceComplete && termsAccepted;

  return (
    <div className="bg-gradient-to-b from-white to-[#fbfaff]">
      <section className="border-b border-border/70 bg-white">
        <div className="container-shell py-9 lg:py-12">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-primary">
              {dictionary.catalog.breadcrumbsHome}
            </Link>
            <span aria-hidden="true">›</span>
            <Link href={dictionary.routes.cart} className="hover:text-primary">
              {dictionary.cartPage.title}
            </Link>
            <span aria-hidden="true">›</span>
            <span className="font-semibold text-foreground">{dictionary.checkoutPage.title}</span>
          </nav>
          <h1 className="text-4xl font-black leading-tight tracking-normal sm:text-5xl">{dictionary.checkoutPage.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{dictionary.checkoutPage.lead}</p>
        </div>
      </section>

      <section className="container-shell py-10 lg:py-14">
        {!hydrated ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-sm font-semibold text-slate-600 shadow-soft">
            {dictionary.cartPage.loading}
          </div>
        ) : pricingProducts.length === 0 ? (
          <EmptyCheckout dictionary={dictionary} />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black">{dictionary.checkoutPage.selectedProducts}</h2>
                <ButtonLink href={dictionary.routes.cart} variant="ghost" className="h-10 px-0 text-slate-600 hover:bg-transparent">
                  <ArrowLeft className="h-4 w-4" />
                  {dictionary.checkoutPage.backToCart}
                </ButtonLink>
              </div>
              <div className="space-y-4">
                {customBundleProducts.length > 0 ? (
                  <CustomBundleCard
                    courseIds={customBundleSummary.courseIds}
                    courses={courses}
                    locale={locale}
                    dictionary={dictionary}
                    onRemove={clearCustomBundle}
                  />
                ) : null}
                {checkoutProducts.map((product) => (
                  <CheckoutProductRow key={`${product.type}:${product.id}`} product={product} locale={locale} dictionary={dictionary} />
                ))}
              </div>
              <ContactDetailsForm customerEmail={customerEmail} onCustomerEmailChange={setCustomerEmail} dictionary={dictionary} />
              <InvoiceDetailsForm
                invoiceData={invoiceData}
                invoiceRequested={invoiceRequested}
                onInvoiceRequestedChange={setInvoiceRequested}
                onChange={setInvoiceData}
                dictionary={dictionary}
              />
            </div>

            <aside className="rounded-2xl border border-border bg-white p-6 shadow-card lg:sticky lg:top-24">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Lock className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-2xl font-black">{dictionary.cartPage.summary}</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{dictionary.checkoutPage.stripeNote}</p>
                </div>
              </div>
              <dl className="mt-6 space-y-4 text-sm">
                <SummaryRow label={dictionary.cartPage.regularTotal} value={formatPrice(totals.regularTotal, locale)} muted />
                <SummaryRow label={dictionary.cartPage.subtotal} value={formatPrice(totals.subtotal, locale)} />
                <SummaryRow label={dictionary.cartPage.savings} value={formatPrice(totals.saleSavings, locale)} accent />
                {totals.discount ? (
                  <SummaryRow label={`${dictionary.cartPage.discount} (${totals.discount.code})`} value={`-${formatPrice(totals.discountAmount, locale)}`} accent />
                ) : null}
              </dl>
              <div className="mt-6 border-t border-border pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-base font-black">{dictionary.cartPage.total}</span>
                  <span className="text-2xl font-black">{formatPrice(totals.total, locale)}</span>
                </div>
              </div>
              <div className="mt-6">
                <LegalAcceptance
                  dictionary={dictionary}
                  accepted={termsAccepted}
                  onAcceptedChange={setTermsAccepted}
                />
                <StripeCheckoutButton
                  locale={locale}
                  items={checkoutItems}
                  customBundleCourseIds={customBundleProducts.length > 0 ? customBundleSummary.courseIds : []}
                  dictionary={dictionary}
                  discountCode={appliedDiscountCode}
                  customerEmail={customerEmail}
                  invoiceRequested={invoiceRequested}
                  invoiceData={invoiceData}
                  termsAccepted={termsAccepted}
                  disabled={!checkoutReady}
                />
                {!customerEmailComplete ? <p className="mt-3 text-sm font-semibold text-slate-500">{dictionary.checkoutPage.customerEmailRequired}</p> : null}
                {!invoiceComplete ? <p className="mt-3 text-sm font-semibold text-slate-500">{dictionary.checkoutPage.invoiceRequired}</p> : null}
                {!termsAccepted ? <p className="mt-3 text-sm font-semibold text-slate-500">{dictionary.checkoutPage.termsRequired}</p> : null}
              </div>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

function LegalAcceptance({
  dictionary,
  accepted,
  onAcceptedChange
}: {
  dictionary: Dictionary;
  accepted: boolean;
  onAcceptedChange: (value: boolean) => void;
}) {
  return (
    <div className="mb-5 rounded-xl border border-border bg-slate-50 p-4">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={accepted}
          required
          onChange={(event) => onAcceptedChange(event.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 rounded border-border text-primary"
        />
        <span className="text-sm font-semibold leading-6 text-slate-700">
          {dictionary.checkoutPage.termsBeforeLink}
          <Link href={dictionary.routes.terms} className="text-primary underline-offset-4 hover:underline">
            {dictionary.checkoutPage.termsLinkLabel}
          </Link>
          {dictionary.checkoutPage.termsAfterLink}
        </span>
      </label>
      <p className="mt-3 pl-8 text-xs leading-5 text-slate-500">
        {dictionary.checkoutPage.privacyBeforeLink}
        <Link href={dictionary.routes.privacy} className="font-semibold text-primary underline-offset-4 hover:underline">
          {dictionary.checkoutPage.privacyLinkLabel}
        </Link>
        {dictionary.checkoutPage.privacyAfterLink}
      </p>
    </div>
  );
}

function ContactDetailsForm({
  customerEmail,
  onCustomerEmailChange,
  dictionary
}: {
  customerEmail: string;
  onCustomerEmailChange: (value: string) => void;
  dictionary: Dictionary;
}) {
  return (
    <section className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
      <div>
        <h2 className="text-xl font-black">{dictionary.checkoutPage.customerEmailTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{dictionary.checkoutPage.customerEmailLead}</p>
      </div>
      <div className="mt-5 max-w-xl">
        <TextField label={dictionary.checkoutPage.customerEmail} value={customerEmail} onChange={onCustomerEmailChange} type="email" required />
      </div>
    </section>
  );
}

function InvoiceDetailsForm({
  invoiceData,
  invoiceRequested,
  onInvoiceRequestedChange,
  onChange,
  dictionary
}: {
  invoiceData: InvoiceData;
  invoiceRequested: boolean;
  onInvoiceRequestedChange: (value: boolean) => void;
  onChange: (invoiceData: InvoiceData) => void;
  dictionary: Dictionary;
}) {
  function updateField(field: keyof InvoiceData, value: string) {
    onChange({ ...invoiceData, [field]: value });
  }

  return (
    <section className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={invoiceRequested}
          onChange={(event) => onInvoiceRequestedChange(event.target.checked)}
          className="mt-1 h-5 w-5 rounded border-border text-primary"
        />
        <span>
          <span className="block text-2xl font-black">{dictionary.checkoutPage.invoiceToggle}</span>
          <span className="mt-2 block text-sm leading-6 text-slate-600">{dictionary.checkoutPage.invoiceToggleText}</span>
        </span>
      </label>
      {invoiceRequested ? (
        <>
          <div className="mt-6 border-t border-border pt-6">
            <h2 className="text-xl font-black">{dictionary.checkoutPage.invoiceTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{dictionary.checkoutPage.invoiceLead}</p>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <TextField label={dictionary.checkoutPage.buyerName} value={invoiceData.buyerName} onChange={(value) => updateField("buyerName", value)} required />
            <TextField label={dictionary.checkoutPage.buyerCompany} value={invoiceData.buyerCompany} onChange={(value) => updateField("buyerCompany", value)} optionalLabel={dictionary.checkoutPage.optional} />
            <TextField label={dictionary.checkoutPage.buyerEmail} value={invoiceData.buyerEmail} onChange={(value) => updateField("buyerEmail", value)} type="email" required />
            <TextField label={dictionary.checkoutPage.buyerCountry} value={invoiceData.buyerCountry} onChange={(value) => updateField("buyerCountry", value)} required />
            <TextField label={dictionary.checkoutPage.buyerTaxId} value={invoiceData.buyerTaxId} onChange={(value) => updateField("buyerTaxId", value)} optionalLabel={dictionary.checkoutPage.optional} />
            <TextField label={dictionary.checkoutPage.buyerCity} value={invoiceData.buyerCity} onChange={(value) => updateField("buyerCity", value)} required />
            <TextField label={dictionary.checkoutPage.buyerAddressLine1} value={invoiceData.buyerAddressLine1} onChange={(value) => updateField("buyerAddressLine1", value)} required />
            <TextField label={dictionary.checkoutPage.buyerPostalCode} value={invoiceData.buyerPostalCode} onChange={(value) => updateField("buyerPostalCode", value)} required />
          </div>
        </>
      ) : null}
    </section>
  );
}

function isEmailLike(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  optionalLabel
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  optionalLabel?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black">
        {label}
        {required ? <span className="text-primary"> *</span> : null}
        {!required && optionalLabel ? <span className="ml-1 text-xs font-semibold text-slate-500">({optionalLabel})</span> : null}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring mt-2 h-12 w-full rounded-[10px] border border-border bg-white px-4 text-sm font-semibold outline-none"
      />
    </label>
  );
}

function EmptyCheckout({ dictionary }: { dictionary: Dictionary }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-white p-8 text-center shadow-card">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary">
        <CreditCard className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-2xl font-black">{dictionary.checkoutPage.emptyTitle}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{dictionary.checkoutPage.emptyText}</p>
      <ButtonLink href={dictionary.routes.cart} className="mt-6">
        <ArrowLeft className="h-4 w-4" />
        {dictionary.checkoutPage.backToCart}
      </ButtonLink>
    </div>
  );
}

function CheckoutProductRow({
  product,
  locale,
  dictionary
}: {
  product: Product;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const href = product.type === "course" ? getCoursePath(product, locale) : getBundlePath(product, locale);
  const typeLabel = product.type === "course" ? dictionary.cartPage.course : dictionary.cartPage.bundle;

  return (
    <article className="grid gap-4 rounded-2xl border border-border bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)] sm:grid-cols-[130px_1fr_auto] sm:items-center">
      <Link href={href} aria-label={product.title[locale]} className="overflow-hidden rounded-xl">
        <Thumbnail
          title={product.thumbnail.title}
          subtitle={product.thumbnail.subtitle}
          variant={product.thumbnail.variant}
          hideText={product.type === "bundle"}
          imageUrl={product.thumbnailImageUrl}
          badge={typeLabel}
          showFavorite={false}
        />
      </Link>
      <div className="min-w-0">
        <span className="text-xs font-black uppercase text-primary">{typeLabel}</span>
        <h3 className="mt-2 text-lg font-black leading-6">
          <Link href={href} className="hover:text-primary">
            {product.title[locale]}
          </Link>
        </h3>
      </div>
      <div className="flex items-end justify-between gap-4 sm:block sm:text-right">
        <span className="text-sm text-muted-foreground line-through">{formatPrice(product.regularPrice[locale], locale)}</span>
        <div className="mt-1 text-xl font-black">{formatPrice(product.price[locale], locale)}</div>
      </div>
    </article>
  );
}

function SummaryRow({
  label,
  value,
  muted = false,
  accent = false
}: {
  label: string;
  value: string;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className={muted ? "text-muted-foreground" : "text-slate-600"}>{label}</dt>
      <dd className={accent ? "font-black text-primary" : "font-black"}>{value}</dd>
    </div>
  );
}

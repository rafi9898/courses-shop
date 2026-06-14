"use client";

import { ArrowLeft, CreditCard, Info, KeyRound, Mail, PackageCheck, ShieldCheck, Trash2, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { AddToCartButton } from "@/components/commerce/add-to-cart-button";
import { CustomBundleCard } from "@/components/commerce/custom-bundle-card";
import { Thumbnail } from "@/components/commerce/product-card";
import { calculateCartTotals } from "@/lib/discounts";
import { summarizeCustomBundle } from "@/lib/custom-bundle";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { formatPrice, type Locale } from "@/lib/i18n/config";
import { type Bundle, type Category, type Course, type Product } from "@/lib/mock-data";
import { getBundlePath, getCoursePath } from "@/lib/routes";

export function CartPage({
  locale,
  dictionary,
  categories,
  courses,
  bundles
}: {
  locale: Locale;
  dictionary: Dictionary;
  categories: Category[];
  courses: Course[];
  bundles: Bundle[];
}) {
  const { items, customBundleCourseIds, hydrated, removeItem, clearCustomBundle, clearCart, appliedDiscountCode, discounts } = useCart();
  const products: Product[] = useMemo(() => [...courses, ...bundles], [bundles, courses]);
  const discountPool = discounts.length > 0 ? discounts : undefined;
  const cartProducts = items
    .map((item) => products.find((product) => product.id === item.productId && product.type === item.productType))
    .filter((product): product is Product => Boolean(product));
  const normalCartCourseIds = items.filter((item) => item.productType === "course").map((item) => item.productId);
  const customBundleSummary = summarizeCustomBundle(courses, locale, customBundleCourseIds, normalCartCourseIds);
  const customBundleProducts = customBundleSummary.courses.length >= 2 ? customBundleSummary.courses : [];
  const pricingProducts = [...cartProducts, ...customBundleProducts];
  const cartEntryCount = cartProducts.length + (customBundleProducts.length > 0 ? 1 : 0);

  useEffect(() => {
    if (!hydrated) return;

    items.forEach((item) => {
      const exists = products.some((product) => product.id === item.productId && product.type === item.productType);

      if (!exists) {
        removeItem(item.productType, item.productId);
      }
    });
  }, [hydrated, items, products, removeItem]);

  const totals = calculateCartTotals(pricingProducts, locale, appliedDiscountCode, discountPool);
  const selectedProductKeys = new Set(pricingProducts.map((product) => `${product.type}:${product.id}`));
  const recommendedProducts = products
    .filter((product) => !selectedProductKeys.has(`${product.type}:${product.id}`))
    .slice(0, 2);

  return (
    <div className="bg-gradient-to-b from-white to-[#fbfaff]">
      <section className="border-b border-border/70 bg-white">
        <div className="container-shell py-9 lg:py-12">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-primary">
              {dictionary.catalog.breadcrumbsHome}
            </Link>
            <span aria-hidden="true">›</span>
            <span className="font-semibold text-foreground">{dictionary.cartPage.title}</span>
          </nav>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-black leading-tight tracking-normal sm:text-5xl">{dictionary.cartPage.title}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{dictionary.cartPage.lead}</p>
            </div>
            {pricingProducts.length > 0 ? (
              <span className="inline-flex w-fit rounded-full bg-primary-soft px-4 py-2 text-sm font-black text-primary">
                {dictionary.cartPage.itemCount.replace("{count}", String(cartEntryCount))}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container-shell py-10 lg:py-14">
        {!hydrated ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-sm font-semibold text-slate-600 shadow-soft">
            {dictionary.cartPage.loading}
          </div>
        ) : pricingProducts.length === 0 ? (
          <EmptyCart dictionary={dictionary} />
        ) : (
          <>
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
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
                {cartProducts.map((product) => (
                  <CartProductRow
                    key={`${product.type}:${product.id}`}
                    product={product}
                    locale={locale}
                    dictionary={dictionary}
                    categories={categories}
                    onRemove={() => removeItem(product.type, product.id)}
                  />
                ))}
                <div className="rounded-2xl border border-border bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
                  <DiscountForm dictionary={dictionary} />
                  <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <ButtonLink href={dictionary.routes.courses} variant="ghost" className="h-10 justify-start px-0 text-primary hover:bg-transparent">
                      <ArrowLeft className="h-4 w-4" />
                      {dictionary.cartPage.continueShopping}
                    </ButtonLink>
                    <Button variant="ghost" className="h-10 justify-start px-0 text-slate-600 hover:bg-transparent" onClick={clearCart}>
                      <Trash2 className="h-4 w-4" />
                      {dictionary.cartPage.clearCart}
                    </Button>
                  </div>
                </div>
              </div>

              <aside className="rounded-2xl border border-border bg-white p-6 shadow-card lg:sticky lg:top-24">
                <h2 className="text-2xl font-black">{dictionary.cartPage.summary}</h2>
                <dl className="mt-6 space-y-4 text-sm">
                  <SummaryRow label={dictionary.cartPage.productCount} value={String(cartEntryCount)} />
                  <SummaryRow label={dictionary.cartPage.regularTotal} value={formatPrice(totals.regularTotal, locale)} muted />
                  <SummaryRow label={dictionary.cartPage.subtotal} value={formatPrice(totals.subtotal, locale)} />
                  <SummaryRow
                    label={totals.discount ? `${dictionary.cartPage.discount} (${totals.discount.code})` : dictionary.cartPage.discount}
                    value={totals.discountAmount > 0 ? `-${formatPrice(totals.discountAmount, locale)}` : formatPrice(0, locale)}
                    accent={totals.discountAmount > 0}
                  />
                </dl>
                <div className="mt-6 border-t border-border pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-base font-black">{dictionary.cartPage.total}</span>
                    <span className="text-2xl font-black text-primary">{formatPrice(totals.total, locale)}</span>
                  </div>
                </div>
                <ButtonLink href={dictionary.routes.checkout} className="mt-6 w-full">
                  <CreditCard className="h-5 w-5" />
                  {dictionary.cartPage.checkout}
                </ButtonLink>
                <AccessBenefits dictionary={dictionary} />
              </aside>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-primary/10 bg-primary-soft p-5 text-sm leading-6 text-slate-700">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p>{dictionary.cartPage.udemyEmailInfo}</p>
            </div>

            {recommendedProducts.length > 0 ? (
              <section className="mt-9">
                <h2 className="text-2xl font-black">{dictionary.cartPage.recommendedTitle}</h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {recommendedProducts.map((product) => (
                    <RecommendedProductCard key={`${product.type}:${product.id}`} product={product} locale={locale} dictionary={dictionary} categories={categories} />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}

function EmptyCart({ dictionary }: { dictionary: Dictionary }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-white p-8 text-center shadow-card">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary">
        <CreditCard className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-2xl font-black">{dictionary.cartPage.emptyTitle}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{dictionary.cartPage.emptyText}</p>
      <ButtonLink href={dictionary.routes.courses} className="mt-6">
        <ArrowLeft className="h-4 w-4" />
        {dictionary.cartPage.continueShopping}
      </ButtonLink>
    </div>
  );
}

function CartProductRow({
  product,
  locale,
  dictionary,
  categories,
  onRemove
}: {
  product: Product;
  locale: Locale;
  dictionary: Dictionary;
  categories: Category[];
  onRemove: () => void;
}) {
  const href = product.type === "course" ? getCoursePath(product, locale) : getBundlePath(product, locale);
  const typeLabel = product.type === "course" ? dictionary.cartPage.course : dictionary.cartPage.bundle;
  const category = categories.find((item) => item.id === product.categoryId);
  const discountPercent = Math.round(((product.regularPrice[locale] - product.price[locale]) / product.regularPrice[locale]) * 100);

  return (
    <article className="grid gap-5 rounded-2xl border border-border bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)] sm:grid-cols-[190px_1fr_auto] sm:items-center">
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
        <h2 className="text-xl font-black leading-6">
          <Link href={href} className="hover:text-primary">
            {product.title[locale]}
          </Link>
        </h2>
        <span className="mt-3 block text-sm font-bold text-primary">{category?.label[locale] ?? typeLabel}</span>
        <div className="mt-5 grid gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            {dictionary.cartPage.onlineAccess}
          </span>
          <span className="inline-flex items-center gap-2">
            <PackageCheck className="h-4 w-4 text-primary" />
            {dictionary.cartPage.digitalProduct}
          </span>
        </div>
        <button
          type="button"
          className="focus-ring mt-3 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-500 transition hover:text-primary"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
          {dictionary.cartPage.remove}
        </button>
      </div>
      <div className="flex items-end justify-between gap-4 sm:block sm:text-right">
        <div>
          <div className="text-2xl font-black">{formatPrice(product.price[locale], locale)}</div>
          <div className="mt-2 flex items-center gap-2 sm:justify-end">
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.regularPrice[locale], locale)}</span>
            <span className="rounded-full bg-primary-soft px-2 py-1 text-xs font-black text-primary">-{discountPercent}%</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function DiscountForm({ dictionary }: { dictionary: Dictionary }) {
  const { discountCode, appliedDiscountCode, setDiscountCode, applyDiscountCode, clearDiscountCode } = useCart();
  const [message, setMessage] = useState<"success" | "error" | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isApplying) return;

    setIsApplying(true);
    setMessage(null);
    const success = await applyDiscountCode();
    setMessage(success ? "success" : "error");
    setIsApplying(false);
  }

  return (
    <form className="grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="discount-code">
        {dictionary.cartPage.discountCode}
      </label>
      <div className="relative">
        <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          id="discount-code"
          value={discountCode}
          onChange={(event) => {
            setDiscountCode(event.target.value);
            setMessage(null);
          }}
          placeholder={dictionary.cartPage.discountCode}
          className="focus-ring h-12 w-full rounded-[10px] border border-border bg-white pl-12 pr-4 text-sm font-semibold outline-none"
          disabled={isApplying}
        />
      </div>
      <Button type="submit" className="h-12" disabled={isApplying}>
        {isApplying ? <Zap className="h-4 w-4 animate-spin" /> : null}
        {dictionary.cartPage.applyDiscount}
      </Button>
      {message ? (
        <p className={message === "success" ? "text-sm font-semibold text-emerald-600 sm:col-span-2" : "text-sm font-semibold text-red-600 sm:col-span-2"}>
          {message === "success" ? dictionary.cartPage.discountApplied : dictionary.cartPage.discountInvalid}
        </p>
      ) : appliedDiscountCode ? (
        <button type="button" className="text-left text-sm font-semibold text-slate-500 hover:text-primary sm:col-span-2" onClick={clearDiscountCode}>
          {dictionary.cartPage.discount}: {appliedDiscountCode}
        </button>
      ) : null}
    </form>
  );
}

function AccessBenefits({ dictionary }: { dictionary: Dictionary }) {
  const benefits = [
    { icon: ShieldCheck, title: dictionary.cartPage.stripeBenefitTitle, text: dictionary.cartPage.stripeBenefitText },
    { icon: Zap, title: dictionary.cartPage.instantAccessTitle, text: dictionary.cartPage.instantAccessText },
    { icon: Mail, title: dictionary.cartPage.invoiceBenefitTitle, text: dictionary.cartPage.invoiceBenefitText }
  ];

  return (
    <div className="mt-6 space-y-5 rounded-2xl bg-primary-soft p-5">
      {benefits.map((benefit) => (
        <div key={benefit.title} className="flex gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-primary">
            <benefit.icon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-black">{benefit.title}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-600">{benefit.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function RecommendedProductCard({
  product,
  locale,
  dictionary,
  categories
}: {
  product: Product;
  locale: Locale;
  dictionary: Dictionary;
  categories: Category[];
}) {
  const href = product.type === "course" ? getCoursePath(product, locale) : getBundlePath(product, locale);
  const category = categories.find((item) => item.id === product.categoryId);

  return (
    <article className="grid gap-4 rounded-2xl border border-border bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)] lg:grid-cols-[160px_1fr_auto] lg:items-center xl:grid-cols-[180px_1fr_auto]">
      <Link href={href} aria-label={product.title[locale]} className="overflow-hidden rounded-xl">
        <Thumbnail
          title={product.thumbnail.title}
          subtitle={product.thumbnail.subtitle}
          variant={product.thumbnail.variant}
          hideText={product.type === "bundle"}
          imageUrl={product.thumbnailImageUrl}
          showFavorite={false}
        />
      </Link>
      <div>
        <h3 className="font-black leading-6">
          <Link href={href} className="hover:text-primary">
            {product.title[locale]}
          </Link>
        </h3>
        <p className="mt-2 text-sm font-bold text-primary">{category?.label[locale]}</p>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <span className="text-lg font-black">{formatPrice(product.price[locale], locale)}</span>
          <span className="text-sm text-muted-foreground line-through">{formatPrice(product.regularPrice[locale], locale)}</span>
        </div>
      </div>
      <AddToCartButton product={product} dictionary={dictionary} iconOnly variant="secondary" />
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

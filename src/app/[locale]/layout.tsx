import { notFound } from "next/navigation";
import { CartProvider } from "@/components/cart/cart-provider";
import { NotificationProvider } from "@/components/ui/notification";
import { Footer } from "@/components/public/footer";
import { Header } from "@/components/public/header";
import { JsonLd } from "@/components/seo/json-ld";
import { getActiveDiscountCodes } from "@/lib/discount-code-data";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { createPersonJsonLd, createWebsiteJsonLd, getPublicPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "de" }, { locale: "en" }];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return isLocale(locale) ? getPublicPageMetadata(locale, "home") : {};
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);
  const discounts = await getActiveDiscountCodes().catch(() => []);

  return (
    <CartProvider locale={locale} discounts={discounts}>
      <NotificationProvider>
        <Header locale={locale} dictionary={dictionary} />
        <main>{children}</main>
        <JsonLd data={createWebsiteJsonLd(locale)} />
        <JsonLd data={createPersonJsonLd(locale)} />
        <Footer locale={locale} dictionary={dictionary} />
      </NotificationProvider>
    </CartProvider>
  );
}

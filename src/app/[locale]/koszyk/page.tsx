import { notFound } from "next/navigation";
import { CartPage } from "@/components/cart/cart-page";
import { getPublicCatalog } from "@/lib/catalog-data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getServerCurrency } from "@/lib/i18n/server-config";
import { getNoIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [{ locale: "pl" }];
}

export function generateMetadata() {
  return getNoIndexMetadata("Koszyk");
}

export default async function CartPlPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "pl") notFound();

  const locale = rawLocale as Locale;
  const currency = await getServerCurrency(locale);
  const catalog = await getPublicCatalog(locale, currency);
  return <CartPage locale={locale} dictionary={getDictionary(locale)} {...catalog} />;
}

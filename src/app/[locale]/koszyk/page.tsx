import { notFound } from "next/navigation";
import { CartPage } from "@/components/cart/cart-page";
import { getPublicCatalog } from "@/lib/catalog-data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
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
  const catalog = await getPublicCatalog(locale);
  return <CartPage locale={locale} dictionary={getDictionary(locale)} {...catalog} />;
}

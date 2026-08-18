import { notFound } from "next/navigation";
import { CategoriesPage } from "@/components/catalog/categories-page";
import { getPublicCatalog } from "@/lib/catalog-data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getServerCurrency } from "@/lib/i18n/server-config";
import { getPublicPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [{ locale: "de" }];
}

export function generateMetadata() {
  return getPublicPageMetadata("de", "categories");
}

export default async function CategoriesDePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "de") notFound();

  const locale = rawLocale as Locale;
  const currency = await getServerCurrency(locale);
  const catalog = await getPublicCatalog(locale, currency);
  return <CategoriesPage locale={locale} dictionary={getDictionary(locale)} categories={catalog.categories} courses={catalog.courses} />;
}

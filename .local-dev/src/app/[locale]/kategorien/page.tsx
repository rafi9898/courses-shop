import { notFound } from "next/navigation";
import { CategoriesPage } from "@/components/catalog/categories-page";
import { getPublicCatalog } from "@/lib/catalog-data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
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
  const catalog = await getPublicCatalog(locale);
  return <CategoriesPage locale={locale} dictionary={getDictionary(locale)} categories={catalog.categories} courses={catalog.courses} />;
}

import { notFound } from "next/navigation";
import { CatalogListPage } from "@/components/catalog/catalog-list-page";
import { getPublicCatalog } from "@/lib/catalog-data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPublicPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export function generateMetadata() {
  return getPublicPageMetadata("en", "bundles");
}

export default async function BundlesEnPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const { category, q } = await searchParams;
  if (!isLocale(rawLocale) || rawLocale !== "en") notFound();

  const locale = rawLocale as Locale;
  const catalog = await getPublicCatalog(locale);
  return <CatalogListPage locale={locale} dictionary={getDictionary(locale)} kind="bundles" initialCategoryId={category || "all"} initialQuery={q || ""} {...catalog} />;
}

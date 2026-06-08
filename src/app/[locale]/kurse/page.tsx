import { notFound } from "next/navigation";
import { CatalogListPage } from "@/components/catalog/catalog-list-page";
import { getPublicCatalog } from "@/lib/catalog-data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPublicPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [{ locale: "de" }];
}

export function generateMetadata() {
  return getPublicPageMetadata("de", "courses");
}

export default async function CoursesDePage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const { category, q } = await searchParams;
  if (!isLocale(rawLocale) || rawLocale !== "de") notFound();

  const locale = rawLocale as Locale;
  const catalog = await getPublicCatalog(locale);
  return <CatalogListPage locale={locale} dictionary={getDictionary(locale)} kind="courses" initialCategoryId={category || "all"} initialQuery={q || ""} {...catalog} />;
}

import { notFound } from "next/navigation";
import { CategoriesPage } from "@/components/catalog/categories-page";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function generateStaticParams() {
  return [{ locale: "pl" }];
}

export default async function CategoriesPlPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "pl") notFound();

  const locale = rawLocale as Locale;
  return <CategoriesPage locale={locale} dictionary={getDictionary(locale)} />;
}

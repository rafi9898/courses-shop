import { notFound } from "next/navigation";
import { PromotionPage } from "@/components/promotion/promotion-page";
import { getPublicCatalog } from "@/lib/catalog-data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [{ locale: "pl" }];
}

export function generateMetadata(): Metadata {
  return {
    title: "Promocja na wszystkie kursy | Rafał Podraza",
    description:
      "Skorzystaj z niższych cen na wszystkie kursy online. Testowanie, programowanie, AI, Cloud, DevOps i więcej. Oferta ograniczona czasowo!",
    robots: { index: true, follow: true }
  };
}

export default async function PromocjaPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "pl") notFound();

  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);
  const catalog = await getPublicCatalog(locale);

  return (
    <PromotionPage
      locale={locale}
      dictionary={dictionary}
      categories={catalog.categories}
      courses={catalog.courses}
    />
  );
}

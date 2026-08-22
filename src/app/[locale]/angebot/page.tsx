import { notFound } from "next/navigation";
import { PromotionPage } from "@/components/promotion/promotion-page";
import { getPublicCatalog } from "@/lib/catalog-data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getServerCurrency } from "@/lib/i18n/server-config";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [{ locale: "de" }];
}

export function generateMetadata(): Metadata {
  return {
    title: "Angebot auf alle Kurse | Rafał Podraza",
    description:
      "Profitieren Sie von niedrigeren Preisen für alle Online-Kurse. Testing, Programmierung, KI, Cloud, DevOps und mehr. Zeitlich begrenztes Angebot!",
    robots: { index: true, follow: true }
  };
}

export default async function AngebotPageServer({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "de") notFound();

  const locale = rawLocale as Locale;
  const currency = await getServerCurrency(locale);
  const dictionary = getDictionary(locale);
  const catalog = await getPublicCatalog(locale, currency);

  return (
    <PromotionPage
      locale={locale}
      dictionary={dictionary}
      categories={catalog.categories}
      courses={catalog.courses}
    />
  );
}

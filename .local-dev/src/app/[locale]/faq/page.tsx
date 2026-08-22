import { notFound } from "next/navigation";
import { FaqPage } from "@/components/faq/faq-page";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPublicPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "de" }, { locale: "en" }];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return isLocale(locale) ? getPublicPageMetadata(locale, "faq") : {};
}

export default async function FaqRoutePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  return <FaqPage locale={locale} dictionary={getDictionary(locale)} />;
}

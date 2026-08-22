import { notFound } from "next/navigation";
import { AboutPage } from "@/components/about/about-page";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPublicPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return [{ locale: "pl" }];
}

export function generateMetadata() {
  return getPublicPageMetadata("pl", "about");
}

export default async function AboutPlPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "pl") notFound();

  const locale = rawLocale as Locale;
  return <AboutPage locale={locale} dictionary={getDictionary(locale)} />;
}

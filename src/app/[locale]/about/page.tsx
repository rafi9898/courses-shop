import { notFound } from "next/navigation";
import { AboutPage } from "@/components/about/about-page";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export default async function AboutEnPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "en") notFound();

  const locale = rawLocale as Locale;
  return <AboutPage locale={locale} dictionary={getDictionary(locale)} />;
}

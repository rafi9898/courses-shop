import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/product-detail/product-detail-page";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { bundles } from "@/lib/mock-data";

export function generateStaticParams() {
  return bundles.map((bundle) => ({ locale: "pl", slug: bundle.slug.pl }));
}

export default async function BundleDetailPlPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "pl") notFound();

  const locale = rawLocale as Locale;
  const bundle = bundles.find((item) => item.slug[locale] === slug);
  if (!bundle) notFound();

  return <ProductDetailPage locale={locale} dictionary={getDictionary(locale)} detail={{ kind: "bundle", product: bundle }} />;
}

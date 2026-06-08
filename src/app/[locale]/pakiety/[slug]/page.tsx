import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/product-detail/product-detail-page";
import { getPublicBundleBySlug } from "@/lib/catalog-data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getBundlePath } from "@/lib/routes";
import { getProductMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "pl") return {};

  const { bundle } = await getPublicBundleBySlug(rawLocale, slug);
  if (!bundle) return {};

  return getProductMetadata({
    locale: rawLocale,
    path: getBundlePath(bundle, rawLocale),
    title: bundle.title[rawLocale],
    description: bundle.subtitle?.[rawLocale] || bundle.description[rawLocale],
    imageUrl: bundle.thumbnailImageUrl
  });
}

export default async function BundleDetailPlPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "pl") notFound();

  const locale = rawLocale as Locale;
  const { catalog, bundle } = await getPublicBundleBySlug(locale, slug);
  if (!bundle) notFound();

  return <ProductDetailPage locale={locale} dictionary={getDictionary(locale)} detail={{ kind: "bundle", product: bundle }} {...catalog} />;
}

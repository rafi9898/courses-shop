import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/product-detail/product-detail-page";
import { getPublicBundleBySlug } from "@/lib/catalog-data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getBundlePath } from "@/lib/routes";
import { getProductKeywords, getProductMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "en") return {};

  const { catalog, bundle } = await getPublicBundleBySlug(rawLocale, slug);
  if (!bundle) return {};
  const category = catalog.categories.find((item) => item.id === bundle.categoryId);
  const description = bundle.subtitle?.[rawLocale] || bundle.description[rawLocale];

  return getProductMetadata({
    locale: rawLocale,
    path: getBundlePath(bundle, rawLocale),
    title: bundle.title[rawLocale],
    description,
    imageUrl: bundle.thumbnailImageUrl,
    keywords: getProductKeywords({
      locale: rawLocale,
      kind: "bundle",
      title: bundle.title[rawLocale],
      category: category?.label[rawLocale],
      subtitle: bundle.subtitle?.[rawLocale],
      highlights: [description]
    })
  });
}

export default async function BundleDetailEnPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "en") notFound();

  const locale = rawLocale as Locale;
  const { catalog, bundle } = await getPublicBundleBySlug(locale, slug);
  if (!bundle) notFound();

  return <ProductDetailPage locale={locale} dictionary={getDictionary(locale)} detail={{ kind: "bundle", product: bundle }} {...catalog} />;
}

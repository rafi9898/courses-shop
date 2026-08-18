import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/product-detail/product-detail-page";
import { getPublicCourseBySlug } from "@/lib/catalog-data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getServerCurrency } from "@/lib/i18n/server-config";
import { getCoursePath } from "@/lib/routes";
import { getProductKeywords, getProductMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "de") return {};

  const { catalog, course } = await getPublicCourseBySlug(rawLocale, slug);
  if (!course) return {};
  const category = catalog.categories.find((item) => item.id === course.categoryId);

  return getProductMetadata({
    locale: rawLocale,
    path: getCoursePath(course, rawLocale),
    title: course.title[rawLocale],
    description: course.subtitle?.[rawLocale] || course.highlights[rawLocale][0] || course.title[rawLocale],
    imageUrl: course.thumbnailImageUrl,
    keywords: getProductKeywords({
      locale: rawLocale,
      kind: "course",
      title: course.title[rawLocale],
      category: category?.label[rawLocale],
      subtitle: course.subtitle?.[rawLocale],
      highlights: course.highlights[rawLocale],
      outcomes: course.outcomes[rawLocale]
    }),
    alternates: { pl: getCoursePath(course, "pl"), de: getCoursePath(course, "de"), en: getCoursePath(course, "en") }
  });
}

export default async function CourseDetailDePage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "de") notFound();

  const locale = rawLocale as Locale;
  const currency = await getServerCurrency(locale);
  const { catalog, course } = await getPublicCourseBySlug(locale, slug, currency);
  if (!course) notFound();

  return <ProductDetailPage locale={locale} currency={currency} dictionary={getDictionary(locale)} detail={{ kind: "course", product: course }} {...catalog} />;
}

import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/product-detail/product-detail-page";
import { getPublicCourseBySlug } from "@/lib/catalog-data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCoursePath } from "@/lib/routes";
import { getProductKeywords, getProductMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "en") return {};

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
    })
  });
}

export default async function CourseDetailEnPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "en") notFound();

  const locale = rawLocale as Locale;
  const { catalog, course } = await getPublicCourseBySlug(locale, slug);
  if (!course) notFound();

  return <ProductDetailPage locale={locale} dictionary={getDictionary(locale)} detail={{ kind: "course", product: course }} {...catalog} />;
}

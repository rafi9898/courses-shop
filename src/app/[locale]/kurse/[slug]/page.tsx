import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/product-detail/product-detail-page";
import { getPublicCourseBySlug } from "@/lib/catalog-data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCoursePath } from "@/lib/routes";
import { getProductMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "de") return {};

  const { course } = await getPublicCourseBySlug(rawLocale, slug);
  if (!course) return {};

  return getProductMetadata({
    locale: rawLocale,
    path: getCoursePath(course, rawLocale),
    title: course.title[rawLocale],
    description: course.subtitle?.[rawLocale] || course.highlights[rawLocale][0] || course.title[rawLocale],
    imageUrl: course.thumbnailImageUrl
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
  const { catalog, course } = await getPublicCourseBySlug(locale, slug);
  if (!course) notFound();

  return <ProductDetailPage locale={locale} dictionary={getDictionary(locale)} detail={{ kind: "course", product: course }} {...catalog} />;
}

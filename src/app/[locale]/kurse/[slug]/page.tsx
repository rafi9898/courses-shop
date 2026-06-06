import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/product-detail/product-detail-page";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { courses } from "@/lib/mock-data";

export function generateStaticParams() {
  return courses.map((course) => ({ locale: "de", slug: course.slug.de }));
}

export default async function CourseDetailDePage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "de") notFound();

  const locale = rawLocale as Locale;
  const course = courses.find((item) => item.slug[locale] === slug);
  if (!course) notFound();

  return <ProductDetailPage locale={locale} dictionary={getDictionary(locale)} detail={{ kind: "course", product: course }} />;
}

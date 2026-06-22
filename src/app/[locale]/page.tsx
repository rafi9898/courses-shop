import { notFound } from "next/navigation";
import { AuthorStrip } from "@/components/home/author-strip";
import { FaqPreview } from "@/components/home/faq-preview";
import { HeroSection } from "@/components/home/hero-section";
import { ProductShowcase } from "@/components/home/product-showcase";
import { ReviewsSection } from "@/components/home/reviews-section";
import { SearchPanel } from "@/components/home/search-panel";
import { CompanyLogos } from "@/components/home/company-logos";
import { getPublicCatalog } from "@/lib/catalog-data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPublicPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return isLocale(locale) ? getPublicPageMetadata(locale, "home") : {};
}

export default async function LocaleHomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const dictionary = getDictionary(locale);
  const catalog = await getPublicCatalog(locale);

  return (
    <div className="overflow-hidden">
      <HeroSection locale={locale} dictionary={dictionary} />
      <SearchPanel locale={locale} dictionary={dictionary} {...catalog} />
      <ProductShowcase locale={locale} dictionary={dictionary} {...catalog} />
      <CompanyLogos dictionary={dictionary} />
      <ReviewsSection locale={locale} dictionary={dictionary} />
      <AuthorStrip locale={locale} dictionary={dictionary} />
      <FaqPreview locale={locale} dictionary={dictionary} />
    </div>
  );
}

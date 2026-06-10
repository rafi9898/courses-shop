import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BundleCard } from "@/components/commerce/bundle-card";
import { ProductCard } from "@/components/commerce/product-card";
import { ButtonLink } from "@/components/ui/button";
import { type Bundle, type Category, type Course } from "@/lib/mock-data";
import { type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";

export function ProductShowcase({
  locale,
  dictionary,
  categories,
  courses,
  bundles
}: {
  locale: Locale;
  dictionary: Dictionary;
  categories: Category[];
  courses: Course[];
  bundles: Bundle[];
}) {
  if (courses.length === 0 && bundles.length === 0) {
    return null;
  }

  return (
    <section className="container-shell py-16 lg:py-20">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Featured</p>
          <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">{dictionary.home.featuredTitle}</h2>
        </div>
        <Link
          href={dictionary.routes.courses}
          className="inline-flex min-h-11 w-fit items-center gap-2 self-start py-2 text-sm font-bold text-primary hover:underline sm:self-auto"
        >
          {dictionary.home.seeAll}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {courses.slice(0, 8).map((course) => (
          <ProductCard key={course.id} course={course} locale={locale} dictionary={dictionary} categories={categories} />
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-black tracking-normal sm:text-3xl">{dictionary.home.bundlesTitle}</h2>
        <ButtonLink href={dictionary.routes.bundles} variant="secondary" className="w-full sm:w-auto">
          {dictionary.home.secondaryCta}
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {bundles.slice(0, 3).map((bundle) => (
          <BundleCard key={bundle.id} bundle={bundle} locale={locale} dictionary={dictionary} categories={categories} />
        ))}
      </div>
    </section>
  );
}

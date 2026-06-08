"use client";

import { ArrowRight, Brain, Cloud, Code2, Database, Infinity, Search, ShieldCheck, TestTube2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CatalogCta } from "@/components/catalog/catalog-cta";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { ButtonLink } from "@/components/ui/button";
import { type Category, type Course } from "@/lib/mock-data";
import { type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";

const categoryIcons = {
  testing: TestTube2,
  programming: Code2,
  ai: Brain,
  cloud: Cloud,
  devops: Infinity,
  sql: Database
};

export function CategoriesPage({
  locale,
  dictionary,
  categories,
  courses
}: {
  locale: Locale;
  dictionary: Dictionary;
  categories: Category[];
  courses: Course[];
}) {
  const [query, setQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return categories.filter((category) => {
      if (!normalized) return true;
      return `${category.label[locale]} ${category.description[locale]}`.toLowerCase().includes(normalized);
    });
  }, [categories, locale, query]);

  return (
    <>
      <CatalogHero locale={locale} dictionary={dictionary} kind="categories" />
      <section className="container-shell py-10 lg:py-12">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-soft sm:p-5">
          <label className="relative block">
            <span className="sr-only">{dictionary.catalog.searchCategories}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="focus-ring h-14 w-full rounded-xl border border-border bg-white pl-12 pr-4 text-base text-foreground placeholder:text-slate-500"
              placeholder={dictionary.catalog.searchCategories}
            />
          </label>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => {
            const Icon = categoryIcons[category.id as keyof typeof categoryIcons] ?? ShieldCheck;
            const count = courses.filter((course) => course.categoryId === category.id).length;

            return (
              <article
                key={category.id}
                className="rounded-2xl border border-border bg-white p-6 shadow-[0_10px_26px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
              >
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <Icon className="h-10 w-10" />
                </div>
                <h2 className="mt-8 text-2xl font-black leading-tight">{category.label[locale]}</h2>
                <p className="mt-3 min-h-16 text-sm leading-7 text-slate-600">{category.description[locale]}</p>
                <div className="mt-5 text-sm font-semibold text-muted-foreground">
                  {dictionary.catalog.courseCount.replace("{count}", String(count))}
                </div>
                <ButtonLink href={dictionary.routes.courses} variant="secondary" className="mt-6 w-full">
                  {dictionary.catalog.viewCourses}
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </article>
            );
          })}
        </div>

        <CatalogCta
          title={dictionary.catalog.categoriesCtaTitle}
          text={dictionary.catalog.categoriesCtaText}
          href={dictionary.routes.courses}
          label={dictionary.home.primaryCta}
        />
      </section>
    </>
  );
}

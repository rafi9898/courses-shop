"use client";

import { ChevronLeft, ChevronRight, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BundleCard } from "@/components/commerce/bundle-card";
import { ProductCard } from "@/components/commerce/product-card";
import { CatalogCta } from "@/components/catalog/catalog-cta";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import {
  bundles as fallbackBundles,
  categories as fallbackCategories,
  courses as fallbackCourses,
  type Bundle,
  type Category,
  type Course
} from "@/lib/mock-data";
import { type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

type ProductKind = "courses" | "bundles";
const ITEMS_PER_PAGE = 9;

export function CatalogListPage({
  locale,
  dictionary,
  kind,
  initialCategoryId = "all",
  initialQuery = "",
  categories = fallbackCategories,
  courses = fallbackCourses,
  bundles = fallbackBundles
}: {
  locale: Locale;
  dictionary: Dictionary;
  kind: ProductKind;
  initialCategoryId?: string;
  initialQuery?: string;
  categories?: Category[];
  courses?: Course[];
  bundles?: Bundle[];
}) {
  const [query, setQuery] = useState(initialQuery);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);

  const isCourses = kind === "courses";
  const source = isCourses ? courses : bundles;

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = source.filter((item) => {
      const matchesCategory = categoryId === "all" || item.categoryId === categoryId;
      const category = categories.find((entry) => entry.id === item.categoryId);
      const matchesQuery =
        !normalized ||
        getCatalogItemSearchText(item, category?.label[locale] ?? "", locale).includes(normalized);

      return matchesCategory && matchesQuery;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-low") return a.price[locale] - b.price[locale];
      if (sort === "price-high") return b.price[locale] - a.price[locale];
      return b.reviews - a.reviews;
    });
  }, [categories, categoryId, locale, query, sort, source]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const paginatedItems = filteredItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [categoryId, query, sort]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setCategoryId(initialCategoryId);
  }, [initialCategoryId]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
  }, [totalPages]);

  const foundText = (isCourses ? dictionary.catalog.foundCourses : dictionary.catalog.foundBundles).replace(
    "{count}",
    String(filteredItems.length)
  );

  function resetFilters() {
    setQuery("");
    setCategoryId("all");
    setSort("popular");
  }

  return (
    <>
      <CatalogHero locale={locale} dictionary={dictionary} kind={kind} />
      <section className="container-shell py-10 lg:py-12">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-soft sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_280px_132px]">
            <label className="relative block">
              <span className="sr-only">{isCourses ? dictionary.catalog.searchCourses : dictionary.catalog.searchBundles}</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="focus-ring h-14 w-full rounded-xl border border-border bg-white pl-12 pr-4 text-base text-foreground placeholder:text-slate-500"
                placeholder={isCourses ? dictionary.catalog.searchCourses : dictionary.catalog.searchBundles}
              />
            </label>
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="focus-ring h-14 rounded-xl border border-border bg-white px-5 text-sm font-semibold text-slate-700"
              aria-label={dictionary.catalog.allCategories}
            >
              <option value="all">{dictionary.catalog.allCategories}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label[locale]}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setPage(1)}
              className="focus-ring h-14 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-soft transition hover:bg-[#2f16d8]"
            >
              {dictionary.home.searchButton}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-bold">{dictionary.home.popularCategories}</span>
            <FilterPill active={categoryId === "all"} onClick={() => setCategoryId("all")}>
              {dictionary.catalog.all}
            </FilterPill>
            {categories.map((category) => (
              <FilterPill key={category.id} active={categoryId === category.id} onClick={() => setCategoryId(category.id)}>
                {category.label[locale]}
              </FilterPill>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-7 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-5">
            <div className="rounded-xl border border-border bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
              <div className="mb-4 flex items-center gap-2 text-lg font-black">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                {dictionary.catalog.filters}
              </div>
              <div className="space-y-3">
                <CheckboxRow label={dictionary.catalog.all} checked={categoryId === "all"} onChange={() => setCategoryId("all")} count={source.length} />
                {categories.map((category) => {
                  const count = source.filter((item) => item.categoryId === category.id).length;

                  return (
                    <CheckboxRow
                      key={category.id}
                      label={category.label[locale]}
                      checked={categoryId === category.id}
                      onChange={() => setCategoryId(category.id)}
                      count={count}
                    />
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="focus-ring flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-white text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
            >
              {dictionary.catalog.clearFilters}
              <RotateCcw className="h-4 w-4" />
            </button>
          </aside>

          <div>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-lg font-semibold text-slate-600">{foundText}</p>
              <label className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-600">{dictionary.catalog.sortLabel}</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="focus-ring h-11 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-slate-700"
                >
                  <option value="popular">{dictionary.catalog.popular}</option>
                  <option value="price-low">{dictionary.catalog.price}: ↑</option>
                  <option value="price-high">{dictionary.catalog.price}: ↓</option>
                </select>
              </label>
            </div>

            {filteredItems.length ? (
              <div className={cn("grid gap-5", isCourses ? "sm:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-3")}>
                {paginatedItems.map((item) =>
                  item.type === "course" ? (
                    <ProductCard key={item.id} course={item} locale={locale} dictionary={dictionary} categories={categories} />
                  ) : (
                    <BundleCard key={item.id} bundle={item} locale={locale} dictionary={dictionary} categories={categories} />
                  )
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
                {dictionary.catalog.empty}
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>

        <CatalogCta
          title={isCourses ? dictionary.catalog.coursesCtaTitle : dictionary.catalog.bundlesCtaTitle}
          text={isCourses ? dictionary.catalog.coursesCtaText : dictionary.catalog.bundlesCtaText}
          href={isCourses ? dictionary.routes.bundles : dictionary.routes.courses}
          label={isCourses ? dictionary.home.secondaryCta : dictionary.home.primaryCta}
        />
      </section>
    </>
  );
}

function getCatalogItemSearchText(item: Course | Bundle, categoryLabel: string, locale: Locale) {
  const values = [
    item.title[locale],
    item.subtitle?.[locale],
    categoryLabel
  ].filter(Boolean);

  if ("description" in item) {
    values.push(item.description[locale]);
  }

  if ("highlights" in item) {
    values.push(...item.highlights[locale]);
  }

  return values.join(" ").toLowerCase();
}

function FilterPill({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring rounded-lg border px-4 py-2 text-xs font-semibold transition",
        active ? "border-primary bg-primary text-white" : "border-border bg-white text-slate-600 hover:border-primary hover:text-primary"
      )}
    >
      {children}
    </button>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
  count
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-slate-600">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 rounded border-border accent-primary"
        />
        {label}
      </span>
      {typeof count === "number" ? <span className="text-xs text-muted-foreground">({count})</span> : null}
    </label>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <PaginationButton disabled={page === 1} onClick={() => onPageChange(Math.max(1, page - 1))} ariaLabel="Poprzednia strona">
        <ChevronLeft className="h-4 w-4" />
      </PaginationButton>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPageChange(item)}
          className={cn(
            "focus-ring grid h-10 w-10 place-items-center rounded-full border text-sm font-bold transition",
            item === page
              ? "border-primary bg-primary text-white"
              : "border-border bg-white text-slate-600 hover:border-primary hover:text-primary"
          )}
          aria-current={item === page ? "page" : undefined}
        >
          {item}
        </button>
      ))}
      <PaginationButton disabled={page === totalPages} onClick={() => onPageChange(Math.min(totalPages, page + 1))} ariaLabel="Następna strona">
        <ChevronRight className="h-4 w-4" />
      </PaginationButton>
    </div>
  );
}

function PaginationButton({
  children,
  disabled,
  onClick,
  ariaLabel
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-border bg-white text-sm font-bold text-slate-600 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-slate-600"
    >
      {children}
    </button>
  );
}

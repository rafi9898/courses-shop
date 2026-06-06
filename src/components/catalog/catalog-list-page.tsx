"use client";

import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { BundleCard } from "@/components/commerce/bundle-card";
import { ProductCard } from "@/components/commerce/product-card";
import { CatalogCta } from "@/components/catalog/catalog-cta";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { categories, bundles, courses } from "@/lib/mock-data";
import { type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

type ProductKind = "courses" | "bundles";

export function CatalogListPage({
  locale,
  dictionary,
  kind
}: {
  locale: Locale;
  dictionary: Dictionary;
  kind: ProductKind;
}) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [level, setLevel] = useState("all");
  const [sort, setSort] = useState("popular");

  const isCourses = kind === "courses";
  const source = isCourses ? courses : bundles;

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = source.filter((item) => {
      const matchesCategory = categoryId === "all" || item.categoryId === categoryId;
      const matchesLevel = !isCourses || level === "all" || ("level" in item && item.level === level);
      const category = categories.find((entry) => entry.id === item.categoryId);
      const matchesQuery =
        !normalized ||
        `${item.title[locale]} ${category?.label[locale] ?? ""}`.toLowerCase().includes(normalized);

      return matchesCategory && matchesLevel && matchesQuery;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-low") return a.price[locale] - b.price[locale];
      if (sort === "price-high") return b.price[locale] - a.price[locale];
      return b.reviews - a.reviews;
    });
  }, [categoryId, isCourses, level, locale, query, sort, source]);

  const foundText = (isCourses ? dictionary.catalog.foundCourses : dictionary.catalog.foundBundles).replace(
    "{count}",
    String(filteredItems.length)
  );

  function resetFilters() {
    setQuery("");
    setCategoryId("all");
    setLevel("all");
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

            {isCourses ? (
              <div className="rounded-xl border border-border bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
                <div className="mb-4 text-lg font-black">{dictionary.catalog.level}</div>
                <div className="space-y-3">
                  {[
                    ["all", dictionary.catalog.all],
                    ["beginner", dictionary.catalog.beginner],
                    ["intermediate", dictionary.catalog.intermediate],
                    ["advanced", dictionary.catalog.advanced]
                  ].map(([value, label]) => (
                    <CheckboxRow key={value} label={label} checked={level === value} onChange={() => setLevel(value)} />
                  ))}
                </div>
              </div>
            ) : null}

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
                {filteredItems.map((item) =>
                  item.type === "course" ? (
                    <ProductCard key={item.id} course={item} locale={locale} dictionary={dictionary} />
                  ) : (
                    <BundleCard key={item.id} bundle={item} locale={locale} dictionary={dictionary} />
                  )
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
                {dictionary.catalog.empty}
              </div>
            )}

            <Pagination />
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

function Pagination() {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {["‹", "1", "2", "3", "…", "6", "›"].map((item, index) => (
        <button
          key={`${item}-${index}`}
          type="button"
          className={cn(
            "focus-ring grid h-10 w-10 place-items-center rounded-full border text-sm font-bold transition",
            item === "1"
              ? "border-primary bg-primary text-white"
              : "border-border bg-white text-slate-600 hover:border-primary hover:text-primary"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

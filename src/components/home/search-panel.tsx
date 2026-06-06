"use client";

import { ArrowRight, ChevronDown, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { categories, products } from "@/lib/mock-data";
import { formatPrice, type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function SearchPanel({
  locale,
  dictionary
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return products
      .filter((product) => category === "all" || product.categoryId === category)
      .filter((product) => {
        if (!normalized) {
          return true;
        }

        const categoryLabel = categories.find((item) => item.id === product.categoryId)?.label[locale] ?? "";
        return `${product.title[locale]} ${categoryLabel}`.toLowerCase().includes(normalized);
      })
      .slice(0, 5);
  }, [category, locale, query]);

  return (
    <section className="container-shell relative z-10 -mt-10">
      <div className="rounded-2xl border border-border bg-white p-4 shadow-soft sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_260px_132px]">
          <label className="relative block">
            <span className="sr-only">{dictionary.home.searchPlaceholder}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="focus-ring h-14 w-full rounded-xl border border-border bg-white pl-12 pr-12 text-base text-foreground placeholder:text-slate-500"
              placeholder={dictionary.home.searchPlaceholder}
            />
            {query ? (
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:bg-slate-100"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>

          <label className="relative block">
            <span className="sr-only">{dictionary.home.categorySelect}</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="focus-ring h-14 w-full appearance-none rounded-xl border border-border bg-white py-0 pl-5 pr-11 text-sm font-medium text-slate-700"
            >
              <option value="all">{dictionary.home.categorySelect}</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label[locale]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </label>

          <button
            type="button"
            className="focus-ring h-14 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-soft transition hover:bg-[#2f16d8]"
          >
            {dictionary.home.searchButton}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-bold">{dictionary.home.popularCategories}</span>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={cn(
                "focus-ring rounded-lg border px-4 py-2 text-xs font-semibold transition",
                category === item.id
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-slate-600 hover:border-primary hover:text-primary"
              )}
            >
              {item.label[locale]}
            </button>
          ))}
        </div>

        {(query || category !== "all") && (
          <div className="mt-5 rounded-xl border border-border bg-slate-50/70 p-3">
            {results.length ? (
              <div className="grid gap-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={product.type === "course" ? dictionary.routes.courses : dictionary.routes.bundles}
                    className="flex items-center justify-between gap-3 rounded-lg bg-white p-3 transition hover:shadow-card"
                  >
                    <div>
                      <Badge className="mb-2">
                        {product.type === "course" ? dictionary.home.typeCourse : dictionary.home.typeBundle}
                      </Badge>
                      <div className="font-bold">{product.title[locale]}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {categories.find((item) => item.id === product.categoryId)?.label[locale]}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-black">
                      {formatPrice(product.price[locale], locale)}
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-sm text-muted-foreground">{dictionary.home.noResults}</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { Check, Search, ShoppingCart, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { normalizeCatalogSearchText } from "@/lib/catalog-search";
import { getCustomBundleDiscountPercent, summarizeCustomBundle } from "@/lib/custom-bundle";
import { formatPrice, type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { type Category, type Course } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function CustomBundleBuilder({
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
  const { items, customBundleCourseIds, setCustomBundleCourseIds } = useCart();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const normalCartCourseIds = useMemo(
    () => new Set(items.filter((item) => item.productType === "course").map((item) => item.productId)),
    [items]
  );
  const categoryLabels = useMemo(() => new Map(categories.map((category) => [category.id, category.label[locale]])), [categories, locale]);
  const normalizedQuery = normalizeCatalogSearchText(query);
  const filteredCourses = useMemo(() => {
    if (!normalizedQuery) return courses;

    return courses
      .map((course, index) => ({
        course,
        index,
        rank: getCourseSearchRank(course, categoryLabels.get(course.categoryId) ?? "", locale, normalizedQuery)
      }))
      .filter((item) => item.rank < Number.MAX_SAFE_INTEGER)
      .sort((a, b) => a.rank - b.rank || a.index - b.index)
      .map((item) => item.course);
  }, [categoryLabels, courses, locale, normalizedQuery]);
  const selectedSummary = summarizeCustomBundle(courses, locale, selectedCourseIds);
  const selectedCount = selectedSummary.courses.length;
  const selectedDiscountPercent = getCustomBundleDiscountPercent(selectedCount);
  const selectedLabel = dictionary.home.customBundleModalSelected.replace("{count}", String(selectedCount));

  useEffect(() => {
    if (!open) return;

    setQuery("");
    setSelectedCourseIds(customBundleCourseIds.filter((courseId) => !normalCartCourseIds.has(courseId)));
  }, [customBundleCourseIds, normalCartCourseIds, open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  function toggleCourse(courseId: string) {
    if (normalCartCourseIds.has(courseId)) return;

    setSelectedCourseIds((currentIds) =>
      currentIds.includes(courseId) ? currentIds.filter((id) => id !== courseId) : [...currentIds, courseId]
    );
  }

  function saveBundle() {
    if (selectedCount < 2) return;

    setCustomBundleCourseIds(selectedSummary.courseIds);
    setOpen(false);
  }

  return (
    <>
      <Button type="button" className="w-full sm:w-auto" onClick={() => setOpen(true)}>
        <Sparkles className="h-4 w-4" />
        {dictionary.home.customBundleCta}
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-end bg-slate-950/70 p-3 backdrop-blur-sm sm:items-center sm:justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={dictionary.home.customBundleModalTitle}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="flex max-h-[calc(100dvh-1rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-card sm:max-h-[calc(100dvh-1.5rem)]">
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  {dictionary.home.customBundleCta}
                </div>
                <h2 className="mt-3 text-2xl font-black">{dictionary.home.customBundleModalTitle}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{dictionary.home.customBundleModalLead}</p>
              </div>
              <button
                type="button"
                className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700"
                aria-label={dictionary.detail.closePreview}
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
              <div className="rounded-xl border border-primary/10 bg-primary-soft px-4 py-3 text-sm font-bold text-primary">
                {dictionary.home.customBundleModalHint}
              </div>

              <label className="relative mt-4 block">
                <span className="sr-only">{dictionary.home.customBundleModalSearch}</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={dictionary.home.customBundleModalSearch}
                  className="focus-ring h-12 w-full rounded-[10px] border border-border bg-white pl-12 pr-4 text-sm font-semibold outline-none"
                />
              </label>

              <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => {
                    const selected = selectedCourseIds.includes(course.id);
                    const inNormalCart = normalCartCourseIds.has(course.id);

                    return (
                      <label
                        key={course.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white p-3 transition",
                          selected && "border-primary bg-primary-soft/60",
                          !inNormalCart && "hover:border-primary/40",
                          inNormalCart && "cursor-not-allowed opacity-55"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          disabled={inNormalCart}
                          onChange={() => toggleCourse(course.id)}
                          className="sr-only"
                        />
                        <span
                          className={cn(
                            "grid h-6 w-6 shrink-0 place-items-center rounded-md border text-white",
                            selected ? "border-primary bg-primary" : "border-border bg-white"
                          )}
                        >
                          {selected ? <Check className="h-4 w-4" /> : null}
                        </span>
                        <CourseMiniThumbnail course={course} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-black text-foreground">{course.title[locale]}</span>
                          <span className="mt-1 block truncate text-xs font-semibold text-slate-500">
                            {categoryLabels.get(course.categoryId) ?? dictionary.cartPage.course} - {formatPrice(course.price[locale], locale)}
                          </span>
                        </span>
                        {inNormalCart ? (
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-500">
                            {dictionary.cartPage.inCart}
                          </span>
                        ) : null}
                      </label>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
                    {dictionary.home.noResults}
                  </div>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-4 border-t border-border bg-slate-50 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <div className="text-sm font-black text-foreground">{selectedLabel}</div>
                {selectedCount >= 2 ? (
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-black text-primary">{formatPrice(selectedSummary.total, locale)}</span>
                    <span className="text-slate-500 line-through">{formatPrice(selectedSummary.regularTotal, locale)}</span>
                    <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-primary">-{selectedDiscountPercent}%</span>
                  </div>
                ) : (
                  <p className="mt-1 text-sm font-semibold text-slate-500">{dictionary.home.customBundleModalEmpty}</p>
                )}
              </div>
              <Button type="button" disabled={selectedCount < 2} className="w-full sm:w-auto" onClick={saveBundle}>
                <ShoppingCart className="h-4 w-4" />
                {dictionary.home.customBundleModalAdd}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function CourseMiniThumbnail({ course }: { course: Course }) {
  const isUploadedImage = course.thumbnailImageUrl?.startsWith("/uploads/");

  return (
    <span
      className={cn(
        "relative h-12 w-16 shrink-0 overflow-hidden rounded-lg text-white shadow-[0_8px_18px_rgba(15,23,42,0.08)] sm:h-14 sm:w-20",
        course.thumbnail.variant === "dark" && "bg-[radial-gradient(circle_at_78%_45%,#ff5a2f_0_15%,transparent_16%),linear-gradient(135deg,#07111f,#111827)]",
        course.thumbnail.variant === "blue" && "bg-[linear-gradient(135deg,#073b75,#0f67b3)]",
        course.thumbnail.variant === "purple" && "bg-[linear-gradient(135deg,#24106f,#6d3df2)]",
        course.thumbnail.variant === "green" && "bg-[linear-gradient(135deg,#064e3b,#059669)]"
      )}
      aria-hidden="true"
    >
      {course.thumbnailImageUrl ? (
        <>
          <Image
            src={course.thumbnailImageUrl}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
            unoptimized={isUploadedImage}
          />
          <span className="absolute inset-0 bg-black/10" />
        </>
      ) : (
        <span className="flex h-full flex-col justify-end p-2">
          <span className="truncate text-[10px] font-black leading-tight">{course.thumbnail.title}</span>
          <span className="truncate text-[8px] font-black uppercase leading-tight text-warning">{course.thumbnail.subtitle}</span>
        </span>
      )}
    </span>
  );
}

function getCourseSearchRank(course: Course, categoryLabel: string, locale: Locale, normalizedQuery: string) {
  const title = normalizeCatalogSearchText(course.title[locale]);
  const subtitle = normalizeCatalogSearchText(course.subtitle?.[locale] ?? "");
  const category = normalizeCatalogSearchText(categoryLabel);

  if (title === normalizedQuery) return 0;
  if (title.startsWith(normalizedQuery)) return 1;
  if (title.split(/\s+/).some((word) => word.startsWith(normalizedQuery))) return 2;
  if (title.includes(normalizedQuery)) return 3;
  if (subtitle.startsWith(normalizedQuery)) return 4;
  if (subtitle.includes(normalizedQuery)) return 5;
  if (category.startsWith(normalizedQuery)) return 6;
  if (category.includes(normalizedQuery)) return 7;

  return Number.MAX_SAFE_INTEGER;
}

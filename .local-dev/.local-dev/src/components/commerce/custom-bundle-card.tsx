"use client";

import { Sparkles, Trash2 } from "lucide-react";
import { formatPrice, type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";
import { type Course } from "@/lib/mock-data";
import { summarizeCustomBundle } from "@/lib/custom-bundle";

export function CustomBundleCard({
  courseIds,
  courses,
  locale,
  dictionary,
  onRemove
}: {
  courseIds: string[];
  courses: Course[];
  locale: Locale;
  dictionary: Dictionary;
  onRemove?: () => void;
}) {
  const summary = summarizeCustomBundle(courses, locale, courseIds);

  if (summary.courses.length < 2) {
    return null;
  }

  const visibleCourses = summary.courses.slice(0, 4);
  const hiddenCount = summary.courses.length - visibleCourses.length;

  return (
    <article className="rounded-2xl border border-primary/15 bg-primary-soft/35 p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {dictionary.home.customBundleCardTitle}
          </div>
          <h3 className="mt-3 text-xl font-black text-foreground">{dictionary.home.customBundleCardTitle}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{dictionary.home.customBundleLead}</p>
        </div>
        {onRemove ? (
          <button
            type="button"
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-lg border border-transparent px-3 text-sm font-semibold text-slate-500 transition hover:border-red-200 hover:text-red-700"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
            {dictionary.cartPage.remove}
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {visibleCourses.map((course) => (
          <span key={course.id} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            {course.title[locale]}
          </span>
        ))}
        {hiddenCount > 0 ? (
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">+{hiddenCount}</span>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-white/70 pt-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{dictionary.cartPage.discount}</div>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-2xl font-black text-foreground">{formatPrice(summary.total, locale)}</span>
            <span className="text-sm text-slate-500 line-through">{formatPrice(summary.regularTotal, locale)}</span>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {dictionary.cartPage.savings}: {formatPrice(summary.discountAmount, locale)}
          </p>
        </div>
        <div className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-primary">
          -{summary.discountPercent}%
        </div>
      </div>
    </article>
  );
}

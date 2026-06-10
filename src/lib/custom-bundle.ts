import { type Locale } from "@/lib/i18n/config";
import { type Course } from "@/lib/mock-data";

export function getCustomBundleStorageKey(locale: Locale) {
  return `courses-shop:custom-bundle:${locale}`;
}

export function normalizeCustomBundleCourseIds(courseIds: string[]) {
  return Array.from(
    new Set(
      courseIds
        .map((courseId) => courseId.trim())
        .filter(Boolean)
    )
  ).sort();
}

export function getCustomBundleDiscountPercent(courseCount: number) {
  if (courseCount >= 5) return 20;
  if (courseCount >= 4) return 15;
  if (courseCount >= 3) return 10;
  if (courseCount >= 2) return 5;
  return 0;
}

export function buildCustomBundlePricingCourses(courses: Course[], locale: Locale, courseIds: string[], blockedCourseIds: string[] = []) {
  const courseById = new Map(courses.map((course) => [course.id, course]));
  const blocked = new Set(blockedCourseIds);
  const resolvedCourseIds = normalizeCustomBundleCourseIds(courseIds).filter((courseId) => !blocked.has(courseId));
  const selectedCourses = resolvedCourseIds.map((courseId) => courseById.get(courseId)).filter((course): course is Course => Boolean(course));
  const selectedCourseIds = selectedCourses.map((course) => course.id);
  const discountPercent = getCustomBundleDiscountPercent(selectedCourses.length);

  return {
    courseIds: selectedCourseIds,
    discountPercent,
    courses: selectedCourses.map((course) => ({
      ...course,
      price: {
        ...course.price,
        [locale]: roundPrice(course.price[locale] * (1 - discountPercent / 100))
      }
    }))
  };
}

export function summarizeCustomBundle(courses: Course[], locale: Locale, courseIds: string[], blockedCourseIds: string[] = []) {
  const bundle = buildCustomBundlePricingCourses(courses, locale, courseIds, blockedCourseIds);
  const regularTotal = bundle.courses.reduce((sum, course) => sum + course.regularPrice[locale], 0);
  const subtotal = bundle.courses.reduce((sum, course) => sum + course.price[locale], 0);

  return {
    ...bundle,
    regularTotal,
    subtotal,
    discountAmount: roundPrice(regularTotal - subtotal),
    total: subtotal
  };
}

function roundPrice(amount: number) {
  return Math.round(amount * 100) / 100;
}

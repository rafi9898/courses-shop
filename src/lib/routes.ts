import { type Locale } from "@/lib/i18n/config";
import { type Bundle, type Course } from "@/lib/mock-data";

export function getCoursePath(course: Course, locale: Locale) {
  const base = locale === "pl" ? "kursy" : locale === "de" ? "kurse" : "courses";
  return `/${locale}/${base}/${course.slug[locale]}`;
}

export function getBundlePath(bundle: Bundle, locale: Locale) {
  const base = locale === "pl" ? "pakiety" : locale === "de" ? "pakete" : "bundles";
  return `/${locale}/${base}/${bundle.slug[locale]}`;
}

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

export function getCheckoutPath(locale: Locale) {
  return `/${locale}/checkout`;
}

export function getCheckoutSuccessPath(locale: Locale) {
  const base = locale === "pl" ? "podziekowanie" : locale === "de" ? "danke" : "thank-you";
  return `/${locale}/${base}`;
}

export function getCheckoutCancelPath(locale: Locale) {
  const base = locale === "pl" ? "platnosc-anulowana" : locale === "de" ? "zahlung-abgebrochen" : "checkout-cancelled";
  return `/${locale}/${base}`;
}

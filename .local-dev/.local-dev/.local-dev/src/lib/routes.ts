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

export function getBlogIndexPath(locale: Locale) {
  return `/${locale}/blog`;
}

export function getBlogPostPath(locale: Locale, slug: string) {
  return `/${locale}/blog/${slug}`;
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

export function getOrderAccessPath(locale: Locale, token: string) {
  const base = locale === "pl" ? "zamowienie" : locale === "de" ? "bestellung" : "order";
  return `/${locale}/${base}/${token}`;
}

export function getInvoiceDownloadPath(invoiceId: string, orderAccessToken: string) {
  return `/api/invoices/${invoiceId}/pdf?token=${encodeURIComponent(orderAccessToken)}`;
}

export function getAbsoluteUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

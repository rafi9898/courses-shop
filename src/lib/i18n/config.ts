export const locales = ["pl", "de", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pl";

export const localeMeta: Record<Locale, { label: string; flag: string; currency: string }> = {
  pl: { label: "PL", flag: "🇵🇱", currency: "PLN" },
  de: { label: "DE", flag: "🇩🇪", currency: "EUR" },
  en: { label: "EN", flag: "🇺🇸", currency: "USD" }
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function formatPrice(amount: number, locale: Locale) {
  const currency = localeMeta[locale].currency;

  return new Intl.NumberFormat(locale === "pl" ? "pl-PL" : locale === "de" ? "de-DE" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2
  }).format(amount);
}

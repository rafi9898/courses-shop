export const locales = ["pl", "de", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pl";

export const localeMeta: Record<Locale, { label: string; flag: string; currency: string }> = {
  pl: { label: "PL", flag: "🇵🇱", currency: "PLN" },
  de: { label: "DE", flag: "🇩🇪", currency: "EUR" },
  en: { label: "EN", flag: "🇺🇸", currency: "USD" }
};

export const adminLocales: Locale[] = ["pl", "en", "de"];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export type Currency = "PLN" | "EUR" | "USD";
export const currencies: Currency[] = ["PLN", "EUR", "USD"];

export function formatPrice(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === "PLN" ? "pl-PL" : currency === "EUR" ? "de-DE" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2
  }).format(amount);
}

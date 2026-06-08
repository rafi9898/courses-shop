export const adminCatalogLocales = ["pl", "de", "en"] as const;

export type AdminCatalogLocale = (typeof adminCatalogLocales)[number];

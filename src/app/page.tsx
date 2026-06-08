import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";

const fallbackLocale: Locale = "en";

export default async function RootPage() {
  const requestHeaders = await headers();
  const locale = getPreferredLocale(requestHeaders.get("accept-language"));

  redirect(`/${locale}`);
}

function getPreferredLocale(acceptLanguage: string | null): Locale {
  const languages = parseAcceptLanguage(acceptLanguage);

  for (const language of languages) {
    const locale = language.split("-")[0]?.toLowerCase();

    if (locale && isLocale(locale)) {
      return locale;
    }
  }

  return fallbackLocale;
}

function parseAcceptLanguage(acceptLanguage: string | null) {
  if (!acceptLanguage) return [];

  return acceptLanguage
    .split(",")
    .map((item, index) => {
      const [language = "", ...params] = item.trim().split(";");
      const qualityParam = params.find((param) => param.trim().startsWith("q="));
      const quality = qualityParam ? Number(qualityParam.trim().slice(2)) : 1;

      return {
        index,
        language,
        quality: Number.isFinite(quality) ? quality : 0
      };
    })
    .filter((item) => item.language)
    .sort((a, b) => b.quality - a.quality || a.index - b.index)
    .map((item) => item.language);
}

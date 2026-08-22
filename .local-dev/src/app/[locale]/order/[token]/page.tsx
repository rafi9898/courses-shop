import { notFound } from "next/navigation";
import { PrivateOrderPage } from "@/components/checkout/private-order-page";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getNoIndexMetadata } from "@/lib/seo";

export function generateMetadata() {
  return getNoIndexMetadata("Order");
}

export default async function PrivateOrderEnPage({
  params
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale: rawLocale, token } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "en") notFound();

  const locale = rawLocale as Locale;
  return <PrivateOrderPage locale={locale} dictionary={getDictionary(locale)} accessToken={token} />;
}

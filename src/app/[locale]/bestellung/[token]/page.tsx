import { notFound } from "next/navigation";
import { PrivateOrderPage } from "@/components/checkout/private-order-page";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function PrivateOrderDePage({
  params
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale: rawLocale, token } = await params;
  if (!isLocale(rawLocale) || rawLocale !== "de") notFound();

  const locale = rawLocale as Locale;
  return <PrivateOrderPage locale={locale} dictionary={getDictionary(locale)} accessToken={token} />;
}

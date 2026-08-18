import { cookies } from "next/headers";
import { localeMeta, type Locale, type Currency } from "./config";

export async function getServerCurrency(locale: Locale): Promise<Currency> {
  const cookieStore = await cookies();
  const currencyCookie = cookieStore.get("NEXT_CURRENCY")?.value;
  if (currencyCookie === "PLN" || currencyCookie === "EUR" || currencyCookie === "USD") {
    return currencyCookie as Currency;
  }
  return localeMeta[locale].currency as Currency;
}

type ExchangeRates = Record<string, number>;

const nbpTableAUrl = "https://api.nbp.pl/api/exchangerates/tables/A/?format=json";
const cacheTtlMs = 60 * 60 * 1000;
const requestTimeoutMs = 3000;

let cachedRates: {
  fetchedAt: number;
  rates: ExchangeRates;
} | null = null;

export async function getCurrentPlnExchangeRates() {
  if (cachedRates && Date.now() - cachedRates.fetchedAt < cacheTtlMs) {
    return cachedRates.rates;
  }

  if (process.env.NODE_ENV !== "production") {
    return { PLN: 1 };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
    const response = await fetch(nbpTableAUrl, {
      headers: {
        Accept: "application/json"
      },
      signal: controller.signal,
      next: {
        revalidate: 60 * 60
      }
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      throw new Error(`NBP exchange rate request failed with status ${response.status}.`);
    }

    const tables = (await response.json()) as Array<{
      rates?: Array<{
        code: string;
        mid: number;
      }>;
    }>;

    const rates = tables[0]?.rates?.reduce<ExchangeRates>(
      (accumulator, rate) => ({
        ...accumulator,
        [rate.code.toUpperCase()]: rate.mid
      }),
      { PLN: 1 }
    );

    if (!rates) {
      return cachedRates?.rates ?? null;
    }

    cachedRates = {
      fetchedAt: Date.now(),
      rates
    };

    return rates;
  } catch {
    return cachedRates?.rates ?? null;
  }
}

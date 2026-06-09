type ExchangeRates = Record<string, number>;

const nbpTableAUrl = "https://api.nbp.pl/api/exchangerates/tables/A/?format=json";
const cacheTtlMs = 60 * 60 * 1000;

let cachedRates: {
  fetchedAt: number;
  rates: ExchangeRates;
} | null = null;

export async function getCurrentPlnExchangeRates() {
  if (cachedRates && Date.now() - cachedRates.fetchedAt < cacheTtlMs) {
    return cachedRates.rates;
  }

  try {
    const response = await fetch(nbpTableAUrl, {
      headers: {
        Accept: "application/json"
      },
      next: {
        revalidate: 60 * 60
      }
    });

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


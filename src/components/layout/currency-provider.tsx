"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { type Currency, currencies } from "@/lib/i18n/config";

const CurrencyContext = createContext<{
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}>({
  currency: "PLN",
  setCurrency: () => {}
});

export function CurrencyProvider({
  children,
  initialCurrency
}: {
  children: React.ReactNode;
  initialCurrency: Currency;
}) {
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency);

  // Sync state with cookie if user changes it
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    document.cookie = `NEXT_CURRENCY=${newCurrency}; path=/; max-age=31536000`;
    // Refresh to trigger Server Components to reload with new currency
    window.location.reload();
  };

  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

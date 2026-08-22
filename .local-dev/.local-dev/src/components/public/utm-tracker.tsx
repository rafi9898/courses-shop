"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const UTM_SOURCE_KEY = "utm_source";
const UTM_TIMESTAMP_KEY = "utm_source_timestamp";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function UTMTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const utmSource = searchParams.get("utm_source");

    if (utmSource) {
      localStorage.setItem(UTM_SOURCE_KEY, utmSource);
      localStorage.setItem(UTM_TIMESTAMP_KEY, Date.now().toString());
    } else {
      // Check if existing data is expired
      const timestamp = localStorage.getItem(UTM_TIMESTAMP_KEY);
      if (timestamp) {
        const age = Date.now() - parseInt(timestamp, 10);
        if (age > THIRTY_DAYS_MS) {
          localStorage.removeItem(UTM_SOURCE_KEY);
          localStorage.removeItem(UTM_TIMESTAMP_KEY);
        }
      }
    }
  }, [searchParams]);

  return null;
}

export function getStoredUtmSource(): string | null {
  if (typeof window === "undefined") return null;

  const utmSource = localStorage.getItem(UTM_SOURCE_KEY);
  const timestamp = localStorage.getItem(UTM_TIMESTAMP_KEY);

  if (!utmSource || !timestamp) return null;

  const age = Date.now() - parseInt(timestamp, 10);
  if (age > THIRTY_DAYS_MS) {
    localStorage.removeItem(UTM_SOURCE_KEY);
    localStorage.removeItem(UTM_TIMESTAMP_KEY);
    return null;
  }

  return utmSource;
}

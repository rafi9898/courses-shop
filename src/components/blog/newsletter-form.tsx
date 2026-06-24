"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { type Locale } from "@/lib/i18n/config";

const NEWSLETTER_STORAGE_KEY = "rp_newsletter_subscribed";

const copy = {
  pl: {
    title: "Odbierz 15% rabatu",
    description: "Zapisz się do newslettera i otrzymaj kod rabatowy 15% na dowolny kurs w naszym sklepie.",
    placeholder: "Twój adres e-mail",
    button: "Zapisz się i odbierz rabat",
    success: "Dziękujemy! Twój kod rabatowy to:",
    alreadySubscribed: "Już jesteś zapisany! Twój kod to:",
    error: "Wystąpił błąd. Spróbuj ponownie później.",
    privacy: "Zapisując się, akceptujesz politykę prywatności."
  },
  de: {
    title: "Hol dir 15% Rabatt",
    description: "Melde dich für den Newsletter an und erhalte einen 15% Rabattcode für jeden Kurs in unserem Shop.",
    placeholder: "Deine E-Mail-Adresse",
    button: "Anmelden und Rabatt erhalten",
    success: "Danke! Dein Rabattcode lautet:",
    alreadySubscribed: "Du bist bereits angemeldet! Dein Code lautet:",
    error: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
    privacy: "Mit der Anmeldung akzeptierst du die Datenschutzbestimmungen."
  },
  en: {
    title: "Get 15% OFF",
    description: "Sign up for the newsletter and receive a 15% discount code for any course in our shop.",
    placeholder: "Your e-mail address",
    button: "Sign up and get discount",
    success: "Thank you! Your discount code is:",
    alreadySubscribed: "You are already subscribed! Your code is:",
    error: "An error occurred. Please try again later.",
    privacy: "By signing up, you accept the privacy policy."
  }
};

export function NewsletterForm({ locale }: { locale: Locale }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "already_subscribed" | "error" | "hidden">("idle");
  const [code, setCode] = useState("");

  useEffect(() => {
    const isSubscribed = localStorage.getItem(NEWSLETTER_STORAGE_KEY);
    if (isSubscribed) {
      setStatus("hidden");
    }
  }, []);

  const t = copy[locale];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;

    // Honeypot check
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const honeypot = formData.get("website");
    if (honeypot) {
      setStatus("success");
      setCode("NEWSLETTER26");
      localStorage.setItem(NEWSLETTER_STORAGE_KEY, "true");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, website: honeypot })
      });

      const data = await response.json();

      if (response.ok) {
        setCode(data.code);
        const newStatus = data.error === "already_subscribed" ? "already_subscribed" : "success";
        setStatus(newStatus);
        localStorage.setItem(NEWSLETTER_STORAGE_KEY, "true");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "hidden") {
    return null;
  }

  if (status === "success" || status === "already_subscribed") {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-black text-slate-950">
          {status === "already_subscribed" ? t.alreadySubscribed : t.success}
        </h3>
        <div className="mt-4 inline-block rounded-lg border-2 border-dashed border-emerald-300 bg-white px-6 py-3">
          <span className="font-mono text-2xl font-black tracking-wider text-emerald-700">{code}</span>
        </div>
        <p className="mt-4 text-sm text-emerald-600">
          Użyj tego kodu w koszyku przy następnym zakupie.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-slate-50 shadow-sm">
      <div className="p-8 lg:p-10">
        <div className="max-w-xl">
          <h3 className="text-2xl font-black tracking-tight text-slate-950">{t.title}</h3>
          <p className="mt-3 text-slate-600 leading-relaxed">
            {t.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          {/* Honeypot field for bots */}
          <div className="sr-only" aria-hidden="true">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="email"
                required
                placeholder={t.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus-ring h-12 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-black text-white shadow-soft transition hover:bg-primary/90 disabled:opacity-50"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {t.button}
            </button>
          </div>
          {status === "error" && (
            <p className="mt-3 text-sm font-semibold text-red-600">{t.error}</p>
          )}
          <p className="mt-4 text-[11px] font-medium text-slate-400">
            {t.privacy}
          </p>
        </form>
      </div>
    </div>
  );
}

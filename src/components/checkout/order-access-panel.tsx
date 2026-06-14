"use client";

import { CheckCircle2, Clock, Download, ExternalLink, Loader2, Mail, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { ButtonLink } from "@/components/ui/button";
import { type Locale } from "@/lib/i18n/config";
import { type Dictionary } from "@/lib/i18n/dictionaries";

type AccessLink = {
  courseId: string;
  title: string;
  url: string;
  couponCode: string;
  validUntil: string;
};

type OrderResponse = {
  order: {
    orderNumber: string;
    paymentStatus: string;
    customerEmail: string | null;
    accessEmailSentAt: string | null;
    invoice: {
      id: string;
      invoiceNumber: string;
      status: string;
      buyerEmail: string;
      issuedAt: string;
      pdfUrl: string | null;
    } | null;
    accessLinks: AccessLink[];
  } | null;
  error?: string;
};

type FetchState = "loading" | "processing" | "ready" | "error" | "missing-session";

export function OrderAccessPanel({
  sessionId,
  accessToken,
  locale,
  dictionary
}: {
  sessionId?: string;
  accessToken?: string;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const { clearCart, hydrated: cartHydrated } = useCart();
  const [state, setState] = useState<FetchState>(sessionId || accessToken ? "loading" : "missing-session");
  const [order, setOrder] = useState<OrderResponse["order"]>(null);

  useEffect(() => {
    if (sessionId && cartHydrated) {
      clearCart();
    }
  }, [sessionId, cartHydrated, clearCart]);

  useEffect(() => {
    if (!sessionId && !accessToken) return;

    let cancelled = false;
    let attempts = 0;
    const lookupUrl = sessionId
      ? `/api/orders/session/${encodeURIComponent(sessionId)}`
      : `/api/orders/access/${encodeURIComponent(accessToken ?? "")}`;
    const shouldRetry = Boolean(sessionId);

    async function loadOrder() {
      attempts += 1;

      try {
        const response = await fetch(lookupUrl, {
          cache: "no-store"
        });

        if (response.status === 404) {
          if (!cancelled) setState(shouldRetry ? "processing" : "error");

          if (shouldRetry && attempts < 8) {
            window.setTimeout(loadOrder, 1500);
          }
          return;
        }

        const data = (await response.json()) as OrderResponse;

        if (!response.ok || !data.order) {
          throw new Error(data.error ?? "Order unavailable");
        }

        if (!cancelled) {
          setOrder(data.order);
          setState("ready");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    }

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [sessionId, accessToken]);

  if (state === "missing-session") {
    return <StatusPanel icon={<Clock className="h-6 w-6" />} title={dictionary.checkoutStatus.processingTitle} text={dictionary.checkoutStatus.missingSession} />;
  }

  if (state === "loading" || state === "processing") {
    return (
      <StatusPanel
        icon={state === "loading" ? <Loader2 className="h-6 w-6 animate-spin" /> : <Clock className="h-6 w-6" />}
        title={dictionary.checkoutStatus.processingTitle}
        text={dictionary.checkoutStatus.processingText}
      />
    );
  }

  if (state === "error" || !order) {
    return <StatusPanel icon={<Clock className="h-6 w-6" />} title={dictionary.checkoutStatus.unavailableTitle} text={dictionary.checkoutStatus.lookupUnavailable} />;
  }

  return (
    <section className="mx-auto mt-8 max-w-4xl">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-primary">{dictionary.checkoutStatus.orderDetails}</p>
            <h2 className="mt-2 text-2xl font-black">{dictionary.checkoutStatus.accessTitle}</h2>
          </div>
          <div className="rounded-xl bg-primary-soft px-4 py-3 text-left sm:text-right">
            <p className="text-xs font-semibold text-slate-500">{dictionary.checkoutStatus.orderNumber}</p>
            <p className="mt-1 text-sm font-black text-primary">{order.orderNumber}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <InfoLine icon={<CheckCircle2 className="h-4 w-4" />} label={dictionary.checkoutStatus.paymentStatus} value={order.paymentStatus} />
          <InfoLine icon={<Mail className="h-4 w-4" />} label="E-mail" value={order.customerEmail ?? "-"} />
          {order.invoice ? (
            <InfoLine icon={<CheckCircle2 className="h-4 w-4" />} label={dictionary.checkoutStatus.invoiceNumber} value={order.invoice.invoiceNumber} />
          ) : null}
        </div>
        {order.invoice ? (
          <div className="mt-4 flex flex-col gap-3 rounded-xl bg-primary-soft px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-primary">
              {order.invoice.pdfUrl ? dictionary.checkoutStatus.invoicePrepared : dictionary.checkoutStatus.invoiceProcessing}
            </p>
            {order.invoice.pdfUrl ? (
              <ButtonLink href={order.invoice.pdfUrl} variant="secondary" className="h-10 shrink-0 bg-white">
                <Download className="h-4 w-4" />
                {dictionary.checkoutStatus.downloadInvoice}
              </ButtonLink>
            ) : null}
          </div>
        ) : null}
        {order.accessEmailSentAt ? (
          <p className="mt-4 rounded-xl bg-primary-soft px-4 py-3 text-sm font-semibold text-primary">
            {dictionary.checkoutStatus.sentToEmail}
          </p>
        ) : null}

        <p className="mt-5 text-sm leading-6 text-slate-600">{dictionary.checkoutStatus.accessLead}</p>

        {order.accessLinks.length > 0 ? (
          <div className="mt-6 grid gap-4">
            {order.accessLinks.map((link) => (
              <article key={link.courseId} className="rounded-2xl border border-border bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-black">{link.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-primary">
                        <Ticket className="h-3.5 w-3.5" />
                        {dictionary.checkoutStatus.couponCode}: {link.couponCode}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
                        <Clock className="h-3.5 w-3.5" />
                        {dictionary.checkoutStatus.validUntil}: {formatDate(link.validUntil, locale)}
                      </span>
                    </div>
                  </div>
                  <ButtonLink href={link.url} target="_blank" rel="noreferrer" className="shrink-0">
                    <ExternalLink className="h-4 w-4" />
                    {dictionary.checkoutStatus.openUdemy}
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-2xl bg-primary-soft p-5 text-sm font-semibold text-slate-700">
            {dictionary.checkoutStatus.noAccessLinks}
          </p>
        )}
      </div>
    </section>
  );
}

function StatusPanel({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <section className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border bg-white p-6 text-center shadow-card">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary">{icon}</div>
      <h2 className="mt-5 text-2xl font-black">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </section>
  );
}

function InfoLine({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-primary">{icon}</span>
      <div>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <p className="mt-0.5 font-black">{value}</p>
      </div>
    </div>
  );
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "pl" ? "pl-PL" : locale === "de" ? "de-DE" : "en-US", {
    dateStyle: "medium"
  }).format(new Date(value));
}

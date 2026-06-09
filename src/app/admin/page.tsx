import { Download, ExternalLink, FileText, ShieldCheck, SquareArrowOutUpRight } from "lucide-react";
import { type Prisma } from "@prisma/client";
import { AdminPagination, getAdminPagination, parseAdminPage } from "@/components/admin/admin-pagination";
import { AdminFrame, AdminShell } from "@/components/admin/admin-shell";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { CopyLinkButton } from "@/components/admin/admin-actions";
import { OrderDeleteButton } from "@/components/admin/order-delete-button";
import { UdemyCouponActions } from "@/components/admin/udemy-coupon-actions";
import { UdemyImportForm } from "@/components/admin/udemy-import-form";
import { ButtonLink } from "@/components/ui/button";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { getAdminPath } from "@/lib/admin-routes";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getCurrentPlnExchangeRates } from "@/lib/exchange-rates";
import { prisma } from "@/lib/prisma";
import { getAbsoluteUrl, getInvoiceDownloadPath, getOrderAccessPath } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<{ ordersPage?: string; udemyPage?: string; dateFrom?: string; dateTo?: string }>;
}) {
  if (!isAdminConfigured()) {
    return (
      <AdminShell>
        <div className="mx-auto max-w-lg rounded-xl border border-border bg-white p-6 shadow-card">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary-soft text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h1 className="mt-5 text-2xl font-black">Panel admina nie jest skonfigurowany</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Dodaj `ADMIN_USERNAME` i `ADMIN_PASSWORD` w pliku środowiskowym, a potem uruchom aplikację ponownie.</p>
        </div>
      </AdminShell>
    );
  }

  if (!(await isAdminAuthenticated())) {
    return (
      <AdminShell>
        <AdminLoginForm />
      </AdminShell>
    );
  }

  const { ordersPage: rawOrdersPage, udemyPage: rawUdemyPage, dateFrom: rawDateFrom, dateTo: rawDateTo } = await searchParams;
  const ordersPage = parseAdminPage(rawOrdersPage);
  const udemyPage = parseAdminPage(rawUdemyPage);
  const dateRange = parseAdminDateRange(rawDateFrom, rawDateTo);
  const orderWhere: Prisma.OrderWhereInput = dateRange.where
    ? {
        paymentStatus: "PAID",
        paidAt: dateRange.where
      }
    : {};
  const paidOrderWhere: Prisma.OrderWhereInput = {
    paymentStatus: "PAID",
    ...(dateRange.where ? { paidAt: dateRange.where } : {})
  };
  const ordersPagination = getAdminPagination(ordersPage);
  const udemyPagination = getAdminPagination(udemyPage);
  let databaseError: string | null = null;
  let udemyCouponsError: string | null = null;
  const [orders, totalOrders, paidOrders, invoices, revenueGroups, exchangeRates] = await Promise.all([
    prisma.order.findMany({
      where: orderWhere,
      orderBy: {
        createdAt: "desc"
      },
      skip: ordersPagination.skip,
      take: ordersPagination.take,
      include: {
        items: true,
        invoice: true
      }
    }),
    prisma.order.count({ where: orderWhere }),
    prisma.order.count({ where: paidOrderWhere }),
    prisma.invoice.count({
      where: dateRange.where
        ? {
            order: paidOrderWhere
          }
        : undefined
    }),
    prisma.order.groupBy({
      by: ["currency"],
      where: paidOrderWhere,
      _sum: {
        totalAmount: true
      }
    }),
    getCurrentPlnExchangeRates()
  ]).catch(() => {
    databaseError = "Nie udało się pobrać zamówień. Sprawdź `DATABASE_URL` i migracje Prisma.";
    return [[], 0, 0, 0, [], null] as const;
  });
  const [udemyCoupons, totalUdemyCoupons, activeCoupons] = await Promise.all([
    prisma.udemyCoupon.findMany({
      orderBy: {
        updatedAt: "desc"
      },
      skip: udemyPagination.skip,
      take: udemyPagination.take
    }),
    prisma.udemyCoupon.count(),
    prisma.udemyCoupon.count({ where: { isActive: true } })
  ]).catch(() => {
    udemyCouponsError = "Nie udało się pobrać kodów Udemy. Sprawdź `DATABASE_URL` i migracje Prisma.";
    return [[], 0, 0] as const;
  });
  const activeDiscounts = await prisma.discountCode.count({ where: { isActive: true } }).catch(() => 0);
  const revenueByCurrency = revenueGroups.reduce<Record<string, number>>((totals, group) => {
    const amount = group._sum.totalAmount;
    if (!amount) return totals;

    return {
      ...totals,
      [group.currency]: Number(amount)
    };
  }, {});
  const revenueInPln = calculateRevenueInPln(revenueByCurrency, exchangeRates);

  return (
    <AdminFrame>
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-primary">Admin</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal">Zamówienia i faktury</h1>
          <p className="mt-2 text-sm text-slate-600">Lista zamówień, statusy płatności, faktury PDF i prywatne linki klienta.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat label={dateRange.isCustomRange ? "Zamówienia opłacone w okresie" : "Zamówienia opłacone w bieżącym miesiącu"} value={String(paidOrders)} />
        <Stat label={dateRange.isCustomRange ? "Faktury w okresie" : "Faktury w bieżącym miesiącu"} value={String(invoices)} />
        <Stat label={dateRange.isCustomRange ? "Przychód w okresie" : "Przychód w bieżącym miesiącu"} value={formatRevenue(revenueByCurrency)} />
        <Stat label="Przychód w PLN (NBP)" value={revenueInPln === null ? "Niedostępne" : formatPlnAmount(revenueInPln)} />
        <Stat label="Aktywne kody Udemy" value={String(activeCoupons)} />
        <Stat label="Aktywne rabaty" value={String(activeDiscounts)} />
      </div>

      <section className="mt-6 rounded-xl border border-border bg-white p-4 shadow-card">
        <form className="grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]" action={getAdminPath()}>
          <label className="text-sm font-semibold text-slate-700">
            Od
            <input
              type="date"
              name="dateFrom"
              defaultValue={dateRange.dateFrom}
              className="focus-ring mt-2 h-11 w-full rounded-[10px] border border-border bg-white px-3 text-sm text-slate-900"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Do
            <input
              type="date"
              name="dateTo"
              defaultValue={dateRange.dateTo}
              className="focus-ring mt-2 h-11 w-full rounded-[10px] border border-border bg-white px-3 text-sm text-slate-900"
            />
          </label>
          <div className="flex items-end">
            <button className="focus-ring inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition duration-200 hover:bg-[#2f16d8] md:w-auto">
              Filtruj
            </button>
          </div>
          {dateRange.isCustomRange ? (
            <div className="flex items-end">
              <ButtonLink className="h-11 w-full px-5 md:w-auto" href="/admin" variant="secondary">
                Wyczyść
              </ButtonLink>
            </div>
          ) : null}
        </form>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          Przychód liczony jest z opłaconych zamówień według daty płatności.
          {dateRange.error ? <span className="font-semibold text-amber-700"> {dateRange.error}</span> : null}
        </p>
      </section>

      {databaseError ? <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{databaseError}</p> : null}

      <section className="mt-6 overflow-hidden rounded-xl border border-border bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-[1080px] w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <Th>Zamówienie</Th>
                <Th>Klient</Th>
                <Th>Kwota</Th>
                <Th>Status</Th>
                <Th>Faktura</Th>
                <Th>Produkty</Th>
                <Th>Akcje</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length > 0 ? (
                orders.map((order) => {
                  const locale = isLocale(order.locale) ? order.locale : "pl";
                  const orderUrl = getAbsoluteUrl(getOrderAccessPath(locale, order.accessToken));
                  const invoiceUrl = order.invoice?.pdfUrl ? getInvoiceDownloadPath(order.invoice.id, order.accessToken) : null;

                  return (
                    <tr key={order.id} className="align-top">
                      <Td>
                        <p className="font-black text-slate-950">{order.orderNumber}</p>
                        <p className="mt-1 text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                      </Td>
                      <Td>
                        <p className="font-semibold text-slate-900">{order.customerEmail ?? "-"}</p>
                        <p className="mt-1 text-xs text-slate-500">{order.customerName ?? "Brak imienia"}</p>
                      </Td>
                      <Td>
                        <p className="font-black">{formatOrderPrice(Number(order.totalAmount), locale, order.currency)}</p>
                        {Number(order.discountAmount) > 0 ? <p className="mt-1 text-xs text-slate-500">Rabat: {formatOrderPrice(Number(order.discountAmount), locale, order.currency)}</p> : null}
                      </Td>
                      <Td>
                        <StatusPill tone={order.paymentStatus === "PAID" ? "success" : order.paymentStatus === "UNPAID" ? "warning" : "neutral"}>{order.paymentStatus}</StatusPill>
                        <p className="mt-2 text-xs text-slate-500">{order.status}</p>
                      </Td>
                      <Td>
                        {order.invoice ? (
                          <div className="space-y-2">
                            <p className="font-semibold">{order.invoice.invoiceNumber}</p>
                            <StatusPill tone={order.invoice.status === "SENT" ? "success" : "warning"}>{order.invoice.status}</StatusPill>
                          </div>
                        ) : (
                          <span className="text-slate-500">Brak</span>
                        )}
                      </Td>
                      <Td>
                        <ul className="max-w-xs space-y-1 text-xs leading-5 text-slate-600">
                          {order.items.map((item) => (
                            <li key={item.id}>
                              {item.quantity} x {item.title}
                            </li>
                          ))}
                        </ul>
                      </Td>
                      <Td>
                        <div className="flex flex-wrap gap-2">
                          <ButtonLink href={`/admin/orders/${order.id}`} variant="secondary" className="h-9 px-3">
                            <SquareArrowOutUpRight className="h-4 w-4" />
                            Szczegóły
                          </ButtonLink>
                          <ButtonLink href={orderUrl} target="_blank" rel="noreferrer" variant="secondary" className="h-9 px-3">
                            <ExternalLink className="h-4 w-4" />
                            Podgląd
                          </ButtonLink>
                          <CopyLinkButton value={orderUrl} />
                          {invoiceUrl ? (
                            <ButtonLink href={invoiceUrl} target="_blank" rel="noreferrer" variant="secondary" className="h-9 px-3">
                              <Download className="h-4 w-4" />
                              PDF
                            </ButtonLink>
                          ) : null}
                          <OrderDeleteButton orderId={order.id} orderNumber={order.orderNumber} label="Usuń" className="h-9 px-3 text-red-600 hover:border-red-300 hover:text-red-700" />
                        </div>
                      </Td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-slate-500">
                    <FileText className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-3 font-semibold">Brak zamówień do wyświetlenia.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination
          basePath="/admin"
          page={ordersPage}
          totalItems={totalOrders}
          pageParam="ordersPage"
          params={{ udemyPage, dateFrom: dateRange.dateFrom, dateTo: dateRange.dateTo }}
        />
      </section>

      <section className="mt-8">
        <UdemyImportForm />
      </section>

      {udemyCouponsError ? <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{udemyCouponsError}</p> : null}

      <section className="mt-6 overflow-hidden rounded-xl border border-border bg-white shadow-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-xl font-black">Kody Udemy</h2>
          <p className="mt-1 text-sm text-slate-600">Lista kodów zaimportowanych do bazy.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <Th>Kurs</Th>
                <Th>Locale</Th>
                <Th>Kod</Th>
                <Th>Ważny do</Th>
                <Th>Status</Th>
                <Th>URL</Th>
                <Th>Akcje</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {udemyCoupons.length > 0 ? (
                udemyCoupons.map((coupon) => (
                  <tr key={coupon.id} className="align-top">
                    <Td>
                      <p className="font-black text-slate-950">{coupon.courseId}</p>
                      <p className="mt-1 text-xs text-slate-500">{coupon.courseTitle ?? "Bez tytułu"}</p>
                    </Td>
                    <Td>
                      <span className="font-black uppercase">{coupon.locale}</span>
                    </Td>
                    <Td>
                      <span className="font-mono text-xs font-black">{coupon.couponCode}</span>
                    </Td>
                    <Td>{formatDate(coupon.validUntil)}</Td>
                    <Td>
                      <StatusPill tone={coupon.isActive ? "success" : "neutral"}>{coupon.isActive ? "ACTIVE" : "INACTIVE"}</StatusPill>
                    </Td>
                    <Td>
                      <a href={coupon.udemyUrl} target="_blank" rel="noreferrer" className="inline-flex max-w-xs items-center gap-1 truncate text-xs font-semibold text-primary">
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        {coupon.udemyUrl}
                      </a>
                    </Td>
                    <Td>
                      <UdemyCouponActions
                        coupon={{
                          id: coupon.id,
                          courseId: coupon.courseId,
                          locale: coupon.locale,
                          courseTitle: coupon.courseTitle,
                          udemyUrl: coupon.udemyUrl,
                          couponCode: coupon.couponCode,
                          validUntil: coupon.validUntil.toISOString(),
                          isActive: coupon.isActive
                        }}
                      />
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-slate-500">
                    <FileText className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-3 font-semibold">Brak kodów Udemy do wyświetlenia.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination
          basePath="/admin"
          page={udemyPage}
          totalItems={totalUdemyCoupons}
          pageParam="udemyPage"
          params={{ ordersPage, dateFrom: dateRange.dateFrom, dateTo: dateRange.dateTo }}
        />
      </section>
    </AdminFrame>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-black">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-4">{children}</td>;
}

function StatusPill({ children, tone }: { children: React.ReactNode; tone: "success" | "warning" | "neutral" }) {
  const className =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "warning"
        ? "bg-amber-50 text-amber-700"
        : "bg-slate-100 text-slate-600";

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${className}`}>{children}</span>;
}

function formatOrderPrice(amount: number, locale: Locale, currency: string) {
  return new Intl.NumberFormat(locale === "pl" ? "pl-PL" : locale === "de" ? "de-DE" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2
  }).format(amount);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(value);
}

function formatRevenue(revenueByCurrency: Record<string, number>) {
  const entries = Object.entries(revenueByCurrency);

  if (entries.length === 0) return "0,00 zł";

  return entries
    .map(([currency, amount]) =>
      new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency,
        minimumFractionDigits: 2
      }).format(amount)
    )
    .join(" / ");
}

function parseAdminDateRange(rawDateFrom?: string, rawDateTo?: string) {
  const defaultRange = getDefaultAdminDateRange();
  const hasCustomDateFrom = typeof rawDateFrom === "string" && rawDateFrom.length > 0;
  const hasCustomDateTo = typeof rawDateTo === "string" && rawDateTo.length > 0;
  const dateFrom = isDateInputValue(rawDateFrom) ? rawDateFrom : defaultRange.dateFrom;
  const dateTo = isDateInputValue(rawDateTo) ? rawDateTo : defaultRange.dateTo;
  const start = parseDateInputBoundary(dateFrom, "start");
  const end = parseDateInputBoundary(dateTo, "end");
  let error = "";

  if ((hasCustomDateFrom && !isDateInputValue(rawDateFrom)) || (hasCustomDateTo && !isDateInputValue(rawDateTo))) {
    error = "Nieprawidłowy format daty został pominięty.";
  }

  if (start && end && start > end) {
    return {
      dateFrom,
      dateTo,
      where: {
        gte: parseDateInputBoundary(defaultRange.dateFrom, "start"),
        lte: parseDateInputBoundary(defaultRange.dateTo, "end")
      },
      isCustomRange: Boolean(hasCustomDateFrom || hasCustomDateTo),
      error: "Data początkowa nie może być późniejsza niż końcowa."
    };
  }

  const where: Prisma.DateTimeNullableFilter = {
    gte: start,
    lte: end
  };

  return {
    dateFrom,
    dateTo,
    where,
    isCustomRange: Boolean(hasCustomDateFrom || hasCustomDateTo),
    error
  };
}

function getDefaultAdminDateRange() {
  const today = getWarsawDateInputValue();
  const [year, month] = today.split("-");

  return {
    dateFrom: `${year}-${month}-01`,
    dateTo: today
  };
}

function getWarsawDateInputValue(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

function isDateInputValue(value?: string): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);

  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function parseDateInputBoundary(value: string, boundary: "start" | "end") {
  const [year, month, day] = value.split("-").map(Number);
  const utcGuess = Date.UTC(
    year,
    month - 1,
    day,
    boundary === "start" ? 0 : 23,
    boundary === "start" ? 0 : 59,
    boundary === "start" ? 0 : 59,
    boundary === "start" ? 0 : 999
  );
  const offsetMinutes = getTimezoneOffsetMinutes(new Date(utcGuess), "Europe/Warsaw");

  return new Date(utcGuess - offsetMinutes * 60_000);
}

function getTimezoneOffsetMinutes(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const asUTC = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), Number(values.hour), Number(values.minute), Number(values.second), date.getUTCMilliseconds());

  return (asUTC - date.getTime()) / 60000;
}

function calculateRevenueInPln(revenueByCurrency: Record<string, number>, exchangeRates: Record<string, number> | null) {
  if (!exchangeRates) return null;

  let total = 0;

  for (const [currency, amount] of Object.entries(revenueByCurrency)) {
    if (!amount) continue;
    const rate = currency.toUpperCase() === "PLN" ? 1 : exchangeRates[currency.toUpperCase()];

    if (!rate) {
      return null;
    }

    total += amount * rate;
  }

  return total;
}

function formatPlnAmount(amount: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2
  }).format(amount);
}

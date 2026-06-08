import { Download, ExternalLink, FileText, ShieldCheck, SquareArrowOutUpRight } from "lucide-react";
import { AdminPagination, getAdminPagination, parseAdminPage } from "@/components/admin/admin-pagination";
import { AdminFrame, AdminShell } from "@/components/admin/admin-shell";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { CopyLinkButton } from "@/components/admin/admin-actions";
import { UdemyCouponActions } from "@/components/admin/udemy-coupon-actions";
import { UdemyImportForm } from "@/components/admin/udemy-import-form";
import { ButtonLink } from "@/components/ui/button";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { getAbsoluteUrl, getInvoiceDownloadPath, getOrderAccessPath } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<{ ordersPage?: string; udemyPage?: string }>;
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

  const { ordersPage: rawOrdersPage, udemyPage: rawUdemyPage } = await searchParams;
  const ordersPage = parseAdminPage(rawOrdersPage);
  const udemyPage = parseAdminPage(rawUdemyPage);
  const ordersPagination = getAdminPagination(ordersPage);
  const udemyPagination = getAdminPagination(udemyPage);
  let databaseError: string | null = null;
  let udemyCouponsError: string | null = null;
  const [orders, totalOrders, paidOrders, invoices] = await Promise.all([
    prisma.order.findMany({
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
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: "PAID" } }),
    prisma.invoice.count()
  ]).catch(() => {
    databaseError = "Nie udało się pobrać zamówień. Sprawdź `DATABASE_URL` i migracje Prisma.";
    return [[], 0, 0, 0] as const;
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
  const revenueByCurrency = orders.reduce<Record<string, number>>((totals, order) => {
    if (order.paymentStatus !== "PAID") return totals;

    return {
      ...totals,
      [order.currency]: (totals[order.currency] ?? 0) + Number(order.totalAmount)
    };
  }, {});

  return (
    <AdminFrame>
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-primary">Admin</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal">Zamówienia i faktury</h1>
          <p className="mt-2 text-sm text-slate-600">Lista zamówień, statusy płatności, faktury PDF i prywatne linki klienta.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Zamówienia opłacone" value={String(paidOrders)} />
        <Stat label="Faktury" value={String(invoices)} />
        <Stat label="Przychód z listy" value={formatRevenue(revenueByCurrency)} />
        <Stat label="Aktywne kody Udemy" value={String(activeCoupons)} />
        <Stat label="Aktywne rabaty" value={String(activeDiscounts)} />
      </div>

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
          params={{ udemyPage }}
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
          params={{ ordersPage }}
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

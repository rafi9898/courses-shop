import { ArrowLeft, Download, ExternalLink, Mail, Receipt, ShoppingBag, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/admin/admin-actions";
import { AdminFrame, AdminShell } from "@/components/admin/admin-shell";
import { OrderDeleteButton } from "@/components/admin/order-delete-button";
import { OrderResendEmailButton } from "@/components/admin/order-resend-email-button";
import { ButtonLink } from "@/components/ui/button";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { prisma } from "@/lib/prisma";
import { getAbsoluteUrl, getInvoiceDownloadPath, getOrderAccessPath } from "@/lib/routes";
import { getUdemyAccessLinks } from "@/lib/udemy-access";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailsPage({
  params
}: {
  params: Promise<{ orderId: string }>;
}) {
  if (!isAdminConfigured() || !(await isAdminAuthenticated())) {
    return (
      <AdminShell>
        <div className="mx-auto max-w-lg rounded-xl border border-border bg-white p-6 shadow-card">
          <h1 className="text-2xl font-black">Brak dostępu</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Zaloguj się w panelu admina, aby zobaczyć szczegóły zamówienia.</p>
          <ButtonLink href="/admin" className="mt-5">
            Przejdź do logowania
          </ButtonLink>
        </div>
      </AdminShell>
    );
  }

  const { orderId } = await params;
  const order = await prisma.order
    .findUnique({
      where: { id: orderId },
      include: {
        items: true,
        invoice: true
      }
    })
    .catch(() => null);

  if (!order) {
    notFound();
  }

  const locale = isLocale(order.locale) ? order.locale : "pl";
  const orderUrl = getAbsoluteUrl(getOrderAccessPath(locale, order.accessToken));
  const invoiceUrl = order.invoice?.pdfUrl ? getInvoiceDownloadPath(order.invoice.id, order.accessToken) : null;
  const accessLinks = await getUdemyAccessLinks(
    order.items.map((item) => ({
      productId: item.productId,
      productType: item.productType
    })),
    order.locale
  );

  return (
    <AdminFrame>
      <div className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <ButtonLink href="/admin" variant="ghost" className="h-10 px-0 text-slate-600 hover:bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Wróć do panelu
          </ButtonLink>
          <p className="mt-4 text-sm font-black uppercase text-primary">Zamówienie</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal">{order.orderNumber}</h1>
          <p className="mt-2 text-sm text-slate-600">Szczegóły klienta, produktów, faktury, e-maila i linków Udemy.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyLinkButton value={orderUrl} />
          <ButtonLink href={orderUrl} target="_blank" rel="noreferrer" variant="secondary" className="h-10 px-4">
            <ExternalLink className="h-4 w-4" />
            Link klienta
          </ButtonLink>
          {invoiceUrl ? (
            <ButtonLink href={invoiceUrl} target="_blank" rel="noreferrer" variant="secondary" className="h-10 px-4">
              <Download className="h-4 w-4" />
              Faktura PDF
            </ButtonLink>
          ) : null}
          <OrderDeleteButton orderId={order.id} orderNumber={order.orderNumber} redirectTo="/admin" className="h-10 px-4 text-red-600 hover:border-red-300 hover:text-red-700" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <InfoCard label="Płatność" value={order.paymentStatus} note={order.status} />
        <InfoCard label="Kwota" value={formatOrderPrice(Number(order.totalAmount), locale, order.currency)} note={order.discountCode ? `Kod rabatowy: ${order.discountCode}` : "Bez kodu rabatowego"} />
        <InfoCard label="E-mail wysłany" value={order.accessEmailSentAt ? "Tak" : "Nie"} note={order.accessEmailSentAt ? formatDate(order.accessEmailSentAt) : order.accessEmailError ?? "Brak wysyłki"} />
        <InfoCard label="Telegram" value={order.telegramNotifiedAt ? "Wysłany" : "Nie"} note={order.telegramNotifiedAt ? formatDate(order.telegramNotifiedAt) : order.telegramNotifyError ?? "Brak wysyłki"} />
        <InfoCard label="Faktura" value={order.invoice ? order.invoice.status : "Brak"} note={order.invoice?.invoiceNumber ?? "Nie wystawiono"} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Section icon={<ShoppingBag className="h-5 w-5" />} title="Produkty">
            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <Th>Produkt</Th>
                    <Th>Typ</Th>
                    <Th>Ilość</Th>
                    <Th>Cena</Th>
                    <Th>Suma</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <Td>
                        <p className="font-black">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.productId}</p>
                      </Td>
                      <Td>{item.productType}</Td>
                      <Td>{item.quantity}</Td>
                      <Td>{formatOrderPrice(Number(item.unitAmount), locale, order.currency)}</Td>
                      <Td className="font-black">{formatOrderPrice(Number(item.lineTotalAmount), locale, order.currency)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section icon={<ExternalLink className="h-5 w-5" />} title="Aktywne linki Udemy dla tego zamówienia">
            {accessLinks.length > 0 ? (
              <div className="grid gap-3">
                {accessLinks.map((link) => (
                  <article key={link.courseId} className="rounded-xl border border-border p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-black">{link.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{link.courseId}</p>
                        <p className="mt-2 font-mono text-xs font-black text-primary">{link.couponCode}</p>
                        <p className="mt-1 text-xs text-slate-500">Ważny do: {formatDate(new Date(link.validUntil))}</p>
                      </div>
                      <ButtonLink href={link.url} target="_blank" rel="noreferrer" variant="secondary" className="h-9 px-3">
                        <ExternalLink className="h-4 w-4" />
                        Otwórz
                      </ButtonLink>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">Brak aktywnych kodów Udemy dla produktów z tego zamówienia.</p>
            )}
          </Section>
        </div>

        <aside className="space-y-6">
          <Section icon={<UserRound className="h-5 w-5" />} title="Klient">
            <InfoLine label="E-mail" value={order.customerEmail ?? "-"} />
            <InfoLine label="Imię i nazwisko" value={order.customerName ?? "-"} />
            <InfoLine label="Locale" value={order.locale} />
            <InfoLine label="Stripe session" value={order.stripeCheckoutSessionId} />
            <InfoLine label="Payment intent" value={order.stripePaymentIntentId ?? "-"} />
            <InfoLine label="Utworzono" value={formatDate(order.createdAt)} />
            <InfoLine label="Opłacono" value={order.paidAt ? formatDate(order.paidAt) : "-"} />
          </Section>

          <Section icon={<Mail className="h-5 w-5" />} title="E-mail po zakupie">
            <InfoLine label="Status" value={order.accessEmailSentAt ? "Wysłany" : "Niewysłany"} />
            <InfoLine label="Ostatnia wysyłka" value={order.accessEmailSentAt ? formatDate(order.accessEmailSentAt) : "-"} />
            <InfoLine label="Błąd" value={order.accessEmailError ?? "-"} />
            <div className="mt-4">
              <OrderResendEmailButton orderId={order.id} />
            </div>
          </Section>

          <Section icon={<Receipt className="h-5 w-5" />} title="Faktura">
            {order.invoice ? (
              <>
                <InfoLine label="Numer" value={order.invoice.invoiceNumber} />
                <InfoLine label="Status" value={order.invoice.status} />
                <InfoLine label="Nabywca" value={order.invoice.buyerCompany || order.invoice.buyerName} />
                <InfoLine label="E-mail" value={order.invoice.buyerEmail} />
                <InfoLine label="Adres" value={`${order.invoice.buyerAddressLine1}, ${order.invoice.buyerPostalCode} ${order.invoice.buyerCity}`} />
                <InfoLine label="NIP/VAT" value={order.invoice.buyerTaxId ?? "-"} />
                <InfoLine label="Wystawiono" value={formatDate(order.invoice.issuedAt)} />
                {invoiceUrl ? (
                  <ButtonLink href={invoiceUrl} target="_blank" rel="noreferrer" variant="secondary" className="mt-4 h-10 w-full px-4">
                    <Download className="h-4 w-4" />
                    Pobierz PDF
                  </ButtonLink>
                ) : null}
              </>
            ) : (
              <p className="text-sm font-semibold text-slate-600">Klient nie poprosił o fakturę albo faktura nie została wystawiona.</p>
            )}
          </Section>
        </aside>
      </div>
    </AdminFrame>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">{icon}</span>
        <h2 className="text-xl font-black">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InfoCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border py-3 last:border-b-0">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-black">{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-4 ${className}`}>{children}</td>;
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

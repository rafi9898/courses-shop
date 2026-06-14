import { Percent, Tags } from "lucide-react";
import type React from "react";
import { AdminPagination, getAdminPagination, parseAdminPage } from "@/components/admin/admin-pagination";
import { AdminFrame, AdminShell } from "@/components/admin/admin-shell";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { DiscountCodeActions } from "@/components/admin/discount-code-actions";
import { DiscountCodeForm } from "@/components/admin/discount-code-form";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDiscountsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  if (!isAdminConfigured()) {
    return (
      <AdminShell>
        <ConfigNotice />
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

  const { page: rawPage } = await searchParams;
  const page = parseAdminPage(rawPage);
  const { skip, take } = getAdminPagination(page);
  const now = new Date();
  let databaseError: string | null = null;
  const [discountCodes, totalDiscountCodes, activeDiscountCodes, expiredDiscountCodes] = await Promise.all([
    prisma.discountCode.findMany({
      orderBy: [{ updatedAt: "desc" }, { code: "asc" }],
      skip,
      take
    }),
    prisma.discountCode.count(),
    prisma.discountCode.count({ where: { isActive: true } }),
    prisma.discountCode.count({ where: { validUntil: { lt: now } } })
  ]).catch(() => {
    databaseError = "Nie udało się pobrać kodów rabatowych. Sprawdź `DATABASE_URL`, uruchom migracje i seed katalogu.";
    return [[], 0, 0, 0] as const;
  });

  return (
    <AdminFrame>
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-primary">Sprzedaż</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal">Kody rabatowe</h1>
          <p className="mt-2 text-sm text-slate-600">Twórz, edytuj i wyłączaj rabaty używane w koszyku i checkoutcie.</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary-soft text-primary">
          <Percent className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Wszystkie" value={String(totalDiscountCodes)} />
        <Stat label="Aktywne" value={String(activeDiscountCodes)} />
        <Stat label="Wygaszone" value={String(expiredDiscountCodes)} />
      </div>

      <section className="mt-6">
        <DiscountCodeForm />
      </section>

      {databaseError ? <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{databaseError}</p> : null}

      <section className="mt-6 overflow-hidden rounded-xl border border-border bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-[1080px] w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <Th>Kod</Th>
                <Th>Rabat</Th>
                <Th>Użycie</Th>
                <Th>Ważność</Th>
                <Th>Opis</Th>
                <Th>Status</Th>
                <Th>Akcje</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {discountCodes.length > 0 ? (
                discountCodes.map((discount) => (
                  <tr key={discount.id} className="align-top">
                    <Td>
                      <p className="font-black text-slate-950">{discount.code}</p>
                      <p className="mt-1 text-xs text-slate-500">{discount.id}</p>
                    </Td>
                    <Td>
                      <p className="font-black">{discount.percentage}%</p>
                    </Td>
                    <Td>
                      <p className="font-black">
                        {discount.usedCount}/{discount.usageLimit ?? "∞"}
                      </p>
                    </Td>
                    <Td>
                      <p>{formatDate(discount.validFrom)}</p>
                      <p className="mt-1 text-xs text-slate-500">{discount.validUntil ? `do ${formatDate(discount.validUntil)}` : "bez terminu końca"}</p>
                    </Td>
                    <Td>
                      <p className="max-w-sm text-xs leading-5 text-slate-600">{discount.description ?? "Brak opisu"}</p>
                    </Td>
                    <Td>
                      <StatusPill active={discount.isActive} />
                    </Td>
                    <Td>
                      <DiscountCodeActions
                        discount={{
                          id: discount.id,
                          code: discount.code,
                          percentage: discount.percentage,
                          description: discount.description ?? "",
                          validFrom: formatDateInput(discount.validFrom),
                          validUntil: formatDateInput(discount.validUntil),
                          usageLimit: discount.usageLimit ?? "",
                          usedCount: discount.usedCount,
                          isActive: discount.isActive
                        }}
                      />
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-slate-500">
                    <Tags className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-3 font-semibold">Brak kodów rabatowych w bazie.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination basePath="/admin/discounts" page={page} totalItems={totalDiscountCodes} />
      </section>
    </AdminFrame>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-border bg-white p-4 shadow-card">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </article>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-black">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-4">{children}</td>;
}

function StatusPill({ active }: { active: boolean }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{active ? "ACTIVE" : "INACTIVE"}</span>;
}

function formatDate(value: Date | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium" }).format(value);
}

function formatDateInput(value: Date | null) {
  if (!value) return "";
  return value.toISOString().slice(0, 10);
}

function ConfigNotice() {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-border bg-white p-6 shadow-card">
      <h1 className="text-2xl font-black">Panel admina nie jest skonfigurowany</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">Dodaj `ADMIN_USERNAME` i `ADMIN_PASSWORD` w pliku środowiskowym, a potem uruchom aplikację ponownie.</p>
    </div>
  );
}

import { Download, Mail, Users } from "lucide-react";
import { AdminFrame, AdminShell } from "@/components/admin/admin-shell";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AdminPagination, getAdminPagination, parseAdminPage } from "@/components/admin/admin-pagination";
import { NewsletterDeleteButton } from "@/components/admin/newsletter-delete-button";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  if (!isAdminConfigured()) {
    return (
      <AdminShell>
        <div className="mx-auto max-w-lg rounded-xl border border-border bg-white p-6 shadow-card">
          <h1 className="text-2xl font-black">Panel admina nie jest skonfigurowany</h1>
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

  const { page: rawPage } = await searchParams;
  const page = parseAdminPage(rawPage);
  const pagination = getAdminPagination(page);

  const [subscribers, totalSubscribers] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.take
    }),
    prisma.newsletterSubscriber.count()
  ]);

  return (
    <AdminFrame>
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-primary">Newsletter</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal">Subskrybenci</h1>
          <p className="mt-2 text-sm text-slate-600">Zarządzaj listą mailingową i eksportuj dane do CSV.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/admin/newsletter/export"
            className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition duration-200 hover:bg-[#2f16d8]"
          >
            <Download className="h-4 w-4" />
            Eksportuj CSV
          </a>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Razem subskrybentów</p>
              <p className="text-2xl font-black">{totalSubscribers}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-6 overflow-hidden rounded-xl border border-border bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4 font-black">Email</th>
                <th className="px-5 py-4 font-black">Locale</th>
                <th className="px-5 py-4 font-black">Kod rabatowy</th>
                <th className="px-5 py-4 font-black">Data zapisu</th>
                <th className="px-5 py-4 font-black text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers.length > 0 ? (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4 font-semibold text-slate-900">{sub.email}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black uppercase text-slate-600">
                        {sub.locale}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <code className="rounded bg-slate-50 px-2 py-1 font-mono text-xs font-black text-slate-700">
                        {sub.discountCode || "Brak"}
                      </code>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Intl.DateTimeFormat("pl-PL", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      }).format(sub.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <NewsletterDeleteButton id={sub.id} email={sub.email} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <Mail className="mx-auto h-12 w-12 text-slate-200" />
                    <p className="mt-4 font-semibold">Brak subskrybentów w bazie.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination
          basePath="/admin/newsletter"
          page={page}
          totalItems={totalSubscribers}
        />
      </section>
    </AdminFrame>
  );
}

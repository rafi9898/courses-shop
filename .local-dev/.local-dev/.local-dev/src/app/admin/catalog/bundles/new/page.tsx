import { ArrowLeft } from "lucide-react";
import { parseAdminLocale } from "@/components/admin/catalog-locale-switcher";
import { AdminFrame, AdminShell } from "@/components/admin/admin-shell";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { BundleForm } from "@/components/admin/catalog-forms";
import { ButtonLink } from "@/components/ui/button";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewBundlePage({
  searchParams
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  if (!isAdminConfigured()) return <AdminShell><AdminLoginForm /></AdminShell>;
  if (!(await isAdminAuthenticated())) return <AdminShell><AdminLoginForm /></AdminShell>;

  const { locale: rawLocale } = await searchParams;
  const locale = parseAdminLocale(rawLocale);
  let databaseError: string | null = null;
  const [categories, courses] = await Promise.all([
    prisma.category
      .findMany({
        where: { isActive: true, locale },
        orderBy: [{ sortOrder: "asc" }, { label: "asc" }]
      })
      .catch(() => {
        databaseError = "Nie udało się pobrać kategorii i kursów do formularza pakietu. Sprawdź `DATABASE_URL`, uruchom migracje i seed katalogu.";
        return [];
      }),
    prisma.course
      .findMany({
        where: { locale },
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
        select: {
          id: true,
          title: true,
          catalogKey: true,
          isActive: true
        }
      })
      .catch(() => {
        databaseError = "Nie udało się pobrać kategorii i kursów do formularza pakietu. Sprawdź `DATABASE_URL`, uruchom migracje i seed katalogu.";
        return [];
      })
  ]);

  return (
    <AdminFrame>
      <ButtonLink href={`/admin/catalog/bundles?locale=${locale}`} variant="ghost" className="mb-4 h-10 px-0 text-slate-600 hover:bg-transparent">
        <ArrowLeft className="h-4 w-4" />
        Wróć do pakietów
      </ButtonLink>
      {databaseError ? <DatabaseNotice message={databaseError} /> : <BundleForm categories={categories} courses={courses} locale={locale} />}
    </AdminFrame>
  );
}

function DatabaseNotice({ message }: { message: string }) {
  return <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{message}</p>;
}

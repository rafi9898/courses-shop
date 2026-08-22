import { ArrowLeft } from "lucide-react";
import { parseAdminLocale } from "@/components/admin/catalog-locale-switcher";
import { AdminFrame, AdminShell } from "@/components/admin/admin-shell";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { CourseForm } from "@/components/admin/catalog-forms";
import { ButtonLink } from "@/components/ui/button";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewCoursePage({
  searchParams
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  if (!isAdminConfigured()) return <AdminShell><AdminLoginForm /></AdminShell>;
  if (!(await isAdminAuthenticated())) return <AdminShell><AdminLoginForm /></AdminShell>;

  const { locale: rawLocale } = await searchParams;
  const locale = parseAdminLocale(rawLocale);
  let databaseError: string | null = null;
  const categories = await prisma.category
    .findMany({
      where: { isActive: true, locale },
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }]
    })
    .catch(() => {
      databaseError = "Nie udało się pobrać kategorii do formularza kursu. Sprawdź `DATABASE_URL`, uruchom migracje i seed katalogu.";
      return [];
    });

  return (
    <AdminFrame>
      <ButtonLink href={`/admin/catalog/courses?locale=${locale}`} variant="ghost" className="mb-4 h-10 px-0 text-slate-600 hover:bg-transparent">
        <ArrowLeft className="h-4 w-4" />
        Wróć do kursów
      </ButtonLink>
      {databaseError ? <DatabaseNotice message={databaseError} /> : <CourseForm categories={categories} locale={locale} />}
    </AdminFrame>
  );
}

function DatabaseNotice({ message }: { message: string }) {
  return <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{message}</p>;
}

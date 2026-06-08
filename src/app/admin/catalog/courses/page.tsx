import { Edit, GraduationCap, Plus, Trash2 } from "lucide-react";
import { CatalogLocaleSwitcher, parseAdminLocale } from "@/components/admin/catalog-locale-switcher";
import { AdminFrame, AdminShell } from "@/components/admin/admin-shell";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { Button, ButtonLink } from "@/components/ui/button";
import { deleteCourseAction } from "@/lib/admin-catalog-actions";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage({
  searchParams
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  if (!isAdminConfigured()) return <AdminShell><AdminLoginForm /></AdminShell>;
  if (!(await isAdminAuthenticated())) return <AdminShell><AdminLoginForm /></AdminShell>;

  const { locale: rawLocale } = await searchParams;
  const locale = parseAdminLocale(rawLocale);
  let databaseError: string | null = null;
  const courses = await prisma.course
    .findMany({
      where: { locale },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      include: {
        category: true,
        _count: {
          select: {
            bundleCourses: true
          }
        }
      }
    })
    .catch(() => {
      databaseError = "Nie udało się pobrać kursów. Sprawdź `DATABASE_URL`, uruchom migracje i seed katalogu.";
      return [];
    });

  return (
    <AdminFrame>
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-primary">Katalog</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal">Kursy</h1>
          <p className="mt-2 text-sm text-slate-600">Dodawanie i edycja kursów, cen, slugów oraz programu nauki dla wybranego języka.</p>
          <CatalogLocaleSwitcher activeLocale={locale} basePath="/admin/catalog/courses" />
        </div>
        <ButtonLink href={`/admin/catalog/courses/new?locale=${locale}`} className="h-11 px-4">
          <Plus className="h-4 w-4" />
          Dodaj kurs
        </ButtonLink>
      </div>

      {databaseError ? <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{databaseError}</p> : null}

      <section className="mt-6 overflow-hidden rounded-xl border border-border bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-[1120px] w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <Th>Kurs</Th>
                <Th>Kategoria</Th>
                <Th>Ceny</Th>
                <Th>Meta</Th>
                <Th>Pakiety</Th>
                <Th>Status</Th>
                <Th>Akcje</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course.id} className="align-top">
                    <Td>
                      <p className="font-black text-slate-950">{course.title}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{course.catalogKey}</p>
                      <p className="mt-1 text-xs text-slate-500">{course.locale.toUpperCase()} / {course.slug}</p>
                    </Td>
                    <Td>
                      <p className="font-semibold">{course.category.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{course.categoryId}</p>
                    </Td>
                    <Td>
                      <p>{formatMoney(Number(course.price), course.currency)}</p>
                      <p className="mt-1 text-xs text-slate-500">Regularna: {formatMoney(Number(course.regularPrice), course.currency)}</p>
                    </Td>
                    <Td>
                      <p>Poziom: {course.level}</p>
                      <p className="mt-1">Ocena: {String(course.rating)} / {course.reviews}</p>
                      <p className="mt-1">{course.durationHours}h, {course.lessons} lekcji</p>
                    </Td>
                    <Td>{course._count.bundleCourses}</Td>
                    <Td>
                      <StatusPill active={course.isActive} />
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-2">
                        <ButtonLink href={`/admin/catalog/courses/${course.id}?locale=${locale}`} variant="secondary" className="h-9 px-3">
                          <Edit className="h-4 w-4" />
                          Edytuj
                        </ButtonLink>
                        <form action={deleteCourseAction}>
                          <input type="hidden" name="courseId" value={course.id} />
                          <input type="hidden" name="locale" value={locale} />
                          <Button type="submit" variant="secondary" className="h-9 px-3 text-red-700 hover:border-red-300 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                            Usuń
                          </Button>
                        </form>
                      </div>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-slate-500">
                    <GraduationCap className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-3 font-semibold">Brak kursów w bazie.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminFrame>
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

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
    minimumFractionDigits: 2
  }).format(amount);
}

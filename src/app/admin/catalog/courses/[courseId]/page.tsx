import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminFrame, AdminShell } from "@/components/admin/admin-shell";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { CourseForm } from "@/components/admin/catalog-forms";
import { ButtonLink } from "@/components/ui/button";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({
  params
}: {
  params: Promise<{ courseId: string }>;
}) {
  if (!isAdminConfigured()) return <AdminShell><AdminLoginForm /></AdminShell>;
  if (!(await isAdminAuthenticated())) return <AdminShell><AdminLoginForm /></AdminShell>;

  const { courseId } = await params;
  const [course, categories] = await Promise.all([
    prisma.course.findUnique({ where: { id: courseId } }),
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }]
    })
  ]);

  if (!course) {
    notFound();
  }

  return (
    <AdminFrame>
      <ButtonLink href={`/admin/catalog/courses?locale=${course.locale}`} variant="ghost" className="mb-4 h-10 px-0 text-slate-600 hover:bg-transparent">
        <ArrowLeft className="h-4 w-4" />
        Wróć do kursów
      </ButtonLink>
      <CourseForm course={course} categories={categories.filter((category) => category.locale === course.locale)} locale={course.locale as "pl" | "de" | "en"} />
    </AdminFrame>
  );
}

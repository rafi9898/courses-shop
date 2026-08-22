import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminFrame, AdminShell } from "@/components/admin/admin-shell";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { BundleForm } from "@/components/admin/catalog-forms";
import { ButtonLink } from "@/components/ui/button";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditBundlePage({
  params
}: {
  params: Promise<{ bundleId: string }>;
}) {
  if (!isAdminConfigured()) return <AdminShell><AdminLoginForm /></AdminShell>;
  if (!(await isAdminAuthenticated())) return <AdminShell><AdminLoginForm /></AdminShell>;

  const { bundleId } = await params;
  const [bundle, categories, courses] = await Promise.all([
    prisma.bundle.findUnique({
      where: { id: bundleId },
      include: {
        courses: {
          orderBy: { position: "asc" }
        }
      }
    }),
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }]
    }),
    prisma.course.findMany({
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        catalogKey: true,
        locale: true,
        isActive: true
      }
    })
  ]);

  if (!bundle) {
    notFound();
  }

  return (
    <AdminFrame>
      <ButtonLink href={`/admin/catalog/bundles?locale=${bundle.locale}`} variant="ghost" className="mb-4 h-10 px-0 text-slate-600 hover:bg-transparent">
        <ArrowLeft className="h-4 w-4" />
        Wróć do pakietów
      </ButtonLink>
      <BundleForm
        bundle={bundle}
        categories={categories.filter((category) => category.locale === bundle.locale)}
        courses={courses.filter((course) => course.locale === bundle.locale)}
        locale={bundle.locale as "pl" | "de" | "en"}
        selectedCourseIds={bundle.courses.map((item) => item.courseId)}
      />
    </AdminFrame>
  );
}

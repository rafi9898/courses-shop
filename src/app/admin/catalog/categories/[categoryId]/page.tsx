import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminFrame, AdminShell } from "@/components/admin/admin-shell";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { CategoryForm } from "@/components/admin/catalog-forms";
import { ButtonLink } from "@/components/ui/button";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params
}: {
  params: Promise<{ categoryId: string }>;
}) {
  if (!isAdminConfigured()) return <AdminShell><AdminLoginForm /></AdminShell>;
  if (!(await isAdminAuthenticated())) return <AdminShell><AdminLoginForm /></AdminShell>;

  const { categoryId } = await params;
  const category = await prisma.category.findUnique({ where: { id: categoryId } });

  if (!category) {
    notFound();
  }

  return (
    <AdminFrame>
      <ButtonLink href={`/admin/catalog/categories?locale=${category.locale}`} variant="ghost" className="mb-4 h-10 px-0 text-slate-600 hover:bg-transparent">
        <ArrowLeft className="h-4 w-4" />
        Wróć do kategorii
      </ButtonLink>
      <CategoryForm category={category} locale={category.locale as "pl" | "de" | "en"} />
    </AdminFrame>
  );
}

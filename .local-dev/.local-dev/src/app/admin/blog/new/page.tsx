import { ArrowLeft } from "lucide-react";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { parseAdminLocale } from "@/components/admin/catalog-locale-switcher";
import { AdminFrame, AdminShell } from "@/components/admin/admin-shell";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { ButtonLink } from "@/components/ui/button";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage({
  searchParams
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  if (!isAdminConfigured()) return <AdminShell><AdminLoginForm /></AdminShell>;
  if (!(await isAdminAuthenticated())) return <AdminShell><AdminLoginForm /></AdminShell>;

  const { locale: rawLocale } = await searchParams;
  const locale = parseAdminLocale(rawLocale);

  return (
    <AdminFrame>
      <ButtonLink href={`/admin/blog?locale=${locale}`} variant="ghost" className="mb-4 h-10 px-0 text-slate-600 hover:bg-transparent">
        <ArrowLeft className="h-4 w-4" />
        Wróć do bloga
      </ButtonLink>
      <BlogPostForm locale={locale} />
    </AdminFrame>
  );
}

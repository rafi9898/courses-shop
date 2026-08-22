import { AdminFrame, AdminShell } from "@/components/admin/admin-shell";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { UdemyImportForm } from "@/components/admin/udemy-import-form";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminUdemyPage() {
  if (!isAdminConfigured()) {
    return (
      <AdminShell>
        <AdminLoginForm />
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

  return (
    <AdminFrame>
      <section className="mt-8">
        <UdemyImportForm />
      </section>
    </AdminFrame>
  );
}

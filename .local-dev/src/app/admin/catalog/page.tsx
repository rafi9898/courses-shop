import { Boxes, GraduationCap, PackageOpen, Tags } from "lucide-react";
import { AdminFrame, AdminShell } from "@/components/admin/admin-shell";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { ButtonLink } from "@/components/ui/button";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCatalogPage() {
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

  const [categoryCount, courseCount, bundleCount, activeCourseCount, activeBundleCount] = await Promise.all([
    prisma.category.count().catch(() => 0),
    prisma.course.count().catch(() => 0),
    prisma.bundle.count().catch(() => 0),
    prisma.course.count({ where: { isActive: true } }).catch(() => 0),
    prisma.bundle.count({ where: { isActive: true } }).catch(() => 0)
  ]);

  return (
    <AdminFrame>
      <div className="border-b border-border pb-6">
        <p className="text-sm font-black uppercase text-primary">Katalog</p>
        <h1 className="mt-2 text-3xl font-black tracking-normal">Produkty w bazie</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Zarządzaj kategoriami, kursami i pakietami na osobnych podstronach. Ten etap przygotowuje katalog pod pełne przepięcie sklepu na bazę danych.</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <CatalogCard icon={<Tags className="h-5 w-5" />} title="Kategorie" value={String(categoryCount)} href="/admin/catalog/categories?locale=pl" action="Zarządzaj kategoriami" />
        <CatalogCard icon={<GraduationCap className="h-5 w-5" />} title="Kursy" value={`${activeCourseCount}/${courseCount}`} href="/admin/catalog/courses?locale=pl" action="Zarządzaj kursami" />
        <CatalogCard icon={<PackageOpen className="h-5 w-5" />} title="Pakiety" value={`${activeBundleCount}/${bundleCount}`} href="/admin/catalog/bundles?locale=pl" action="Zarządzaj pakietami" />
      </div>

      <section className="mt-6 rounded-xl border border-border bg-white p-5 shadow-card">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black">Co jest w CRUD katalogu?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Możesz dodawać, edytować i usuwać kategorie, kursy oraz pakiety osobno dla PL, DE i EN. Każda wersja językowa może istnieć niezależnie, więc angielski katalog nie musi mieć tych samych pozycji co polski.</p>
          </div>
        </div>
      </section>
    </AdminFrame>
  );
}

function CatalogCard({ icon, title, value, href, action }: { icon: React.ReactNode; title: string; value: string; href: string; action: string }) {
  return (
    <article className="rounded-xl border border-border bg-white p-5 shadow-card">
      <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary-soft text-primary">{icon}</div>
      <p className="mt-4 text-xs font-black uppercase text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
      <ButtonLink href={href} variant="secondary" className="mt-5 h-10 px-4">
        {action}
      </ButtonLink>
    </article>
  );
}

function ConfigNotice() {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-border bg-white p-6 shadow-card">
      <h1 className="text-2xl font-black">Panel admina nie jest skonfigurowany</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">Dodaj `ADMIN_USERNAME` i `ADMIN_PASSWORD` w pliku środowiskowym, a potem uruchom aplikację ponownie.</p>
    </div>
  );
}

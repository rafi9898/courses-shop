import { Boxes, FileText, GraduationCap, LayoutDashboard, PackageOpen, Percent, Tags } from "lucide-react";
import { AdminLogoutButton } from "@/components/admin/admin-actions";
import { ButtonLink } from "@/components/ui/button";

const adminNavItems = [
  { href: "/admin", label: "Zamówienia", icon: FileText },
  { href: "/admin/catalog", label: "Katalog", icon: LayoutDashboard },
  { href: "/admin/catalog/categories", label: "Kategorie", icon: Tags },
  { href: "/admin/catalog/courses", label: "Kursy", icon: GraduationCap },
  { href: "/admin/catalog/bundles", label: "Pakiety", icon: PackageOpen },
  { href: "/admin/discounts", label: "Rabaty", icon: Percent }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">{children}</main>;
}

export function AdminFrame({ children }: { children: React.ReactNode }) {
  const appVersion = process.env.APP_VERSION || "local";
  const runtimeLabel = process.env.NODE_ENV === "production" ? "prod" : "local";

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-white p-4 shadow-card lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-primary">Panel admina</p>
              <p className="text-sm font-semibold text-slate-600">Zamówienia, faktury, kody Udemy i katalog produktów</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-10 items-center gap-2 rounded-[10px] border border-border bg-slate-50 px-3 text-xs font-semibold text-slate-600">
              <span className="text-slate-500">Wersja</span>
              <code className="rounded bg-white px-2 py-1 font-mono text-[11px] font-black text-foreground">{appVersion}</code>
              <span className="rounded bg-primary-soft px-2 py-1 text-[11px] font-black uppercase text-primary">{runtimeLabel}</span>
            </div>
            {adminNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <ButtonLink key={item.href} href={item.href} variant="secondary" className="h-10 px-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </ButtonLink>
              );
            })}
            <AdminLogoutButton />
          </div>
        </div>
        {children}
      </div>
    </AdminShell>
  );
}

import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import { AdminFrame } from "@/components/admin/admin-shell";
import { PromoBannerForm } from "@/components/admin/promo-banner-form";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  const [plBanner, enBanner, deBanner] = await Promise.all([
    prisma.promoBanner.findUnique({ where: { locale: "pl" } }),
    prisma.promoBanner.findUnique({ where: { locale: "en" } }),
    prisma.promoBanner.findUnique({ where: { locale: "de" } })
  ]);

  return (
    <AdminFrame>
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-primary">Ustawienia</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal">Pasek promocyjny</h1>
          <p className="mt-2 text-sm text-slate-600">Zarządzaj paskiem ogłoszeń (promo banner) na samej górze strony dla poszczególnych języków.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6">
        <section>
          <h2 className="mb-3 text-lg font-bold">Wersja Polska (PL)</h2>
          <PromoBannerForm banner={plBanner} locale="pl" />
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">Wersja Angielska (EN)</h2>
          <PromoBannerForm banner={enBanner} locale="en" />
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">Wersja Niemiecka (DE)</h2>
          <PromoBannerForm banner={deBanner} locale="de" />
        </section>
      </div>
    </AdminFrame>
  );
}

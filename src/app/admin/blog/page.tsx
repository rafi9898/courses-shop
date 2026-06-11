import { Edit, Eye, FileText, Plus, Trash2 } from "lucide-react";
import { AdminPagination, getAdminPagination, parseAdminPage } from "@/components/admin/admin-pagination";
import { CatalogLocaleSwitcher, parseAdminLocale } from "@/components/admin/catalog-locale-switcher";
import { AdminFrame, AdminShell } from "@/components/admin/admin-shell";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { Button, ButtonLink } from "@/components/ui/button";
import { deleteBlogPostAction } from "@/lib/admin-blog-actions";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { countAdminBlogPosts, countPublishedAdminBlogPosts, getAdminBlogPosts, sumAdminBlogPostViews } from "@/lib/blog-data";
import { getBlogPostPath } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage({
  searchParams
}: {
  searchParams: Promise<{ locale?: string; page?: string }>;
}) {
  if (!isAdminConfigured()) return <AdminShell><AdminLoginForm /></AdminShell>;
  if (!(await isAdminAuthenticated())) return <AdminShell><AdminLoginForm /></AdminShell>;

  const { locale: rawLocale, page: rawPage } = await searchParams;
  const locale = parseAdminLocale(rawLocale);
  const page = parseAdminPage(rawPage);
  const { skip, take } = getAdminPagination(page);
  let databaseError: string | null = null;
  const [posts, totalPosts, publishedPosts, totalViews] = await Promise.all([
    getAdminBlogPosts(locale, skip, take),
    countAdminBlogPosts(locale),
    countPublishedAdminBlogPosts(locale),
    sumAdminBlogPostViews(locale)
  ]).catch(() => {
    databaseError = "Nie udało się pobrać wpisów. Sprawdź `DATABASE_URL` i uruchom migracje Prisma.";
    return [[], 0, 0, 0] as const;
  });

  return (
    <AdminFrame>
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-primary">Blog</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal">Wpisy blogowe</h1>
          <p className="mt-2 text-sm text-slate-600">Twórz wpisy dla wybranego języka, zarządzaj SEO, miniaturkami i publikacją.</p>
          <CatalogLocaleSwitcher activeLocale={locale} basePath="/admin/blog" />
        </div>
        <ButtonLink href={`/admin/blog/new?locale=${locale}`} className="h-11 px-4">
          <Plus className="h-4 w-4" />
          Dodaj wpis
        </ButtonLink>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <Stat label="Wpisy w języku" value={String(totalPosts)} />
        <Stat label="Opublikowane" value={String(publishedPosts)} />
        <Stat label="Robocze" value={String(totalPosts - publishedPosts)} />
        <Stat label="Wyświetlenia" value={formatNumber(totalViews)} />
      </div>

      {databaseError ? <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{databaseError}</p> : null}

      <section className="mt-6 overflow-hidden rounded-xl border border-border bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <Th>Wpis</Th>
                <Th>SEO</Th>
                <Th>Wyświetlenia</Th>
                <Th>Publikacja</Th>
                <Th>Miniaturka</Th>
                <Th>Akcje</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id} className="align-top">
                    <Td>
                      <p className="font-black text-slate-950">{post.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{post.locale.toUpperCase()} / {post.slug}</p>
                      <p className="mt-2 max-w-xl text-xs leading-5 text-slate-600">{post.excerpt}</p>
                    </Td>
                    <Td>
                      <p className="max-w-xs truncate font-semibold" title={post.metaTitle ?? undefined}>{post.metaTitle || "Tytuł wpisu"}</p>
                      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">{post.metaDescription || post.excerpt}</p>
                      <p className="mt-2 max-w-xs truncate text-xs text-slate-500" title={post.metaKeywords ?? undefined}>Keywords: {post.metaKeywords || "-"}</p>
                    </Td>
                    <Td>
                      <p className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-black text-slate-800">
                        <Eye className="h-4 w-4 text-primary" />
                        {formatNumber(post.viewCount)}
                      </p>
                    </Td>
                    <Td>
                      <StatusPill active={post.isPublished} />
                      <p className="mt-2 text-xs text-slate-500">{post.publishedAt ? formatDate(post.publishedAt) : "Bez daty publikacji"}</p>
                    </Td>
                    <Td>
                      <p className="max-w-56 truncate text-xs text-slate-500" title={post.thumbnailImageUrl ?? undefined}>{post.thumbnailImageUrl ?? "-"}</p>
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-2">
                        {post.isPublished ? (
                          <ButtonLink href={getBlogPostPath(locale, post.slug)} variant="secondary" className="h-9 px-3">
                            <FileText className="h-4 w-4" />
                            Podgląd
                          </ButtonLink>
                        ) : null}
                        <ButtonLink href={`/admin/blog/${post.id}?locale=${locale}`} variant="secondary" className="h-9 px-3">
                          <Edit className="h-4 w-4" />
                          Edytuj
                        </ButtonLink>
                        <form action={deleteBlogPostAction}>
                          <input type="hidden" name="postId" value={post.id} />
                          <input type="hidden" name="locale" value={locale} />
                          <input type="hidden" name="slug" value={post.slug} />
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
                  <td colSpan={6} className="p-8 text-center text-sm text-slate-500">
                    <FileText className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-3 font-semibold">Brak wpisów w tym języku.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination basePath="/admin/blog" page={page} totalItems={totalPosts} params={{ locale }} />
      </section>
    </AdminFrame>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-card">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-black">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-4">{children}</td>;
}

function StatusPill({ active }: { active: boolean }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{active ? "PUBLIC" : "DRAFT"}</span>;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pl-PL").format(value);
}

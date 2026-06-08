import { ChevronLeft, ChevronRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ADMIN_PAGE_SIZE = 10;

export function parseAdminPage(value: string | undefined) {
  const page = Number(value);
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.trunc(page);
}

export function getAdminPagination(page: number, pageSize = ADMIN_PAGE_SIZE) {
  return {
    skip: (page - 1) * pageSize,
    take: pageSize
  };
}

export function AdminPagination({
  basePath,
  page,
  totalItems,
  pageSize = ADMIN_PAGE_SIZE,
  pageParam = "page",
  params = {}
}: {
  basePath: string;
  page: number;
  totalItems: number;
  pageSize?: number;
  pageParam?: string;
  params?: Record<string, string | number | boolean | null | undefined>;
}) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <nav className="flex flex-col gap-3 border-t border-border bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between" aria-label="Paginacja">
      <p className="text-sm font-semibold text-slate-600">
        Strona {page} z {totalPages}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <PageLink href={buildHref(basePath, pageParam, Math.max(1, page - 1), params)} disabled={page === 1} ariaLabel="Poprzednia strona">
          <ChevronLeft className="h-4 w-4" />
        </PageLink>
        {visiblePages.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="grid h-9 w-9 place-items-center text-sm font-black text-slate-400">
              ...
            </span>
          ) : (
            <PageLink key={item} href={buildHref(basePath, pageParam, item, params)} active={item === page}>
              {item}
            </PageLink>
          )
        )}
        <PageLink href={buildHref(basePath, pageParam, Math.min(totalPages, page + 1), params)} disabled={page === totalPages} ariaLabel="Następna strona">
          <ChevronRight className="h-4 w-4" />
        </PageLink>
      </div>
    </nav>
  );
}

function PageLink({
  href,
  children,
  active = false,
  disabled = false,
  ariaLabel
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <ButtonLink
      href={disabled ? "#" : href}
      variant="secondary"
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={cn(
        "h-9 min-w-9 px-3",
        active && "border-primary bg-primary text-white hover:border-primary hover:bg-primary hover:text-white",
        disabled && "pointer-events-none opacity-40"
      )}
    >
      {children}
    </ButtonLink>
  );
}

function buildHref(
  basePath: string,
  pageParam: string,
  page: number,
  params: Record<string, string | number | boolean | null | undefined>
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || typeof value === "undefined" || value === "") continue;
    searchParams.set(key, String(value));
  }

  searchParams.set(pageParam, String(page));
  return `${basePath}?${searchParams.toString()}`;
}

function getVisiblePages(page: number, totalPages: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) pages.push("ellipsis");
  for (let current = start; current <= end; current += 1) pages.push(current);
  if (end < totalPages - 1) pages.push("ellipsis");
  pages.push(totalPages);

  return pages;
}

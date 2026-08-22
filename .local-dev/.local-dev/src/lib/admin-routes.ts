export const adminPublicBasePath = "/rp-panel-2026";
export const adminInternalBasePath = "/admin";

export function getAdminPath(path = "") {
  const suffix = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `${adminPublicBasePath}${suffix}`;
}

export function getPublicAdminHref(href: string) {
  if (href === adminInternalBasePath) return adminPublicBasePath;
  if (href.startsWith(`${adminInternalBasePath}?`) || href.startsWith(`${adminInternalBasePath}#`)) {
    return href.replace(adminInternalBasePath, adminPublicBasePath);
  }
  if (href.startsWith(`${adminInternalBasePath}/`)) {
    return href.replace(adminInternalBasePath, adminPublicBasePath);
  }

  return href;
}

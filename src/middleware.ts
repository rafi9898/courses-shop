import { NextResponse, type NextRequest } from "next/server";
import { adminInternalBasePath, adminPublicBasePath } from "@/lib/admin-routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    process.env.NODE_ENV === "production" &&
    (pathname === adminInternalBasePath || pathname.startsWith(`${adminInternalBasePath}/`))
  ) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (pathname === adminPublicBasePath || pathname.startsWith(`${adminPublicBasePath}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(adminPublicBasePath, adminInternalBasePath) || adminInternalBasePath;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/rp-panel-2026/:path*"]
};

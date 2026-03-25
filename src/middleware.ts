import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes that don't need auth
  if (pathname === "/admin/login") return NextResponse.next();

  // Check if this is a protected route
  const isProtected =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/customers") ||
    pathname.startsWith("/api/modules") ||
    pathname.startsWith("/api/seed") ||
    pathname.startsWith("/api/crawl") ||
    pathname.startsWith("/api/settings");

  if (isProtected) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      // API routes get a 401, admin pages get redirected
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/customers/:path*",
    "/api/modules/:path*",
    "/api/seed",
    "/api/crawl",
    "/api/settings",
    "/api/upload",
  ],
};

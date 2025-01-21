import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("fb_auth_token");
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/activity") ||
    pathname.startsWith("/library") ||
    pathname.startsWith("/challenges") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings")
  ) {
    if (!authToken) {
      const url = new URL("/auth/signin", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (
    pathname.startsWith("/auth/signin") ||
    pathname.startsWith("/auth/signup")
  ) {
    if (authToken) {
      return NextResponse.redirect(new URL("/activity", request.url));
    }
  }

  if (pathname === "/" && authToken) {
    return NextResponse.redirect(new URL("/activity", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/activity/:path*",
    "/library/:path*",
    "/challenges/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/auth/:path*",
  ],
};

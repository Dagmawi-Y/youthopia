import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('fb_auth_token');
  const { pathname } = request.nextUrl;

  // Protected routes
  if (
    pathname.startsWith('/activity') ||
    pathname.startsWith('/library') ||
    pathname.startsWith('/challenges') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/settings')
  ) {
    if (!authToken) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Auth routes - redirect to activity if already logged in
  if (
    pathname.startsWith('/auth/signin') ||
    pathname.startsWith('/auth/signup')
  ) {
    if (authToken) {
      return NextResponse.redirect(new URL('/activity', request.url));
    }
  }

  // Home page - redirect to activity if logged in
  if (pathname === '/' && authToken) {
    return NextResponse.redirect(new URL('/activity', request.url));
  }

  return NextResponse.next();
}

// Configure which paths middleware will run on
export const config = {
  matcher: [
    '/',
    '/activity/:path*',
    '/library/:path*',
    '/challenges/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/auth/:path*',
  ],
}; 
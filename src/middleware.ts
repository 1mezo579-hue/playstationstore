import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('admin_auth');
  const { pathname } = request.nextUrl;

  // 1. Redirect to Login if trying to access dashboard without auth
  if (pathname.startsWith('/dashboard') && !authCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Redirect to Dashboard if trying to access Login while already authenticated
  if (pathname === '/' && authCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from "next-auth/middleware";
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['ar', 'en'];
const defaultLocale = 'ar';

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locale = match(languages, locales, defaultLocale);
  
  return locale;
}

export default withAuth(
  function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const token = request.nextauth.token;

    // Skip middleware for API routes and static files
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    // Check authentication for protected routes
    const isAuth = !!token;
    const isAuthPage =
      pathname.startsWith("/login") ||
      pathname.startsWith("/register");

    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!isAuth && pathname.startsWith("/dashboard")) {
      const callbackUrl = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, request.url)
      );
    }

    // Handle localization
    let locale = request.cookies.get('NEXT_LOCALE')?.value || getLocale(request);

    // Validate the locale
    if (!locales.includes(locale)) {
      locale = defaultLocale;
    }

    // Update locale cookie if needed
    const response = NextResponse.next();
    if (!request.cookies.has('NEXT_LOCALE') || request.cookies.get('NEXT_LOCALE')?.value !== locale) {
      response.cookies.set('NEXT_LOCALE', locale, {
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    return response;
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

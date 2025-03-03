import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { hentMiljø, Miljø } from './app/util/miljø';
/**
 * This middleware is purely a hack to be able to provide the react server component auth
 * with the current path. This is needed to be able to redirect to the correct page after
 * login.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const requestUrl: URL = new URL(request.url);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-path', requestUrl.pathname + requestUrl.search);
  if (
    requestHeaders.get('authorization') == null &&
    hentMiljø() !== Miljø.Lokalt
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/oauth2/login`;
    redirectUrl.searchParams.set('redirect', requestUrl.pathname);

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!api/internal/isAlive|api/internal/isReady|api|_next/static|_next/image|favicon.ico|internal).*)',
  ],
  missing: [{ type: 'header', key: 'x-path' }],
};

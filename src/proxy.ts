import { NextRequest, NextResponse } from "next/server";

import createIntlMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segments = pathname.split("/").filter(Boolean);
  const localeFromPath: (typeof routing.locales)[number] = segments[0] as any;

  const isValidLocale = routing.locales.includes(localeFromPath);

  if (!isValidLocale) {
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match API routes
    "/api/v1/:path*",
    // Match i18n routes (exclude api, static files, etc.)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};

// src/lib/auth/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PAGES = ["/login", "/register"];
const PROTECTED_PAGES = ["/admin", "/wishlist", "/cart"];

const isAuthPage = (path: string) =>
  AUTH_PAGES.some((page) => path.startsWith(page));
const isProtectedPage = (path: string) =>
  PROTECTED_PAGES.some((page) => path.startsWith(page));

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const isUserOnAuthPage = isAuthPage(pathname);
  const isUserOnProtectedPage = isProtectedPage(pathname);

  if (isUserOnAuthPage) {
    // If the user is authenticated, redirect them from login/register to the home page.
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Otherwise, let them access the auth page.
    return NextResponse.next();
  }

  if (isUserOnProtectedPage) {
    // If the user is not authenticated, redirect them to the login page.
    if (!accessToken) {
      // Store the intended destination to redirect after login
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Allow the request to proceed for all other cases.
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth/ (we handle auth API logic inside the routes themselves)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth/|images/|icons/).*)",
  ],
};

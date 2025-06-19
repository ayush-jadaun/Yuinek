// src/lib/auth/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken, JWTPayload } from "@/lib/auth/jwt";

const AUTH_PAGES = ["/login", "/register"];
const ADMIN_PAGES = ["/admin"];
const PROTECTED_PAGES = ["/wishlist", "/cart", "/checkout"]; // Example protected pages for any logged in user

const isAuthPage = (path: string) =>
  AUTH_PAGES.some((page) => path.startsWith(page));
const isAdminPage = (path: string) =>
  ADMIN_PAGES.some((page) => path.startsWith(page));
const isProtectedPage = (path: string) =>
  PROTECTED_PAGES.some((page) => path.startsWith(page));

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const isUserOnAuthPage = isAuthPage(pathname);
  const isUserOnAdminPage = isAdminPage(pathname);
  const isUserOnProtectedPage = isProtectedPage(pathname);

  // 1. Handle Admin Routes
  if (isUserOnAdminPage) {
    if (!accessToken) {
      // Not logged in, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = verifyAccessToken(accessToken);
    if (!payload || payload.userType !== "admin") {
      // Logged in, but not an admin. Redirect to home page.
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Is an admin, allow access
    return NextResponse.next();
  }

  // 2. Handle standard protected routes (for any logged-in user)
  if (isUserOnProtectedPage) {
    if (!accessToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 3. Handle Auth Pages (Login/Register)
  if (isUserOnAuthPage) {
    if (accessToken) {
      // Already logged in, redirect away from auth pages
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Allow the request to proceed for all other cases.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth/|images/|icons/).*)",
  ],
};

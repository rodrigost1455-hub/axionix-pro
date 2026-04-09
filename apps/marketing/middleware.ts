import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@axionix/core";

const PUBLIC_PATHS = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register", "/api/auth/logout"];

const COOKIE_NAME = "axionix-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all public static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/images") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  const isPublicPath = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyJWT(token) : null;

  // Redirect logged-in users away from auth pages
  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (!isPublicPath && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to onboarding if no business profile
  if (session && pathname.startsWith("/dashboard") && !session.hasOnboarding) {
    if (pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  // Protect all routes under /dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if (
    token &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup"))
  ) {
    return NextResponse.redirect(new URL("/dashboard/seats", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};

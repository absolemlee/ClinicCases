import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isOnApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
  const isOnPasswordResetPage = req.nextUrl.pathname.startsWith("/password-reset");

  // Allow access to login page, password reset pages, and auth API routes
  if (isOnLoginPage || isOnApiAuthRoute || isOnPasswordResetPage) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    const callbackUrl = req.nextUrl.pathname + req.nextUrl.search;
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

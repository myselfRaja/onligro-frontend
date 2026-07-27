import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // ✅ Public paths
  const publicPaths = ["/login", "/register", "/staff-login", "/forgot-password"];
  if (publicPaths.some(p => path === p || path.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // ✅ Agar /owner/* path hai
  if (path.startsWith("/owner")) {
    // Token nahi hai → login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/owner/:path*", "/login", "/register", "/staff-login", "/forgot-password"],
};
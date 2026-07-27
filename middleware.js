import { NextResponse } from "next/server";

export async function middleware(request) {
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

    try {
      // ✅ Role check
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
        headers: { Cookie: `token=${token}` },
      });

      if (!res.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const data = await res.json();
      const user = data.user || data.owner;

      // ✅ STAFF — SIRF BILLING ALLOW
      if (user?.role === "staff") {
        if (path === "/owner/billing") {
          return NextResponse.next(); // ✅ Allow
        }
        // ❌ Baaki sab redirect
        return NextResponse.redirect(new URL("/owner/billing", request.url));
      }

      // ✅ OWNER — Sab allow
      return NextResponse.next();

    } catch (error) {
      console.error("Middleware error:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/owner/:path*",
};
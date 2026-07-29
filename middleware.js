import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // ✅ Staff restricted pages
  const restrictedPages = [
    "/owner/dashboard",
    "/owner/customers",
    "/owner/services",
    "/owner/inventory",
    "/owner/reports",
    "/owner/staff",
    "/owner/salon",
    "/owner/hours",
    // "/owner/appointments",
  ];

  // ✅ Check if path is restricted
  const isRestricted = restrictedPages.some(page => path.startsWith(page));

  if (isRestricted && token) {
    try {
      // ✅ Verify token and check role
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
        headers: {
          Cookie: `token=${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const user = data.user || data.owner;

        // ✅ If staff → redirect to billing
        if (user?.role === "staff") {
          return NextResponse.redirect(new URL("/owner/billing", request.url));
        }
      }
    } catch (error) {
      console.error("Middleware error:", error);
      // Allow if error (fallback)
    }
  }

  return NextResponse.next();
}

// ✅ Apply middleware only to /owner routes
export const config = {
  matcher: "/owner/:path*",
};
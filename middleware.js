import { NextResponse } from "next/server";

export default function middleware(req) {
  const token = req.cookies.get("token")?.value || null;

  if (req.nextUrl.pathname.startsWith("/owner")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/owner/:path*"],
};

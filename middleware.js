// import { NextResponse } from "next/server";

// export function middleware(req) {
//   const token = req.cookies.get("token")?.value || null;
//   const { pathname } = req.nextUrl;

//   // Allow public routes
//   const publicPaths = [
//     "/login",
//     "/register",
//     "/",
//   ];

//   // Allow static files
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname.startsWith("/public")
//   ) {
//     return NextResponse.next();
//   }

//   // Allow public paths
//   if (publicPaths.includes(pathname)) {
//     return NextResponse.next();
//   }

//   // Protect only owner dashboard routes
//   if (pathname.startsWith("/owner")) {
//     if (!token) {
//       const loginUrl = new URL("/login", req.url);
//       loginUrl.searchParams.set("redirect", pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/:path*"],
// };

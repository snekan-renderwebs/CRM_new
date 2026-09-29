import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getAuthUser,
  hasRole,
} from "../src/lib/auth";


const protectedRoutes = [
  "/dashboard",
  "/contacts",
  "/leads",
  "/tasks",
  "/settings",
  "/users",
];


export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;


  const isProtectedRoute =
    protectedRoutes.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(`${route}/`)
    );


  if (!isProtectedRoute) {
    return NextResponse.next();
  }


  const user = getAuthUser(request);

  // Not logged in
  if (!user) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }


  const isUsersRoute =
    pathname === "/users" ||
    pathname.startsWith("/users/");

  if (
    isUsersRoute &&
    !hasRole(user, ["ADMIN"])
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // Allow
  return NextResponse.next();
}


export const config = {
  matcher: [
    "/dashboard/:path*",
    "/contacts/:path*",
    "/leads/:path*",
    "/tasks/:path*",
    "/settings/:path*",
    "/users/:path*",
  ],
};
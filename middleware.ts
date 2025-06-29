// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    // Additional middleware logic can go here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without token
        if (req.nextUrl.pathname.startsWith("/auth")) {
          return true;
        }
        // Require token for all other pages
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
  }
);

// Protect these routes
export const config = {
  matcher: [
    "/survey/:path*",
    "/api/survey/:path*",
    "/dashboard/:path*",
    // Add other protected routes here
  ],
};

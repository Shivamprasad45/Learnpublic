// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
   console.log(token ,"middleware token value")
  // Not logged in
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply to protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const isProtected = request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/admin");

  if (!isProtected || isAdminRequest(request)) {
    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return response;
  }

  return new NextResponse("Әкімшіге кіру үшін логин қажет", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Nauat admin"',
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"]
};

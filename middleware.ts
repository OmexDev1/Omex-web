import { NextResponse, type NextRequest } from "next/server"

function redirectHome(req: NextRequest) {
  return NextResponse.redirect(new URL("/", req.url))
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect API routes
  if (pathname.startsWith("/api/")) {
    const required = process.env.INTERNAL_API_KEY
    if (!required) return redirectHome(req)

    const provided = req.headers.get("x-internal-key")
    if (provided !== required) return redirectHome(req)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}

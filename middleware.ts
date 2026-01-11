import { NextResponse, type NextRequest } from "next/server"

export function middleware(_req: NextRequest) {
  // Allow all requests through
  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}

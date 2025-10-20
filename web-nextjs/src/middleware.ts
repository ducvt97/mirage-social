import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenAction } from "./actions/auth";

export async function middleware(request: NextRequest) {
  try {
    const verified = await verifyTokenAction();
    if (!verified || !verified.data || !verified.success) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (error: any) {
    if (error.statusCode === 401) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
};

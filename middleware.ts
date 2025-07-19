import { NextRequest, NextResponse } from "next/server";
import { assignABGroup } from "./lib/abTest";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (!req.cookies.has("ab_group")) {
    const group = assignABGroup();
    res.cookies.set("ab_group", group, { maxAge: 60 * 60 * 24 * 30 });
    res.cookies.set("ab_group_assigned", Date.now().toString(), { maxAge: 60 * 60 * 24 * 30 });
  }
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
}; 
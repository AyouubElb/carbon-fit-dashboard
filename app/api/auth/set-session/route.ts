// app/api/auth/set-session/route.ts
import { NextResponse } from "next/server";

type Body = {
  access_token: string;
  refresh_token: string;
  expires_at?: number; // unix seconds
};

export async function POST(req: Request) {
  const body: Body = await req.json().catch(() => ({} as Body));
  const { access_token, refresh_token, expires_at } = body;

  if (!access_token || !refresh_token) {
    return NextResponse.json({ error: "Missing tokens" }, { status: 400 });
  }

  const isProd = process.env.NODE_ENV === "production";

  const accessMaxAge = expires_at
    ? Math.max(expires_at - Math.floor(Date.now() / 1000), 60)
    : 60 * 60;
  const refreshMaxAge = 60 * 60 * 24 * 7; // 7 days

  const resp = NextResponse.json({ ok: true });

  // set access token cookie
  resp.cookies.set({
    name: "sb-access-token",
    value: access_token,
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: accessMaxAge,
  });

  // set refresh token cookie
  resp.cookies.set({
    name: "sb-refresh-token",
    value: refresh_token,
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    maxAge: refreshMaxAge,
  });

  return resp;
}

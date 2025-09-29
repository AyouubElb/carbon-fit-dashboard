// app/api/auth/clear-session/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const isProd = process.env.NODE_ENV === "production";

  const res = NextResponse.json({ ok: true });

  const cookiesToClear = ["sb-access-token", "sb-refresh-token"];

  for (const name of cookiesToClear) {
    res.cookies.set({
      name,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 0,
    });
  }

  return res;
}

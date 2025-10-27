import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value ?? null;
    if (!refreshToken) {
      console.warn("[refresh route] POST: missing refresh token cookie");
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${baseURL}/users/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      console.error(
        "[refresh route] POST: upstream refresh failed",
        res.status
      );
      return NextResponse.json({ ok: false }, { status: res.status });
    }

    const data = await res.json();
    const authToken: string | undefined = data?.authToken;
    if (!authToken) {
      console.error(
        "[refresh route] POST: refresh response missing authToken field"
      );
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    // Atualiza cookie httpOnly do authToken
    cookieStore.set("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 7, // 7h
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[refresh route] POST: unhandled error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

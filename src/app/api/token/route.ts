import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value ?? null;
    if (!token) return NextResponse.json({ token: null }, { status: 204 });
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ token: null }, { status: 204 });
  }
}

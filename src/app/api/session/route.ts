import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return NextResponse.json({ role: null }, { status: 401 });
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    const role = session?.user?.role ?? null;
    if (!role) {
      return NextResponse.json({ role: null }, { status: 401 });
    }
    return NextResponse.json({ role });
  } catch {
    return NextResponse.json({ role: null }, { status: 401 });
  }
}

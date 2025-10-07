import { cookies } from "next/headers";

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get("refreshToken");
  return refreshTokenCookie ? refreshTokenCookie.value : null;
}

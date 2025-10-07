"use client";

import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {}

    router.push("/login");
  };

  return {
    logout: handleLogout,
  };
}

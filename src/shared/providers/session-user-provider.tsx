import React from "react";

import { verifySession } from "@/shared/lib/session";

import { UserContextProvider } from "../context/user-context";

type SessionUserProviderProps = {
  children: React.ReactNode;
};

export default async function SessionUserProvider({
  children,
}: SessionUserProviderProps) {
  const session = await verifySession();

  return (
    <UserContextProvider initialUser={session?.user ?? null}>
      {children}
    </UserContextProvider>
  );
}



"use client";

import React from "react";

import type { User } from "@/features/auth/types/loginTypes";

type UserContextValue = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = React.createContext<UserContextValue | undefined>(
  undefined
);

type UserContextProviderProps = {
  initialUser: User | null;
  children: React.ReactNode;
};

export function UserContextProvider({
  initialUser,
  children,
}: UserContextProviderProps) {
  const [user, setUser] = React.useState<User | null>(initialUser);

  const value = React.useMemo(() => ({ user, setUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useCurrentUser() {
  const context = React.useContext(UserContext);

  if (!context) {
    throw new Error("useCurrentUser deve ser usado dentro de UserContextProvider");
  }

  return context;
}



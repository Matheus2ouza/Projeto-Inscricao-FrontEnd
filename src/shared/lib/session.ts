import { cache } from "react";

function assertServer() {
  if (typeof window !== "undefined") {
    throw new Error("session.ts deve ser usado apenas no servidor");
  }
}

// Tipos para sessão e usuário
export interface User {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPER" | "MANAGER";
}

export interface Session {
  user: User;
  expires: string;
}

// Função para verificar a sessão
export const verifySession = cache(async (): Promise<Session | null> => {
  assertServer();
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return null;
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value);

    if (new Date(sessionData.expires) < new Date()) {
      return null;
    }

    return sessionData as Session;
  } catch (error) {
    console.error("Erro ao verificar sessão:", error);
    return null;
  }
});

export const getAuthToken = cache(async (): Promise<string | null> => {
  assertServer();
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const authTokenCookie = cookieStore.get("authToken");

  return authTokenCookie ? authTokenCookie.value : null;
});

// Função para obter dados do usuário
export const getUser = cache(async (): Promise<User | null> => {
  assertServer();
  const session = await verifySession();
  return session?.user || null;
});

// Função para verificar se o usuário tem role específico
export const hasRole = cache(
  async (role: "USER" | "ADMIN" | "SUPER" | "MANAGER"): Promise<boolean> => {
    const user = await getUser();
    return user?.role === role;
  }
);

// Função para verificar se o usuário é super
export const isSuper = cache(async (): Promise<boolean> => {
  return await hasRole("SUPER");
});

// Função para verificar se o usuário é manager
export const isManager = cache(async (): Promise<boolean> => {
  return await hasRole("MANAGER");
});

// Função para verificar se o usuário é admin
export const isAdmin = cache(async (): Promise<boolean> => {
  return await hasRole("ADMIN");
});

// Função para verificar se o usuário é user comum
export const isUser = cache(async (): Promise<boolean> => {
  return await hasRole("USER");
});

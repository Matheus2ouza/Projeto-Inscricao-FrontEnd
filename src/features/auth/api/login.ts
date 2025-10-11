"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { isProd } from "@/shared/lib/utils";
import axiosInstance from "@/shared/lib/apiClient";

export type LoginServiceInput = {
  username: string;
  password: string;
};

type RequestData = {
  username: string;
  password: string;
};

type LoginServiceOutput = {
  role: string;
  sessionFallback?: {
    user: {
      expires: string;
      role: string;
    };
    tokens: {
      authToken: string;
      refreshToken: string;
    };
  };
};

export async function loginService(
  input: LoginServiceInput
): Promise<LoginServiceOutput> {
  const dataToRequest: RequestData = {
    username: input.username,
    password: input.password,
  };
  try {
    const { data } = await axiosInstance.post("/users/", dataToRequest);
    const { authToken, refreshToken, role } = data;

    const secret = new TextEncoder().encode(process.env.JWT_AUTH_SECRET);
    const { payload } = await jwtVerify(authToken, secret);

    const sessionData = {
      user: {
        expires: payload.exp ? new Date(payload.exp * 1000).toISOString() : "",
        role,
      },
      tokens: { authToken, refreshToken },
    };

    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: isProd,
      path: "/",
      maxAge: 60 * 60 * 7, // 7 horas
    });
    cookieStore.set("authToken", authToken, {
      httpOnly: true,
      secure: isProd,
      path: "/",
      maxAge: 60 * 60 * 7, // 7 horas
    });
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      path: "/",
      maxAge: 60 * 60 * 7, // 7 horas
    });

    return { role };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
        "Erro inesperado. Por favor, tente novamente mais tarde."
    );
  }
}

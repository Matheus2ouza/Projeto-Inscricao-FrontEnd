"use server";

import axiosInstance from "@/shared/lib/apiClient";
import { isProd } from "@/shared/lib/utils";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import {
  AuthResponse,
  AxiosError,
  LoginServiceInput,
  LoginServiceOutput,
  RequestData,
  SessionData,
} from "../types/loginTypes";

// Serviço de login
export async function loginService(
  input: LoginServiceInput
): Promise<LoginServiceOutput> {
  const dataToRequest: RequestData = {
    username: input.username,
    password: input.password,
  };

  try {
    const { data } = await axiosInstance.post<AuthResponse>(
      "/users/",
      dataToRequest
    );
    const { authToken, refreshToken, user } = data;

    const secret = new TextEncoder().encode(process.env.JWT_AUTH_SECRET);
    const { payload } = await jwtVerify(authToken, secret);

    const sessionData: SessionData = {
      user: {
        id: user.id,
        role: user.role,
      },
      expires: payload.exp ? new Date(payload.exp * 1000).toISOString() : "",
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

    return { role: user.role };
  } catch (error: unknown) {
    const axiosError = error as AxiosError;

    // Lança um erro com a mensagem específica da API
    const errorMessage =
      axiosError.response?.data?.message ||
      "Erro inesperado. Por favor, tente novamente mais tarde.";

    throw new Error(errorMessage);
  }
}

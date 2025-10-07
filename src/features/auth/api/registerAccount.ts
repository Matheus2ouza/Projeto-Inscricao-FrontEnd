"use server";

import axiosInstance from "@/shared/lib/apiClient";

export type RegisterServiceInput = {
  username: string;
  password: string;
  role: string;
  region?: string;
};

export type RegisterServiceOutput = {
  id: string;
};

type RequestData = {
  username: string;
  password: string;
  role: string;
  regionId?: string;
};

export async function registerAccount(
  input: RegisterServiceInput
): Promise<RegisterServiceOutput> {
  const registerData: RequestData = {
    username: input.username,
    password: input.password,
    role: input.role,
    regionId: input.region,
  };

  try {
    const response = await axiosInstance.post("/users/create", registerData);
    const { data } = response;

    return { id: data.id };
  } catch (error: any) {
    console.error(
      "Erro ao fazer login:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Erro inesperado. Por favor, tente novamente mais tarde."
    );
  }
}

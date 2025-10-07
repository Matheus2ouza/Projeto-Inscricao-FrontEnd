"use server";

import axiosInstance from "@/shared/lib/apiClient";

export type RegisterEventInput = {
  name: string;
  startDate?: string;
  endDate?: string;
  regionId: string;
  image?: string; // base64 string
};

export type RegisterEventOutput = {
  id: string;
};

export async function registerEvent(
  input: RegisterEventInput
): Promise<RegisterEventOutput> {
  try {
    const response = await axiosInstance.post("/events/create", input);
    const { data } = response;

    return { id: data.id };
  } catch (error: any) {
    console.error(
      "Erro ao registrar evento:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Erro inesperado. Por favor, tente novamente mais tarde."
    );
  }
}

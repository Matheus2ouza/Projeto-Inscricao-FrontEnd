"use server";

import axiosInstance from "@/shared/lib/apiClient";

export type RegisterEventInput = {
  name: string;
  startDate?: string;
  endDate?: string;
  regionId: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  openImmediately?: boolean;
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
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    console.error(
      "Erro ao registrar evento:",
      axiosError.response?.data || axiosError.message
    );
    throw new Error(
      axiosError.response?.data?.message ||
        "Erro inesperado. Por favor, tente novamente mais tarde."
    );
  }
}

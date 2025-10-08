"use server";

import axiosInstance from "@/shared/lib/apiClient";

export type RegisterEventInput = {
  name: string;
  startDate?: string;
  endDate?: string;
  regionId: string;
  image?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  openImmediately?: boolean;
};

export type RegisterEventOutput = {
  id: string;
};

type RegisterData = {
  name: string;
  startDate?: string;
  endDate?: string;
  regionId: string;
  image?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  isOpen?: boolean;
};

export async function registerEvent(
  input: RegisterEventInput
): Promise<RegisterEventOutput> {
  try {
    const registerData: RegisterData = {
      name: input.name,
      startDate: input.startDate,
      endDate: input.endDate,
      regionId: input.regionId,
      image: input.image,
      location: input.address,
      latitude: input.latitude,
      longitude: input.longitude,
      isOpen: input.openImmediately,
    };

    const response = await axiosInstance.post("/events/create", registerData);
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

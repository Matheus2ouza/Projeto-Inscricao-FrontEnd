"user service";

import axiosInstance from "@/shared/lib/apiClient";

export type RegisterInput = {
  name: string;
};

export type RegisterOutput = {
  id: string;
};

export async function registerRegion(
  input: RegisterInput
): Promise<RegisterOutput> {
  const regionData = {
    name: input.name,
  };

  try {
    const response = await axiosInstance.post("/regions/create", regionData);
    const { data } = response;

    return { id: data.id };
  } catch (error: any) {
    console.error(
      "Erro ao registrar região:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Erro inesperado. Por favor, tente novamente mais tarde."
    );
  }
}

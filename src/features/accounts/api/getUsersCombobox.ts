import axiosInstance from "@/shared/lib/apiClient";

export type AccountDto = {
  id: string;
  username: string;
  role: string;
};

export async function getAccont(): Promise<AccountDto[]> {
  const { data } = await axiosInstance.get<AccountDto[]>(
    "/users/all/usernames",
    {
      params: {
        role: "SUPER, ADMIN",
      }
    }
  );
  return data;
}

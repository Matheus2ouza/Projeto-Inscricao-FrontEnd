import axiosInstance from "@/shared/lib/apiClient";

export type AccountDto = {
  id: string;
  username: string;
};

export async function getAccont(): Promise<AccountDto[]> {
  const { data } = await axiosInstance.get<AccountDto[]>(
    "/users/all/usernames"
  );
  return data;
}

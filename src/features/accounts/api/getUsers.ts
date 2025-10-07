import axiosInstance from "@/shared/lib/apiClient";

export type UserDto = {
  id: string;
  username: string;
  role: "USER" | "ADMIN" | "SUPER" | "MANAGER";
  regionName: string | undefined;
  createdAt: string;
  updatedAt: string;
};

export type GetUsersResponse = {
  users: UserDto[];
  total: number;
  page: number;
  pageCount: number;
};

export async function getUsers(params: {
  page: number;
  pageSize: number;
}): Promise<GetUsersResponse> {
  const { page, pageSize } = params;
  const { data } = await axiosInstance.get<GetUsersResponse>("/users", {
    params: { page, pageSize },
  });
  return data;
}

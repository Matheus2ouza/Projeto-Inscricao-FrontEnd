import axiosInstance from "@/shared/lib/apiClient";
import { getAllRegionsResponse } from "../types/regionsTypes";

export type RegionDto = {
  id: string;
  name: string;
};

export async function getRegions(): Promise<RegionDto[]> {
  const { data } = await axiosInstance.get<RegionDto[]>("/regions/all/names");
  return data;
}

export async function getAllRegions(params: {
  page: number;
  pageSize: number;
}): Promise<getAllRegionsResponse> {
  const { data } = await axiosInstance.get<getAllRegionsResponse>("/regions", {
    params: { page: params.page, pageSize: params.pageSize },
  });
  return data;
}

import { Events } from "@/features/events/types/eventTypes";

export type UseRegionsParams = {
  initialPage?: number;
  pageSize?: number;
};

export type UseRegionsResult = {
  regions: RegionsDto[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
};

export type RegionsDto = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  numberOfEvents: number;
  numberOfAccounts: number;
  lastEvent: Events | null;
  nextEventAt: Events | null;
};

export type getAllRegionsResponse = {
  regions: RegionsDto[];
  total: number;
  page: number;
  pageCount: number;
};

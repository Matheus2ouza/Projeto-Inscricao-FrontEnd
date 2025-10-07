export type UseEventsParams = {
  initialPage?: number;
  pageSize?: number;
};

export type Events = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  quantityParticipants: number;
  amountCollected: number;
  imageUrl: string;
  regionId: string;
  createdAt: string;
  updatedAt: string;
};

export type getAllEventsResponse = {
  events: Events[];
  total: number;
  page: number;
  pageCount: number;
};

export type UseEventsResult = {
  events: Events[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
};

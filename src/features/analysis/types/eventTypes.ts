export type Event = {
  id: string;
  name: string;
  imageUrl?: string;
  countInscriptions: number;
  countInscritpionsAnalysis: number;
};

export type UseEventsParams = {
  initialPage?: number;
  pageSize?: number;
};

export type getAllEventsResponse = {
  events: Event[];
  total: number;
  page: number;
  pageCount: number;
};

export type UseEventsResult = {
  events: Event[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
};

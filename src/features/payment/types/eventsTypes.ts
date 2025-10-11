export type UseEventsResult = {
  events: EventDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export type EventDto = {
  id: string;
  name: string;
};

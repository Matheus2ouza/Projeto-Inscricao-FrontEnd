import { TypeInscriptions } from "@/features/typeInscription/types/typesInscriptionsTypes";

export type Responsible = {
  id: string;
  name: string;
};

export type Event = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  quantityParticipants: number;
  amountCollected: number;
  imageUrl?: string;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
  status: string;
  paymentEneble: boolean;
  regionId: string;
  regionName?: string;
  createdAt: string;
  updatedAt: string;
  countTypeInscriptions?: number;
  typesInscriptions: TypeInscriptions[];
  responsibles?: Responsible[];
  // Campos opcionais adicionais para a tela de gerenciamento
  description?: string;
  maxParticipants?: number;
  ticketPrice?: number;
  address?: string;
};

export type EventDto = {
  id: string;
  name: string;
};

export type UseEventsNameResult = {
  events: EventDto[];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
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

export type UpdateEventInput = {
  name?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  maxParticipants?: number;
  ticketPrice?: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  status?: string;
  responsibles?: string[]; // IDs dos responsáveis adicionados durante a edição
};

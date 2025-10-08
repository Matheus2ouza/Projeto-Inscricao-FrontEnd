import { TypeInscriptions } from "@/features/typeInscription/types/typesInscriptionsTypes";

export type Event = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  quantityParticipants: number;
  amountCollected: number;
  imageUrl: string;
  location: string;
  latitude: number;
  longitude: number;
  status: string; // Alterado de isOpen para status (OPEN, CLOSE, FINALIZED)
  regionId: string;
  createdAt: string;
  updatedAt: string;
  countTypeInscriptions?: number;
  typesInscriptions: TypeInscriptions[];
  // Campos opcionais adicionais para a tela de gerenciamento
  description?: string;
  maxParticipants?: number;
  ticketPrice?: number;
  address?: string;
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
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  maxParticipants?: number;
  ticketPrice?: number;
  image?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  status?: string; // Alterado de isOpen para status
};

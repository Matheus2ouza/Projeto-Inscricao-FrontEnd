export type ListInscriptionRequest = {
  page: number;
  pageSize: number;
};

export type Inscription = {
  id: string;
  responsible: string;
  phone: string;
  status: string;
};

export type ListInscriptionResponse = {
  id: string;
  name: string;
  quantityParticipants: number;
  inscriptions: Inscription[];
  total: number;
  page: number;
  pageCount: number;
};

export type UseAnalysisParams = {
  eventId: string;
  initialPage?: number;
  pageSize?: number;
};

export type UseAnalysisResult = {
  eventData: ListInscriptionResponse | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageCount: number;
  total: number;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};

// Tipos para detalhes da inscrição
export type Participant = {
  id: string;
  name: string;
  birthDate: Date;
  gender: string;
};

export type InscriptionDetailRequest = {
  page: number;
  pageSize: number;
};

export type InscriptionDetailResponse = {
  id: string;
  responsible: string;
  phone: string;
  status: string;
  participants: Participant[];
  total: number;
  page: number;
  pageCount: number;
};

export type UseInscriptionDetailParams = {
  inscriptionId: string;
  initialPage?: number;
  pageSize?: number;
};

export type UseInscriptionDetailResult = {
  inscriptionData: InscriptionDetailResponse | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageCount: number;
  total: number;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};

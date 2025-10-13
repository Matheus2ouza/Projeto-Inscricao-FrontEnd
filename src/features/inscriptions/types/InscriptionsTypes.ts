export type getAllInscriptionsResponse = {
  inscription: {
    id: string;
    responsible: string;
    totalValue: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }[];
  total: number;
  page: number;
  pageCount: number;
  totalInscription: number;
  totalParticipant: number;
  totalDebt: number;
};

export type UsePaymentsParams = {
  initialPage?: number;
  pageSize?: number;
  eventId?: string | null;
  limitTime?: string | null;
};

export type UsePaymentsResult = {
  inscriptions: getAllInscriptionsResponse["inscription"];
  total: number;
  page: number;
  pageCount: number;
  totalInscription: number;
  totalParticipant: number;
  totalDebt: number;
  loading: boolean;
  error: string | null;
  setPage: (p: number) => void;
  refetch: () => Promise<void>;
};

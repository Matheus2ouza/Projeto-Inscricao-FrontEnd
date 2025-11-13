export type PaymentAnalysisRequest = {
  page: number;
  pageSize: number;
};

export type PaymentData = {
  id: string;
  responsible: string;
  totalValue: number;
  countPayments: number;
};

export type AccountData = {
  id: string;
  username: string;
  inscriptions: PaymentData[];
};

export type PaymentAnalysisResponse = {
  account: AccountData[];
};

export type UseAnalysisParams = {
  eventId: string;
  initialPage?: number;
  pageSize?: number;
};

export type UseAnalysisResult = {
  analysisData: PaymentAnalysisResponse | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageCount: number;
  total: number;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};

export enum PaymentStatus {
  APPROVED = "APPROVED", // Aprovado
  UNDER_REVIEW = "UNDER_REVIEW", //Em Analise
  REFUSED = "REFUSED", // Recusado
}

export type UpdatePaymentStatusResponse = {
  id: string;
  status: string;
  rejectionReason?: string | null;
};

// Tipos para detalhes de pagamento de uma inscrição
export type PaymentDetail = {
  id: string;
  status: string;
  value: number;
  image?: string | null;
};

export type AnalysisPaymentRequest = {
  status?: string[];
  page: number;
  pageSize: number;
};

export type Inscription = {
  id: string;
  status: string;
  responsible: string;
  phone: string;
  email?: string;
  totalValue: number;
  payments: PaymentDetail[];
};

export type AnalysisPaymentResponse = {
  inscription: Inscription;
  total: number;
  page: number;
  pageCount: number;
};

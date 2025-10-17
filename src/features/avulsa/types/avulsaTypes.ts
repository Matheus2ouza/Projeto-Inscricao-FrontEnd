export type PaymentMethod = "DINHEIRO" | "PIX" | "CARTÃO";
export type InscriptionStatus =
  | "pending"
  | "paid"
  | "cancelled"
  | "under_review";
export type GenderType = "male" | "female" | "other";

export type AvulsaRegistration = {
  id: string;
  responsible: string;
  phone: string;
  totalValue: number;
  status: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
};

export type ListAvulsaRequest = {
  eventId: string;
  page?: string;
  pageSize?: string;
};

export type ListAvulsaResponse = {
  registrations: AvulsaRegistration[];
  total: number;
  page: number;
  pageCount: number;
};

export type CreateInscriptionAvulParticipant = {
  value: number;
  name: string;
  birthDate: Date;
  gender: GenderType;
};

export type CreateInscriptionAvulRequest = {
  eventId: string;
  responsible: string;
  phone: string;
  totalValue: number;
  status: InscriptionStatus;
  paymentMethod: PaymentMethod;
  participants: CreateInscriptionAvulParticipant[];
};

export const avulsaKeys = {
  all: ["avulsa"] as const,
  list: (eventId: string, page: number, pageSize: number) =>
    [...avulsaKeys.all, "list", eventId, { page, pageSize }] as const,
};

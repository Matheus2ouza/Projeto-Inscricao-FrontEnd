export type TypeInscriptions = {
  id: string;
  description: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTypeInscriptionInput = {
  description: string;
  value: number;
  eventId: string;
};

export type UpdateTypeInscriptionInput = {
  description?: string;
  value?: number;
};

export type Ticket = {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  available: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateTicketInput = {
  eventId: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
};

export type CreateTicketOutput = {
  id: string;
};

export const ticketsKeys = {
  all: ["tickets"] as const,
  byEvent: (eventId: string) => [...ticketsKeys.all, "event", eventId] as const,
  detail: (ticketId: string) =>
    [...ticketsKeys.all, "detail", ticketId] as const,
};

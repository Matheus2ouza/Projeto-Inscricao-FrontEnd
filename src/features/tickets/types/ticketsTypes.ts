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

export type TicketSale = {
  id: string;
  quantity: number;
  totalValue: number;
};

export type TicketDetails = {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  available: number;
  ticketSale: TicketSale[];
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

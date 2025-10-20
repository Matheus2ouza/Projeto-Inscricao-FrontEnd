import axiosInstance from "@/shared/lib/apiClient";
import { RelatorioGeralOutput } from "../types/reportTypes";

type RelatorioGeralResponse = RelatorioGeralOutput;

const parseDate = (value: Date | string): Date => {
  return value instanceof Date ? value : new Date(value);
};

const mapRelatorioResponse = (
  data: RelatorioGeralResponse
): RelatorioGeralOutput => {
  return {
    ...data,
    event: {
      ...data.event,
      startDate: parseDate(data.event.startDate),
      endDate: parseDate(data.event.endDate),
    },
    inscricoes: {
      ...data.inscricoes,
      inscricoes: data.inscricoes.inscricoes.map((inscricao) => ({
        ...inscricao,
        createdAt: parseDate(inscricao.createdAt),
      })),
    },
    inscricoesAvulsas: {
      ...data.inscricoesAvulsas,
      inscricoes: data.inscricoesAvulsas.inscricoes.map((inscricao) => ({
        ...inscricao,
        createdAt: parseDate(inscricao.createdAt),
      })),
    },
    tickets: {
      ...data.tickets,
      vendas: data.tickets.vendas.map((venda) => ({
        ...venda,
        createdAt: parseDate(venda.createdAt),
      })),
    },
    gastos: {
      ...data.gastos,
      gastos: data.gastos.gastos.map((gasto) => ({
        ...gasto,
        createdAt: parseDate(gasto.createdAt),
      })),
    },
  };
};

export async function getRelatorioGeral(
  eventId: string
): Promise<RelatorioGeralOutput> {
  try {
    const { data } =
      await axiosInstance.get<RelatorioGeralResponse>(
        `/relatorio/geral/${eventId}`
      );

    return mapRelatorioResponse(data);
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
        "Falha ao carregar relatório do evento"
    );
  }
}

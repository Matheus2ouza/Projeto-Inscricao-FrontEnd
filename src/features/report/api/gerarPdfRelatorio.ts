import axiosInstance from "@/shared/lib/apiClient";
import type {
  GenaratePdfReportInput,
  GenaratePdfReportOutput,
} from "../types/reportTypes";

type SerializedBuffer = {
  type: string;
  data: number[];
};

type GerarPdfRelatorioApiResponse = {
  data?: {
    pdfBuffer: SerializedBuffer;
    filename?: string;
  };
  pdfBuffer?: SerializedBuffer;
  filename?: string;
  message?: string;
};

const toUint8Array = (serialized?: SerializedBuffer) => {
  if (!serialized || !Array.isArray(serialized.data)) {
    return new Uint8Array();
  }

  return Uint8Array.from(serialized.data);
};

export async function gerarPdfRelatorio({
  eventId,
}: GenaratePdfReportInput): Promise<GenaratePdfReportOutput> {
  try {
    const response = await axiosInstance.get<GerarPdfRelatorioApiResponse>(
      `/report/pdf/${eventId}`
    );

    const payload = response.data?.data ?? response.data;
    const serializedBuffer = payload?.pdfBuffer;
    const filename = payload?.filename ?? `relatorio-${eventId}.pdf`;

    if (!serializedBuffer) {
      throw new Error("Resposta do servidor não contém o PDF gerado.");
    }

    const pdfBuffer = toUint8Array(
      serializedBuffer
    ) as unknown as GenaratePdfReportOutput["pdfBuffer"];

    return {
      pdfBuffer,
      filename,
    };
  } catch (error) {
    const axiosError = error as {
      response?: {
        data?: { message?: string };
      };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        "Falha ao gerar PDF do relatório do evento"
    );
  }
}

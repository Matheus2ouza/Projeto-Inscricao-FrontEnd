export type GenaratePdfReportInput = {
  eventId: string;
};

export type GenaratePdfReportOutput = {
  pdfBase64: string;
  filename: string;
};

export type ReportGeneralInput = {
  eventId: string;
};

export type ReportGeneralResponse = {
  event: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    location: string | null;
    amountCollected: number;
    imageUrl: string | null;
  };
  totais: {
    totalGeral: number;
    totalArrecadado: number;
    totalDinheiro: number;
    totalPix: number;
    totalCartao: number;
    totalGastos: number;
  };
  inscricoes: {
    total: number;
    totalDinheiro: number;
    totalPix: number;
    totalCartao: number;
    totalParticipantes: number;
    inscricoes: Array<{
      id: string;
      responsible: string;
      countParticipants: number;
      totalValue: number;
      status: string;
      createdAt: string | Date;
    }>;
  };
  inscricoesAvulsas: {
    total: number;
    totalDinheiro: number;
    totalPix: number;
    totalCartao: number;
    totalParticipantes: number;
    inscricoes: Array<{
      id: string;
      responsible: string;
      countParticipants: number;
      totalValue: number;
      status: string;
      createdAt: Date;
    }>;
  };
  tickets: {
    total: number;
    totalDinheiro: number;
    totalPix: number;
    totalCartao: number;
    vendas: Array<{
      id: string;
      name: string;
      quantitySold: number;
      totalValue: number;
      createdAt: Date;
    }>;
  };
  gastos: {
    total: number;
    totalDinheiro: number;
    totalPix: number;
    totalCartao: number;
    gastos: Array<{
      id: string;
      description: string;
      value: number;
      paymentMethod: string;
      responsible: string;
      createdAt: string | Date;
    }>;
  };
};

export type ReportGeneralOutput = {
  event: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    location: string | null;
    amountCollected: number;
    imageUrl: string | null;
  };
  totais: {
    totalGeral: number;
    totalArrecadado: number;
    totalDinheiro: number;
    totalPix: number;
    totalCartao: number;
    totalGastos: number;
  };
  inscricoes: {
    total: number;
    totalDinheiro: number;
    totalPix: number;
    totalCartao: number;
    totalParticipantes: number;
    inscricoes: Array<{
      id: string;
      responsible: string;
      countParticipants: number;
      totalValue: number;
      status: string;
      createdAt: Date;
    }>;
  };
  inscricoesAvulsas: {
    total: number;
    totalDinheiro: number;
    totalPix: number;
    totalCartao: number;
    totalParticipantes: number;
    inscricoes: Array<{
      id: string;
      responsible: string;
      countParticipants: number;
      totalValue: number;
      status: string;
      createdAt: Date;
    }>;
  };
  tickets: {
    total: number;
    totalDinheiro: number;
    totalPix: number;
    totalCartao: number;
    vendas: Array<{
      id: string;
      name: string;
      quantitySold: number;
      totalValue: number;
      createdAt: Date;
    }>;
  };
  gastos: {
    total: number;
    totalDinheiro: number;
    totalPix: number;
    totalCartao: number;
    gastos: Array<{
      id: string;
      description: string;
      value: number;
      paymentMethod: string;
      responsible: string;
      createdAt: Date;
    }>;
  };
};

export type UseReportGeneralResult = {
  data: ReportGeneralOutput | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isFetching: boolean;
};

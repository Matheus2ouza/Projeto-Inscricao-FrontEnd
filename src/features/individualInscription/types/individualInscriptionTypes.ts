// Props para o hook
export interface UseFormIndividualInscriptionProps {
  eventId: string;
}

// Retorno do hook
export interface UseFormIndividualInscriptionReturn {
  // Estado
  formData: any;
  typeInscriptions: TypeInscription[];
  isSubmitting: boolean;
  formErrors: any;

  // Ações
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: any;
}

export interface IndividualInscriptionSubmit {
  responsible: string;
  phone: string;
  eventId: string;
  participant: {
    name: string;
    birthDateStr: string;
    gender: string;
    typeDescriptionId: string;
  };
}

// Resposta da API na primeira parte
export interface IndivUploadRouteResponse {
  cacheKey: string;
  participant: {
    name: string;
    birthDate: string;
    gender: string;
    typeDescription: string;
    value: number;
  };
}

// Dados de confirmação (similar ao grupo)
export interface IndividualInscriptionConfirmationData {
  cacheKey: string;
  participant: {
    name: string;
    birthDate: string;
    gender: string;
    typeDescription: string;
    value: number;
  };
}

export interface TypeInscription {
  id: string;
  description: string;
  value: number;
}

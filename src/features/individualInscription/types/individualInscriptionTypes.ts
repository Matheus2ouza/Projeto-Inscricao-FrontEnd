// Props para o hook
export interface UseFormIndividualInscriptionProps {
  eventId: string;
}

// Retorno do hook
export interface UseFormIndividualInscriptionReturn {
  // Estado
  formData: IndividualInscriptionFormInputs;
  typeInscriptions: TypeInscription[];
  isSubmitting: boolean;
  formErrors: FormErrors;

  // Ações
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<IndividualInscriptionFormInputs>;
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

// Dados de confirmação
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

// Tipos para o formulário
export interface IndividualInscriptionFormInputs {
  responsible: string;
  phone: string;
  participantName: string;
  birthDate: string;
  gender: string;
  typeInscriptionId: string;
}

// Tipos para erros do formulário
export interface FormErrors {
  responsible?: { message?: string };
  phone?: { message?: string };
  participantName?: { message?: string };
  birthDate?: { message?: string };
  gender?: { message?: string };
  typeInscriptionId?: { message?: string };
}

// Tipos para o react-hook-form
import { FieldErrors, UseFormRegister } from "react-hook-form";

// Você também pode exportar o tipo completo de errors se preferir
export type IndividualInscriptionFormErrors =
  FieldErrors<IndividualInscriptionFormInputs>;

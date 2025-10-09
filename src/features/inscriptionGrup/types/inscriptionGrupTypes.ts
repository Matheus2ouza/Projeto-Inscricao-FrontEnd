import { RefObject } from "react";
import { FieldErrors } from "react-hook-form";

export interface GroupInscriptionFormData {
  responsible: string;
  phone: string;
}

export interface ValidationError {
  line: number;
  reason: string;
}

export interface InscriptionItem {
  name: string;
  birthDate: string;
  gender: string;
  typeDescription: string;
  value: number;
}

export interface GroupInscriptionConfirmationData {
  cacheKey: string;
  total: number;
  unitValue: number;
  items: InscriptionItem[];
}

export interface UseFormInscriptionGrupProps {
  eventId: string;
}

export interface UseFormInscriptionGrupReturn {
  // Estado
  formData: GroupInscriptionFormData;
  file: File | null;
  isSubmitting: boolean;
  isDragging: boolean;
  validationErrors: ValidationError[];
  showErrorModal: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  formErrors: FieldErrors<{
    responsible: string;
    phone: string;
  }>;

  // Ações
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  downloadTemplate: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
  handleAreaClick: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleCloseErrorModal: () => void;
  register: any;
}

export interface UseGroupInscriptionConfirmationReturn {
  confirmationData: GroupInscriptionConfirmationData | null;
  confirmationResult: {
    inscriptionId: string;
    paymentEnabled: boolean;
  } | null;
  isConfirming: boolean;
  isLoading: boolean;
  timeRemaining: number;
  handleConfirm: () => void;
  handleCancel: () => void;
  handlePayment: () => void;
  handleSkipPayment: () => void;
}

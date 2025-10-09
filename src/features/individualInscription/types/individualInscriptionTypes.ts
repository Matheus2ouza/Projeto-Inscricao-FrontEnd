export interface IndividualInscriptionData {
  eventId: string;
  typeInscriptionId: string;
  responsibleData: {
    fullName: string;
    phone: string;
  };
  personalData: {
    fullName: string;
    birthDate: string;
    gender: string;
  };
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

export interface TypeInscription {
  id: string;
  description: string;
  value: number;
}

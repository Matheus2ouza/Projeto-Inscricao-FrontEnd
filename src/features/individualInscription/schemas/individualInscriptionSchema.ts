// schemas/individualInscriptionSchema.ts
import { z } from "zod";

export const individualInscriptionSchema = z.object({
  responsible: z.string().min(1, "Nome do responsável é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  participantName: z.string().min(1, "Nome do participante é obrigatório"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  gender: z.string().min(1, "Gênero é obrigatório"),
  typeInscriptionId: z.string().min(1, "Tipo de inscrição é obrigatório"),
});

export type IndividualInscriptionFormInputs = z.infer<
  typeof individualInscriptionSchema
>;

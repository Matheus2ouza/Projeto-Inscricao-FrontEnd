import { z } from "zod";

// Schema para validar nome completo (nome e sobrenome)
const fullNameSchema = z
  .string()
  .min(1, "Nome e sobrenome obrigatorios")
  .min(3, "Nome e sobrenome obrigatorios")
  .regex(/^[a-zA-ZÀ-ÿ\s']+$/, "Nome deve conter apenas letras e espaços")
  .refine(
    (name) => {
      const trimmedName = name.trim();
      const parts = trimmedName.split(/\s+/);
      return parts.length >= 2;
    },
    {
      message: "Digite pelo menos um sobrenome",
    }
  )
  .refine(
    (name) => {
      const trimmedName = name.trim();
      const parts = trimmedName.split(/\s+/);
      return parts.every((part) => part.length >= 2);
    },
    {
      message: "Cada parte do nome deve ter pelo menos 2 caracteres",
    }
  )
  .transform((name) =>
    name
      .trim()
      .replace(/\s+/g, " ")
      .replace(/(^\w|\s\w)/g, (l) => l.toUpperCase())
  );

export const individualInscriptionSchema = z.object({
  responsible: fullNameSchema,
  phone: z
    .string()
    .min(1, { message: "Telefone é obrigatório" })
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
      message: "Telefone deve estar no formato (11) 99999-9999",
    }),
  participantName: fullNameSchema,
  birthDate: z
    .string()
    .min(1, { message: "Data de nascimento é obrigatória" })
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
      message: "Data deve estar no formato DD/MM/AAAA",
    }),
  gender: z.string().min(1, { message: "Gênero é obrigatório" }),
  typeInscriptionId: z
    .string()
    .min(1, { message: "Tipo de inscrição é obrigatório" }),
});

export type IndividualInscriptionFormInputs = z.infer<
  typeof individualInscriptionSchema
>;

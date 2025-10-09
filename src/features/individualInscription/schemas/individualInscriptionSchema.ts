import { z } from "zod";

// Schema para validar nome completo (nome e sobrenome)
const fullNameSchema = z
  .string()
  .min(1, "Nome é obrigatório")
  .min(3, "Nome deve ter pelo menos 3 caracteres")
  .regex(/^[a-zA-ZÀ-ÿ]+([ ]+[a-zA-ZÀ-ÿ]+)+$/, "Digite nome e sobrenome")
  .refine(
    (name) => {
      const parts = name.trim().split(/\s+/);
      return parts.length >= 2;
    },
    {
      message: "Digite pelo menos um sobrenome",
    }
  )
  .refine(
    (name) => {
      const parts = name.trim().split(/\s+/);
      return parts.every((part) => part.length >= 2);
    },
    {
      message: "Cada parte do nome deve ter pelo menos 2 caracteres",
    }
  );

export const individualInscriptionSchema = z.object({
  eventId: z.string().min(1, "Evento é obrigatório"),
  typeInscriptionId: z.string().min(1, "Tipo de inscrição é obrigatório"),
  responsibleData: z.object({
    fullName: fullNameSchema,
    phone: z
      .string()
      .min(1, "Telefone é obrigatório")
      .regex(
        /^\(\d{2}\) \d{4,5}-\d{4}$/,
        "Telefone deve estar no formato (XX) XXXXX-XXXX"
      ),
  }),
  personalData: z.object({
    fullName: fullNameSchema,
    birthDate: z
      .string()
      .min(1, "Data de nascimento é obrigatória")
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data deve estar no formato DD/MM/AAAA")
      .refine((date) => {
        const [day, month, year] = date.split("/").map(Number);
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          return age - 1 >= 0;
        }
        return age >= 0;
      }, "Data de nascimento inválida"),
    gender: z
      .string()
      .min(1, "Gênero é obrigatório")
      .refine(
        (val) => ["masculino", "feminino"].includes(val),
        "Gênero inválido"
      ),
  }),
});

export type IndividualInscriptionFormData = z.infer<
  typeof individualInscriptionSchema
>;

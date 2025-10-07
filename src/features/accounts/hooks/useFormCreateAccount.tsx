"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { registerAccount } from "@/features/auth/api/registerAccount";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useGlobalLoading } from "@/components/GlobalLoading";

export const ROLES = [
  {
    label: "SUPER",
    value: "SUPER",
    color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
  },
  { label: "ADMIN", value: "ADMIN", color: "bg-blue-500 text-white" },
  { label: "MANAGER", value: "MANAGER", color: "bg-green-500 text-white" },
  { label: "USER", value: "USER", color: "bg-gray-400 text-white" },
];

const AccountSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Usuário deve ter pelo menos 2 caracteres" }),
  password: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  role: z.string().min(1, { message: "Função é obrigatória" }),
  region: z.string().optional(),
});

type AcccountFormType = z.infer<typeof AccountSchema>;

export type useFormCreateAccount = {
  form: ReturnType<typeof useForm<AcccountFormType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<boolean>;
};

export default function useFormCreateAccount(): useFormCreateAccount {
  const { setLoading } = useGlobalLoading();
  const form = useForm<AcccountFormType>({
    defaultValues: {
      username: "",
      password: "",
      role: ROLES[3].value, // USER como padrão
      region: "",
    },
  });

  async function onCreateForm(input: AcccountFormType) {
    setLoading(true);
    try {
      await registerAccount({
        username: input.username,
        password: input.password,
        role: input.role as string,
        region: input.region,
      });
      // reset form to default values after successful creation
      form.reset();
      toast.success("Usuario criado com sucesso", {
        description: "Usuario criado com sucesso e já pode ser utilizado",
        icon: <ThumbsUp />,
      });
      return true;
    } catch (error) {
      const err = error as Error;
      toast.error("Erro ao criar usuario", {
        description: err.message,
        icon: <ThumbsDown />,
      });
      return false;
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (event?: React.BaseSyntheticEvent) => {
    let result = false;
    await form.handleSubmit(async (data) => {
      result = await onCreateForm(data);
    })(event);
    return result;
  };

  const output = {
    form,
    onSubmit,
  };

  return output;
}

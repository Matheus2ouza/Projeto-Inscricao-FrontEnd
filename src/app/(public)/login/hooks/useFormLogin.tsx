"use client";

import { loginService } from "@/features/auth/api/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Frown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const loginSchema = z.object({
  username: z
    .string()
    .nonempty({ message: "Localidade é obrigatória" })
    .min(2, { error: "Localidade deve ter pelo menos 2 caracteres" }),
  password: z
    .string()
    .nonempty({ message: "Senha é obrigatória" })
    .min(6, { error: "Senha deve ter pelo menos 6 caracteres" }),
});

type LoginFormType = z.infer<typeof loginSchema>;

export type UseFormLoginType = {
  form: ReturnType<typeof useForm<LoginFormType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
};

export default function useFormLogin(): UseFormLoginType {
  const router = useRouter();
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onLoginForm(input: LoginFormType) {
    try {
      const response = await loginService({
        username: input.username,
        password: input.password,
      });

      // fallback: caso cookies não sejam aceitos
      if ("sessionFallback" in response) {
        sessionStorage.setItem(
          "session",
          JSON.stringify(response.sessionFallback)
        );
      }

      // Após login bem-sucedido, só redireciona (tokens já estão nos cookies)
      const redirectUrl = `/${response.role.toLocaleLowerCase()}/home`;
      router.push(redirectUrl);

      toast.success("Login feito com sucesso", {
        description: "Login feito com sucesso",
        icon: <ThumbsUp />,
      });
    } catch (error) {
      toast.error("Dados Inválidos", {
        description: "Verifique os dados e tente novamente",
      });
      return;
    }
  }

  const onSubmit = async (event?: React.BaseSyntheticEvent) =>
    form.handleSubmit(onLoginForm)(event);

  const output = {
    form,
    onSubmit,
  };

  return output;
}

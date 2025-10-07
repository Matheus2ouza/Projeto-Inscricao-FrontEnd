"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod";
import { registerRegion } from "../api/registerRegion";

const RegionsSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome da Região deve ter pelo menos 2 Caracteres" }),
});

type RegionFormType = z.infer<typeof RegionsSchema>;

export type useFormCreateRegion = {
  form: ReturnType<typeof useForm<RegionFormType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<boolean>;
};

export default function useFormCreateRegion(): useFormCreateRegion {
  const { setLoading } = useGlobalLoading();

  const form = useForm<RegionFormType>({
    resolver: zodResolver(RegionsSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onCreateForm(input: RegionFormType) {
    setLoading(true);
    try {
      await registerRegion({
        name: input.name,
      });

      form.reset();
      toast.success("Região criada com sucesso!", {
        description: "Região criada com sucesso e pronta para uso.",
        icon: <ThumbsUp />,
      });
      return true;
    } catch (error) {
      const err = error as Error;
      toast.error("Erro ao criar região", {
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

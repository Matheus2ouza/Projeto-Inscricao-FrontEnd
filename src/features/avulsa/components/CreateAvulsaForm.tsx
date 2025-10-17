"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createAvulsaRegistration } from "../api/createAvulsaRegistration";

const participantSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  birthDate: z.string().min(1, "Informe a data de nascimento"),
  gender: z.enum(["male", "female", "other"]),
  value: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Valor inválido"),
});

const formSchema = z.object({
  responsible: z.string().min(2, "Responsável obrigatório"),
  phone: z.string().min(8, "Telefone inválido"),
  totalValue: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Total inválido"),
  status: z.enum(["pending", "paid", "cancelled", "under_review"]),
  paymentMethod: z.enum(["DINHEIRO", "PIX", "CARTÃO"]),
  participants: z
    .array(participantSchema)
    .min(1, "Adicione ao menos um participante"),
});

type FormType = z.infer<typeof formSchema>;

export default function CreateAvulsaForm() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsible: "",
      phone: "",
      totalValue: "0",
      status: "pending",
      paymentMethod: "DINHEIRO",
      participants: [{ name: "", birthDate: "", gender: "other", value: "0" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const onSubmit = async (data: FormType) => {
    try {
      const payload = {
        eventId,
        responsible: data.responsible,
        phone: data.phone,
        totalValue: Number(data.totalValue),
        status: data.status,
        paymentMethod: data.paymentMethod,
        participants: data.participants.map((p) => ({
          name: p.name,
          birthDate: new Date(p.birthDate),
          gender: p.gender,
          value: Number(p.value),
        })),
      };
      const result = await createAvulsaRegistration(payload);
      toast.success("Inscrição avulsa criada", {
        description: `ID: ${result.id}`,
      });
      router.back();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar inscrição";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Nova Inscrição Avulsa
        </h1>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="responsible"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsável</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do responsável" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total (R$)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <select
                            className="border rounded p-2 w-full"
                            {...field}
                          >
                            <option value="pending">Pendente</option>
                            <option value="paid">Pago</option>
                            <option value="cancelled">Cancelado</option>
                            <option value="under_review">Em análise</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Forma de Pagamento</FormLabel>
                        <FormControl>
                          <select
                            className="border rounded p-2 w-full"
                            {...field}
                          >
                            <option value="DINHEIRO">Dinheiro</option>
                            <option value="PIX">PIX</option>
                            <option value="CARTÃO">Cartão</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Participantes</h2>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        append({
                          name: "",
                          birthDate: "",
                          gender: "other",
                          value: "0",
                        })
                      }
                    >
                      Adicionar
                    </Button>
                  </div>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                    >
                      <FormField
                        control={form.control}
                        name={`participants.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`participants.${index}.birthDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nascimento</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`participants.${index}.gender`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gênero</FormLabel>
                            <FormControl>
                              <select
                                className="border rounded p-2 w-full"
                                {...field}
                              >
                                <option value="male">Masculino</option>
                                <option value="female">Feminino</option>
                                <option value="other">Outro</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`participants.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor (R$)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0,00"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="md:col-span-4 flex justify-end">
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Criar</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

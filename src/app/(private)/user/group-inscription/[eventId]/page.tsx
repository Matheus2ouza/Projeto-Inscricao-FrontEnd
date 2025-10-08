// src/app/(private)/user/group-inscription/[eventId]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { ArrowLeft, Download, Upload, User, Phone } from "lucide-react";

export default function GroupInscriptionPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [formData, setFormData] = useState({
    responsible: "",
    phone: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Verificar se é um arquivo Excel
      if (
        selectedFile.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        !selectedFile.name.endsWith(".xlsx")
      ) {
        alert("Por favor, selecione um arquivo Excel (.xlsx)");
        return;
      }

      setFile(selectedFile);
    }
  };

  const downloadTemplate = () => {
    // Criar template básico
    const templateData = [
      ["Nome", "Email", "Telefone", "CPF", "Data de Nascimento"],
      [
        "João Silva",
        "joao@email.com",
        "(11) 99999-9999",
        "123.456.789-00",
        "1990-01-01",
      ],
      [
        "Maria Santos",
        "maria@email.com",
        "(11) 88888-8888",
        "987.654.321-00",
        "1992-05-15",
      ],
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    templateData.forEach((row) => {
      csvContent += row.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "template_inscricoes_grupo.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.responsible || !formData.phone || !file) {
      alert("Por favor, preencha todos os campos e selecione um arquivo");
      return;
    }

    setIsSubmitting(true);

    try {
      // Criar FormData para envio
      const submitData = new FormData();
      submitData.append("responsible", formData.responsible);
      submitData.append("phone", formData.phone);
      submitData.append("eventId", eventId);
      submitData.append("file", file);

      // Aqui você faria a chamada para a API
      const response = await fetch("/api/group-inscription", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        alert("Inscrições em grupo realizadas com sucesso!");
        router.push("/user/events");
      } else {
        throw new Error("Erro ao processar inscrições");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao processar inscrições. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Inscrição em Grupo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Inscreva várias pessoas de uma só vez
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Responsável</CardTitle>
              <CardDescription>
                Preencha os dados do responsável pelas inscrições
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Responsável */}
                <div className="space-y-2">
                  <Label htmlFor="responsible">
                    <User className="w-4 h-4 inline mr-2" />
                    Nome do Responsável *
                  </Label>
                  <Input
                    id="responsible"
                    name="responsible"
                    value={formData.responsible}
                    onChange={handleInputChange}
                    placeholder="Digite o nome completo do responsável"
                    required
                  />
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Telefone do Responsável *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                {/* Upload de Arquivo */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file">Arquivo com os Inscritos *</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="file"
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={downloadTemplate}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Template
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Faça o download do template, preencha com os dados dos
                      inscritos e faça o upload do arquivo.
                    </p>
                  </div>

                  {file && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Upload className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800 dark:text-green-400">
                        Arquivo selecionado: {file.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Botão de Submit */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Processando..."
                    : "Realizar Inscrições em Grupo"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Informações */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instruções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">1. Baixe o Template</h4>
                <p className="text-sm text-gray-600">
                  Faça o download do template Excel e preencha com os dados dos
                  participantes.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">2. Preencha os Dados</h4>
                <p className="text-sm text-gray-600">
                  Inclua nome, email, telefone, CPF e data de nascimento de cada
                  participante.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">3. Faça o Upload</h4>
                <p className="text-sm text-gray-600">
                  Selecione o arquivo preenchido e envie para processamento.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Formato do Arquivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Coluna A:</span>
                  <Badge variant="outline">Nome (Obrigatório)</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Coluna B:</span>
                  <Badge variant="outline">Email (Obrigatório)</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Coluna C:</span>
                  <Badge variant="outline">Telefone (Obrigatório)</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Coluna D:</span>
                  <Badge variant="outline">CPF (Opcional)</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Coluna E:</span>
                  <Badge variant="outline">Data Nasc. (Opcional)</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

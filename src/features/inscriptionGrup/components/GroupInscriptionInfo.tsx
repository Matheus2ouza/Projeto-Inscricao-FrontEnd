import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

export function GroupInscriptionInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Como Funciona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Baixe a Planilha</h4>
            <p className="text-sm text-gray-600">
              Faça o download do template Excel pré-configurado.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">2. Adicione os Dados</h4>
            <p className="text-sm text-gray-600">
              Preencha a planilha com os dados dos participantes.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">3. Faça o Upload</h4>
            <p className="text-sm text-gray-600">
              Carregue a planilha preenchida no campo ao lado.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">4. Confirme e Envie para Análise</h4>
            <p className="text-sm text-gray-600">
              Preencha seus dados como responsável e envie para análise. O
              sistema verificará os dados e retornará erros ou confirmará as
              inscrições.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fluxo de Análise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Análise Automática</h4>
            <p className="text-sm text-gray-600">
              O sistema verificará automaticamente:
            </p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mt-2">
              <li>Formato correto dos dados</li>
              <li>Campos obrigatórios preenchidos</li>
              <li>Duplicidade de inscrições</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Resultado da Análise</h4>
            <p className="text-sm text-gray-600">
              Após a análise, você receberá:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200"
              >
                Lista de Erros (se houver)
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Dados para Confirmação
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Confirmação Final</h4>
            <p className="text-sm text-gray-600">
              Na próxima tela, você poderá revisar todos os dados antes de
              confirmar definitivamente as inscrições no evento.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

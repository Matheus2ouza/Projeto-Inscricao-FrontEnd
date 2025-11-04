import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function GroupInscriptionInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Como Funciona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 1. Responsável */}
          <div className="space-y-2">
            <h4 className="font-semibold">
              1. Preencha os Dados do Responsável
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Informe o nome e telefone obrigatoriamente. O e-mail é opcional,
              mas permite receber atualizações sobre a inscrição.
            </p>
          </div>

          {/* 2. Baixe a planilha */}
          <div className="space-y-2">
            <h4 className="font-semibold">2. Baixe a Planilha</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Faça o download do template Excel clicando em{" "}
              <strong>“Baixar Planilha”</strong>.
            </p>
          </div>

          {/* 3. Preencha os dados */}
          <div className="space-y-2">
            <h4 className="font-semibold">
              3. Adicione os Dados dos Participantes
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Abra a planilha e preencha as informações dos participantes
              conforme o formato indicado no arquivo.
            </p>
          </div>

          {/* 4. Upload */}
          <div className="space-y-2">
            <h4 className="font-semibold">4. Faça o Upload da Planilha</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Após preencher, envie o arquivo Excel no campo{" "}
              <strong>“Planilha Preenchida”</strong> para análise.
            </p>
          </div>

          {/* 5. Envio */}
          <div className="space-y-2">
            <h4 className="font-semibold">5. Envie para Análise</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Clique em <strong>“Enviar para Análise”</strong> e aguarde o
              sistema verificar a planilha. Você será informado se houver erros
              ou se as inscrições forem confirmadas.
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
            <p className="text-sm text-gray-600 dark:text-gray-300">
              O sistema validará automaticamente:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1 mt-2">
              <li>Formato e consistência dos dados</li>
              <li>Campos obrigatórios preenchidos</li>
              <li>Duplicidade de inscrições</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Resultado da Análise</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Após a verificação, você poderá receber:
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
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Na etapa seguinte, revise as informações e confirme o envio
              definitivo das inscrições.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

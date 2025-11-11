import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function IndividualInscriptionInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Como Funciona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Dados do Responsável</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Preencha seus dados como responsável pela inscrição.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">2. Dados do Inscrito</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Informe os dados completos da pessoa que será inscrita.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">3. Tipo de Inscrição</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Selecione o tipo de inscrição desejada e visualize o valor.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">4. Confirme e Envie</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Aceite os termos e condições e finalize a inscrição.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Dados Necessários</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Certifique-se de ter em mãos:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-300  list-disc list-inside space-y-1 mt-2">
              <li>Nome completo do responsável</li>
              <li>Telefone para contato</li>
              <li>Nome completo do inscrito</li>
              <li>Data de nascimento do inscrito</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Validação de Dados</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              O sistema verificará automaticamente:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Campos Obrigatórios
              </Badge>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Formato dos Dados
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Confirmação Final</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Na próxima tela, você poderá revisar todos os dados antes de
              confirmar definitivamente a inscrição no evento.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Suporte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-semibold">Dúvidas?</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Em caso de problemas ou dúvidas durante o processo de inscrição,
              entre em contato com nossa equipe de suporte.
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <strong>Importante:</strong> Verifique se todos os dados estão
              corretos antes de finalizar a inscrição, pois alterações
              posteriores podem ser limitadas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

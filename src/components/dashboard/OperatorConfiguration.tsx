import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ServiceConfigurationForm } from "./ServiceConfigurationForm";
import { 
  OperatorType, 
  ServiceType, 
  TELECOM_OPERATORS, 
  ENERGY_OPERATORS, 
  SERVICES 
} from "@/types/operator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const OperatorConfiguration = ({ teamId }: { teamId: string }) => {
  const { toast } = useToast();
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);

  const { data: operatorConfigs, refetch } = useQuery({
    queryKey: ['operatorConfigs', teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operator_configurations')
        .select(`
          *,
          service_configurations(*)
        `)
        .eq('team_id', teamId);

      if (error) throw error;
      return data;
    }
  });

  const createOperatorConfigMutation = useMutation({
    mutationFn: async (operator: OperatorType) => {
      const { data, error } = await supabase
        .from('operator_configurations')
        .insert([{
          team_id: teamId,
          operator: operator,
          is_active: true
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Sucesso",
        description: "Operador configurado com sucesso!"
      });
    }
  });

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuração de Operadores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert>
            <AlertDescription>
              Selecione os operadores com os quais sua equipe trabalha. Após selecionar um operador,
              você poderá configurar as comissões e regras específicas para cada serviço oferecido.
            </AlertDescription>
          </Alert>

          <div>
            <Label className="text-lg font-semibold">Telecomunicações</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {TELECOM_OPERATORS.map((operator) => (
                <div key={operator} className="flex items-center space-x-2">
                  <Checkbox
                    id={operator}
                    checked={operatorConfigs?.some(config => config.operator === operator)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        createOperatorConfigMutation.mutate(operator);
                        setSelectedOperator(operator);
                      }
                    }}
                  />
                  <Label 
                    htmlFor={operator}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {operator}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold">Energia</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {ENERGY_OPERATORS.map((operator) => (
                <div key={operator} className="flex items-center space-x-2">
                  <Checkbox
                    id={operator}
                    checked={operatorConfigs?.some(config => config.operator === operator)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        createOperatorConfigMutation.mutate(operator);
                        setSelectedOperator(operator);
                      }
                    }}
                  />
                  <Label 
                    htmlFor={operator}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {operator.replace(/_/g, ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {selectedOperator && operatorConfigs?.find(config => config.operator === selectedOperator) && (
            <ServiceConfigurationForm
              operatorConfig={operatorConfigs.find(config => config.operator === selectedOperator)!}
              onSuccess={() => {
                refetch();
                toast({
                  title: "Sucesso",
                  description: "Configurações do serviço atualizadas com sucesso!"
                });
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
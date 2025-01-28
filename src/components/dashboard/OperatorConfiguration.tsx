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

interface ServiceConfiguration {
  id: string;
  service_type: ServiceType;
  base_commission: number;
  is_multiplier: boolean;
  target_sales_count: number | null;
  target_commission_increase: number | null;
  mobile_service_value: number | null;
  mobile_credits_multiplier: boolean;
}

interface OperatorConfig {
  id: string;
  operator: string;
  service_configurations: ServiceConfiguration[];
}

export const OperatorConfiguration = ({ teamId }: { teamId: string }) => {
  const { toast } = useToast();
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);

  const { data: operatorConfigs, refetch } = useQuery({
    queryKey: ['operatorConfigs', teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operator_configurations')
        .select(`
          id,
          operator,
          service_configurations (
            id,
            service_type,
            base_commission,
            is_multiplier,
            target_sales_count,
            target_commission_increase,
            mobile_service_value,
            mobile_credits_multiplier
          )
        `)
        .eq('team_id', teamId);

      if (error) throw error;

      // Transform the service_type to ensure it matches ServiceType
      return data?.map(config => ({
        ...config,
        service_configurations: config.service_configurations.map((service: any) => ({
          ...service,
          service_type: service.service_type as ServiceType,
          target_sales_count: service.target_sales_count || null,
          target_commission_increase: service.target_commission_increase || null,
          mobile_service_value: service.mobile_service_value || null,
        }))
      })) as OperatorConfig[];
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
                  <Label htmlFor={operator}>{operator}</Label>
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
                  <Label htmlFor={operator}>{operator.replace(/_/g, ' ')}</Label>
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
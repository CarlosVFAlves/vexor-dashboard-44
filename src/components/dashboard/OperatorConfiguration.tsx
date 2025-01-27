import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type OperatorType = 
  | "MEO" | "NOS" | "VODAFONE" | "NOWO"
  | "ENDESA" | "IBERDROLA" | "REPSOL" | "GALP" | "G9"
  | "IBELECTRA" | "EDP" | "SU_ELETRICIDADE" | "GOLD_ENERGY"
  | "MEO_ENERGIA" | "PLENITUDE";

type ServiceType = 
  | "1P_MOBILE"
  | "1P_INTERNET"
  | "2P_FIXED_CHANNELS"
  | "2P_FIXED_INTERNET"
  | "3P"
  | "4P";

const TELECOM_OPERATORS: OperatorType[] = ['MEO', 'NOS', 'VODAFONE', 'NOWO'];
const ENERGY_OPERATORS: OperatorType[] = [
  'ENDESA', 'IBERDROLA', 'REPSOL', 'GALP', 'G9', 
  'IBELECTRA', 'EDP', 'SU_ELETRICIDADE', 'GOLD_ENERGY',
  'MEO_ENERGIA', 'PLENITUDE'
];

const SERVICES: ServiceType[] = [
  '1P_MOBILE',
  '1P_INTERNET',
  '2P_FIXED_CHANNELS',
  '2P_FIXED_INTERNET',
  '3P',
  '4P'
];

export const OperatorConfiguration = ({ teamId }: { teamId: string }) => {
  const { toast } = useToast();
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [baseCommission, setBaseCommission] = useState<number>(0);
  const [isMultiplier, setIsMultiplier] = useState<boolean>(false);
  const [targetSalesCount, setTargetSalesCount] = useState<number>(0);
  const [targetCommissionIncrease, setTargetCommissionIncrease] = useState<number>(0);
  const [mobileServiceValue, setMobileServiceValue] = useState<number>(0);
  const [mobileCreditsMultiplier, setMobileCreditsMultiplier] = useState<boolean>(false);

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

  const createServiceConfigMutation = useMutation({
    mutationFn: async ({
      operatorConfigId,
      serviceType,
      baseCommission,
      isMultiplier,
      targetSalesCount,
      targetCommissionIncrease,
      mobileServiceValue,
      mobileCreditsMultiplier
    }: {
      operatorConfigId: string;
      serviceType: ServiceType;
      baseCommission: number;
      isMultiplier: boolean;
      targetSalesCount?: number;
      targetCommissionIncrease?: number;
      mobileServiceValue?: number;
      mobileCreditsMultiplier?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('service_configurations')
        .insert([{
          operator_config_id: operatorConfigId,
          service_type: serviceType,
          base_commission: baseCommission,
          is_multiplier: isMultiplier,
          target_sales_count: targetSalesCount,
          target_commission_increase: targetCommissionIncrease,
          mobile_service_value: mobileServiceValue,
          mobile_credits_multiplier: mobileCreditsMultiplier
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Sucesso",
        description: "Serviço configurado com sucesso!"
      });
    }
  });

  const handleSaveServiceConfig = () => {
    if (!selectedOperator || !selectedService) return;

    createServiceConfigMutation.mutate({
      operatorConfigId: selectedOperator,
      serviceType: selectedService,
      baseCommission,
      isMultiplier,
      targetSalesCount,
      targetCommissionIncrease,
      mobileServiceValue,
      mobileCreditsMultiplier
    });
  };

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {ENERGY_OPERATORS.map((operator) => (
                <div key={operator} className="flex items-center space-x-2">
                  <Checkbox
                    id={operator}
                    checked={operatorConfigs?.some(config => config.operator === operator)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        createOperatorConfigMutation.mutate(operator);
                      }
                    }}
                  />
                  <Label htmlFor={operator}>{operator}</Label>
                </div>
              ))}
            </div>
          </div>

          {operatorConfigs && operatorConfigs.length > 0 && (
            <div className="mt-6 space-y-4">
              <Label className="text-lg font-semibold">Configurar Serviços</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Selecione o Operador</Label>
                  <Select
                    value={selectedOperator || ''}
                    onValueChange={setSelectedOperator}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um operador" />
                    </SelectTrigger>
                    <SelectContent>
                      {operatorConfigs.map((config) => (
                        <SelectItem key={config.id} value={config.id}>
                          {config.operator}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedOperator && (
                  <div>
                    <Label>Selecione o Serviço</Label>
                    <Select
                      value={selectedService || ''}
                      onValueChange={(value) => setSelectedService(value as ServiceType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICES.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {selectedOperator && selectedService && (
                <div className="space-y-4 p-4 bg-accent/50 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Valor da Comissão</Label>
                      <Input
                        type="number"
                        placeholder="Digite o valor"
                        value={baseCommission}
                        onChange={(e) => setBaseCommission(Number(e.target.value))}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isMultiplier"
                        checked={isMultiplier}
                        onCheckedChange={(checked) => setIsMultiplier(!!checked)}
                      />
                      <Label htmlFor="isMultiplier">Usar como Multiplicador</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Meta de Vendas para Aumento</Label>
                      <Input
                        type="number"
                        placeholder="Número de vendas"
                        value={targetSalesCount}
                        onChange={(e) => setTargetSalesCount(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Valor do Aumento</Label>
                      <Input
                        type="number"
                        placeholder="Valor do aumento"
                        value={targetCommissionIncrease}
                        onChange={(e) => setTargetCommissionIncrease(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  {selectedService.includes('MOBILE') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Valor do Serviço Móvel</Label>
                        <Input
                          type="number"
                          placeholder="Valor do serviço"
                          value={mobileServiceValue}
                          onChange={(e) => setMobileServiceValue(Number(e.target.value))}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="mobileCreditsMultiplier"
                          checked={mobileCreditsMultiplier}
                          onCheckedChange={(checked) => setMobileCreditsMultiplier(!!checked)}
                        />
                        <Label htmlFor="mobileCreditsMultiplier">
                          Ativar multiplicador de créditos
                        </Label>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={handleSaveServiceConfig}
                  >
                    Salvar Configuração
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

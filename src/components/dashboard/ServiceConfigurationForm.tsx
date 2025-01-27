import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { ServiceType, SERVICES } from "@/types/operator";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ServiceConfigurationFormProps {
  operatorConfig: {
    id: string;
    operator: string;
    service_configurations: Array<{
      id: string;
      service_type: ServiceType;
      base_commission: number;
      is_multiplier: boolean;
      target_sales_count: number | null;
      target_commission_increase: number | null;
      mobile_service_value: number | null;
      mobile_credits_multiplier: boolean;
    }>;
  };
  onSuccess: () => void;
}

export const ServiceConfigurationForm = ({
  operatorConfig,
  onSuccess,
}: ServiceConfigurationFormProps) => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [baseCommission, setBaseCommission] = useState<number>(0);
  const [isMultiplier, setIsMultiplier] = useState<boolean>(false);
  const [targetSalesCount, setTargetSalesCount] = useState<number>(0);
  const [targetCommissionIncrease, setTargetCommissionIncrease] = useState<number>(0);
  const [mobileServiceValue, setMobileServiceValue] = useState<number>(0);
  const [mobileCreditsMultiplier, setMobileCreditsMultiplier] = useState<boolean>(false);

  const createServiceConfigMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('service_configurations')
        .insert([{
          operator_config_id: operatorConfig.id,
          service_type: selectedService,
          base_commission: baseCommission,
          is_multiplier: isMultiplier,
          target_sales_count: targetSalesCount || null,
          target_commission_increase: targetCommissionIncrease || null,
          mobile_service_value: mobileServiceValue || null,
          mobile_credits_multiplier: mobileCreditsMultiplier
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      onSuccess();
      setSelectedService(null);
    }
  });

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <Alert>
            <AlertDescription>
              Configure as comissões e regras para cada tipo de serviço oferecido por este operador.
            </AlertDescription>
          </Alert>

          <div>
            <Label>Selecione o Serviço</Label>
            <Select
              value={selectedService || ''}
              onValueChange={(value) => setSelectedService(value as ServiceType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha um serviço" />
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

          {selectedService && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Valor da Comissão</Label>
                  <Input
                    type="number"
                    value={baseCommission}
                    onChange={(e) => setBaseCommission(Number(e.target.value))}
                    placeholder="Digite o valor"
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
                    value={targetSalesCount}
                    onChange={(e) => setTargetSalesCount(Number(e.target.value))}
                    placeholder="Número de vendas"
                  />
                </div>
                <div>
                  <Label>Valor do Aumento</Label>
                  <Input
                    type="number"
                    value={targetCommissionIncrease}
                    onChange={(e) => setTargetCommissionIncrease(Number(e.target.value))}
                    placeholder="Valor do aumento"
                  />
                </div>
              </div>

              {selectedService.includes('MOBILE') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Valor do Serviço Móvel</Label>
                    <Input
                      type="number"
                      value={mobileServiceValue}
                      onChange={(e) => setMobileServiceValue(Number(e.target.value))}
                      placeholder="Valor do serviço"
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
                onClick={() => createServiceConfigMutation.mutate()}
              >
                Salvar Configuração
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
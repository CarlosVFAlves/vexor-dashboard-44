import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { ServiceType } from "@/types/operator";

interface ServiceConfigurationFormProps {
  selectedService: ServiceType | null;
  onSave: (config: {
    baseCommission: number;
    isMultiplier: boolean;
    targetSalesCount: number;
    targetCommissionIncrease: number;
    mobileServiceValue: number;
    mobileCreditsMultiplier: boolean;
  }) => void;
}

export const ServiceConfigurationForm = ({
  selectedService,
  onSave,
}: ServiceConfigurationFormProps) => {
  const [baseCommission, setBaseCommission] = useState<number>(0);
  const [isMultiplier, setIsMultiplier] = useState<boolean>(false);
  const [targetSalesCount, setTargetSalesCount] = useState<number>(0);
  const [targetCommissionIncrease, setTargetCommissionIncrease] = useState<number>(0);
  const [mobileServiceValue, setMobileServiceValue] = useState<number>(0);
  const [mobileCreditsMultiplier, setMobileCreditsMultiplier] = useState<boolean>(false);

  const handleSave = () => {
    onSave({
      baseCommission,
      isMultiplier,
      targetSalesCount,
      targetCommissionIncrease,
      mobileServiceValue,
      mobileCreditsMultiplier,
    });
  };

  if (!selectedService) return null;

  return (
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
        onClick={handleSave}
      >
        Salvar Configuração
      </Button>
    </div>
  );
};
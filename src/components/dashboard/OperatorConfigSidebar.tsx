import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { ServiceConfigurationForm } from "./ServiceConfigurationForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  TELECOM_OPERATORS, 
  ENERGY_OPERATORS, 
  ServiceType,
  OperatorType,
  SERVICES
} from "@/types/operator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export const OperatorConfigSidebar = () => {
  const [open, setOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<OperatorType | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [expandedSection, setExpandedSection] = useState<'telecom' | 'energy' | null>(null);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    document.addEventListener('openOperatorConfig', handleOpen);
    return () => document.removeEventListener('openOperatorConfig', handleOpen);
  }, []);

  const { data: operatorConfig } = useQuery({
    queryKey: ['operatorConfig', selectedOperator],
    queryFn: async () => {
      if (!selectedOperator) return null;

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
        .eq('operator', selectedOperator)
        .single();

      if (error) throw error;
      
      // Transform the service_type to ensure it matches ServiceType
      const transformedData = {
        ...data,
        service_configurations: data.service_configurations.map((config: any) => ({
          ...config,
          service_type: config.service_type as ServiceType,
          target_sales_count: config.target_sales_count || null,
          target_commission_increase: config.target_commission_increase || null,
          mobile_service_value: config.mobile_service_value || null,
        }))
      };

      return transformedData as OperatorConfig;
    },
    enabled: !!selectedOperator
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Configuração de Operadores</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Telecommunications Section */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setExpandedSection(expandedSection === 'telecom' ? null : 'telecom')}
            >
              <span>Telecomunicações</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${
                expandedSection === 'telecom' ? 'transform rotate-180' : ''
              }`} />
            </Button>
            
            {expandedSection === 'telecom' && (
              <div className="space-y-4 pl-4">
                {TELECOM_OPERATORS.map((operator) => (
                  <div key={operator} className="flex items-center space-x-2">
                    <Checkbox
                      id={operator}
                      checked={selectedOperator === operator}
                      onCheckedChange={() => {
                        setSelectedOperator(operator);
                        setSelectedService(null);
                      }}
                    />
                    <Label htmlFor={operator}>{operator}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Energy Section */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setExpandedSection(expandedSection === 'energy' ? null : 'energy')}
            >
              <span>Energia</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${
                expandedSection === 'energy' ? 'transform rotate-180' : ''
              }`} />
            </Button>
            
            {expandedSection === 'energy' && (
              <div className="space-y-4 pl-4">
                {ENERGY_OPERATORS.map((operator) => (
                  <div key={operator} className="flex items-center space-x-2">
                    <Checkbox
                      id={operator}
                      checked={selectedOperator === operator}
                      onCheckedChange={() => {
                        setSelectedOperator(operator);
                        setSelectedService(null);
                      }}
                    />
                    <Label htmlFor={operator}>{operator}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Service Selection and Configuration */}
          {selectedOperator && operatorConfig && (
            <div className="space-y-4">
              <Label>Selecione o Serviço</Label>
              <Select
                value={selectedService || ""}
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

              {/* Service Configuration Form */}
              {selectedService && (
                <ServiceConfigurationForm
                  operatorConfig={operatorConfig}
                  onSuccess={() => {
                    setSelectedService(null);
                  }}
                />
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
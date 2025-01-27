import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { ServiceConfigurationForm } from "./ServiceConfigurationForm";
import { 
  TELECOM_OPERATORS, 
  ENERGY_OPERATORS, 
  ServiceType,
  OperatorType 
} from "@/types/operator";

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

          {/* Service Configuration Form */}
          {selectedOperator && (
            <ServiceConfigurationForm
              selectedService={selectedService}
              onSave={(config) => {
                console.log('Saving config:', config);
                // Implement save logic
              }}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
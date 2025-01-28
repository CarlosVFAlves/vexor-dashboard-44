import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceConfigurationForm } from "@/components/dashboard/ServiceConfigurationForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Products = () => {
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);

  const { data: operatorConfig, refetch } = useQuery({
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
      return data;
    },
    enabled: !!selectedOperator
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Produtos e Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                {operatorConfig && (
                  <ServiceConfigurationForm 
                    operatorConfig={operatorConfig}
                    onSuccess={() => refetch()}
                  />
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Products;
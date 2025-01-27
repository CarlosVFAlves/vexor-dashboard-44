import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, RefreshCw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const getCurrentMonthData = async () => {
  console.log("Fetching current month sales data");
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('sales')
    .select('amount, sale_date')
    .gte('sale_date', startOfMonth.toISOString())
    .order('sale_date', { ascending: true });

  if (error) throw error;

  // Group by date and sum amounts
  const salesByDate = data.reduce((acc: any, curr) => {
    const date = new Date(curr.sale_date).getDate().toString();
    if (!acc[date]) acc[date] = 0;
    acc[date] += Number(curr.amount);
    return acc;
  }, {});

  // Convert to array format for chart
  return Object.entries(salesByDate).map(([date, sales]) => ({
    name: date,
    sales,
  }));
};

export const SalesSummary = () => {
  const { toast } = useToast();
  const currentMonth = new Date().toLocaleString('pt-PT', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const [totalSales, setTotalSales] = useState(0);

  const { data: salesData, refetch } = useQuery({
    queryKey: ['currentMonthSales'],
    queryFn: getCurrentMonthData,
    refetchInterval: 30000,
  });

  useEffect(() => {
    const channel = supabase
      .channel('sales_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sales' },
        () => {
          console.log('Sales data changed, refetching...');
          refetch();
          toast({
            title: "Dados de vendas atualizados",
            description: "Os dados foram atualizados em tempo real.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  useEffect(() => {
    if (salesData) {
      const total = salesData.reduce((sum, item) => sum + (item.sales as number), 0);
      setTotalSales(total);
    }
  }, [salesData]);

  return (
    <Card className="w-full dark:border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground">Sumário de Vendas</CardTitle>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm text-muted-foreground">
              {currentMonth} {currentYear}
            </span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => refetch()}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 text-foreground">
            <FileText className="h-4 w-4" />
            Ver Todas as Vendas
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" /> Registar Venda
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4 text-foreground">
          €{totalSales.toLocaleString('pt-PT')}
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="name" 
                stroke="currentColor"
                className="text-muted-foreground"
              />
              <YAxis 
                stroke="currentColor"
                className="text-muted-foreground"
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
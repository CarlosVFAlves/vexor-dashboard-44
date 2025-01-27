import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, RefreshCw, Calendar } from "lucide-react";
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
import { Slider } from "@/components/ui/slider";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";

type DateRange = {
  start: Date;
  end: Date;
};

type PeriodType = "week" | "month" | "year";

const getSalesData = async (startDate: Date, endDate: Date) => {
  console.log("Fetching sales data from", startDate, "to", endDate);
  
  const { data, error } = await supabase
    .from('sales')
    .select('amount, sale_date')
    .gte('sale_date', startDate.toISOString())
    .lte('sale_date', endDate.toISOString())
    .order('sale_date', { ascending: true });

  if (error) throw error;

  // Group by date and sum amounts
  const salesByDate = data.reduce((acc: any, curr) => {
    const date = format(new Date(curr.sale_date), 'dd/MM');
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

const getDateRangeForPeriod = (period: PeriodType): DateRange => {
  const now = new Date();
  switch (period) {
    case "week":
      return {
        start: startOfWeek(now, { weekStartsOn: 0 }),
        end: endOfWeek(now, { weekStartsOn: 0 }),
      };
    case "month":
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
    case "year":
      return {
        start: startOfYear(now),
        end: endOfYear(now),
      };
  }
};

export const SalesSummary = () => {
  const { toast } = useToast();
  const [period, setPeriod] = useState<PeriodType>("month");
  const [dateRange, setDateRange] = useState<DateRange>(getDateRangeForPeriod("month"));
  const [totalSales, setTotalSales] = useState(0);

  const { data: salesData, refetch } = useQuery({
    queryKey: ['sales', dateRange],
    queryFn: () => getSalesData(dateRange.start, dateRange.end),
    refetchInterval: 0, // Disabled because we're using real-time updates
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
            title: "Nova venda registrada",
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

  const handlePeriodChange = (value: number[]) => {
    const periodMap: PeriodType[] = ["week", "month", "year"];
    const newPeriod = periodMap[value[0]];
    setPeriod(newPeriod);
    setDateRange(getDateRangeForPeriod(newPeriod));
  };

  const periodLabel = {
    week: "Semana",
    month: "Mês",
    year: "Ano"
  }[period];

  const dateRangeText = `${format(dateRange.start, 'dd/MM/yyyy')} - ${format(dateRange.end, 'dd/MM/yyyy')}`;

  return (
    <Card className="w-full dark:border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground">Sumário de Vendas</CardTitle>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm text-muted-foreground">
              {periodLabel} atual • {dateRangeText}
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
            <Calendar className="h-4 w-4" />
            Personalizar Período
          </Button>
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
        <div className="mb-6">
          <span className="text-sm text-muted-foreground mb-2 block">Período de análise</span>
          <Slider
            defaultValue={[1]}
            max={2}
            step={1}
            onValueChange={handlePeriodChange}
            className="w-[200px]"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1 w-[200px]">
            <span>Semana</span>
            <span>Mês</span>
            <span>Ano</span>
          </div>
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Filter, RefreshCw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const getCurrentMonthData = () => {
  // Simulated API call - replace with actual API
  console.log("Fetching current month sales data");
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  
  return Array.from({ length: daysInMonth }, (_, i) => ({
    name: `${i + 1}`,
    sales: Math.floor(Math.random() * 10000),
  }));
};

export const SalesSummary = () => {
  const currentMonth = new Date().toLocaleString('pt-PT', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const { data: salesData, refetch } = useQuery({
    queryKey: ['currentMonthSales'],
    queryFn: getCurrentMonthData,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

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
        <div className="text-2xl font-bold mb-4 text-foreground">€245,890</div>
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
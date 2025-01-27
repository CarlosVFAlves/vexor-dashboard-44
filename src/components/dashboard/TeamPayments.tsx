import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const getTeamPayments = async () => {
  console.log("Fetching team payments data");
  const { data: sales, error: salesError } = await supabase
    .from('sales')
    .select('amount, operator:team_members(name)')
    .gte('sale_date', new Date(new Date().setDate(new Date().getDate() - 7)).toISOString())
    .order('sale_date', { ascending: false });

  if (salesError) throw salesError;

  // Group and calculate totals by operator
  const paymentsByOperator = sales.reduce((acc: any, sale: any) => {
    const operatorName = sale.operator?.name || 'Unknown';
    if (!acc[operatorName]) {
      acc[operatorName] = {
        name: operatorName,
        salesCount: 0,
        totalAmount: 0,
        commission: 0,
        pendingPayment: 0
      };
    }
    acc[operatorName].salesCount += 1;
    acc[operatorName].totalAmount += Number(sale.amount);
    acc[operatorName].commission = acc[operatorName].totalAmount * 0.1; // 10% commission
    acc[operatorName].pendingPayment = acc[operatorName].commission;
    return acc;
  }, {});

  return Object.values(paymentsByOperator);
};

export const TeamPayments = () => {
  const { data: payments, refetch } = useQuery({
    queryKey: ['team-payments'],
    queryFn: getTeamPayments,
    refetchInterval: 30000,
  });

  return (
    <Card className="dark:border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Pagamentos Pendentes da Equipa</CardTitle>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => refetch()}
          className="hover:bg-accent hover:text-accent-foreground"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">Comercial</TableHead>
              <TableHead className="text-foreground">Número de Vendas</TableHead>
              <TableHead className="text-foreground">Valor de Comissão</TableHead>
              <TableHead className="text-foreground">Valor Pendente</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments?.map((payment: any) => (
              <TableRow 
                key={payment.name}
                className="hover:bg-accent/50"
              >
                <TableCell className="font-medium text-foreground">
                  {payment.name}
                </TableCell>
                <TableCell className="text-foreground">{payment.salesCount}</TableCell>
                <TableCell className="text-foreground">
                  {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(payment.commission)}
                </TableCell>
                <TableCell className="text-foreground">
                  {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(payment.pendingPayment)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
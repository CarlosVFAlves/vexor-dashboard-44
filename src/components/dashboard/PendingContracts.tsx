import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const getContracts = async () => {
  console.log("Fetching contracts data");
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const PendingContracts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: contracts, refetch } = useQuery({
    queryKey: ['contracts'],
    queryFn: getContracts,
    refetchInterval: 30000,
  });

  useEffect(() => {
    const channel = supabase
      .channel('contracts_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contracts' },
        () => {
          console.log('Contracts data changed, refetching...');
          refetch();
          toast({
            title: "Contratos atualizados",
            description: "Os dados foram atualizados em tempo real.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  return (
    <Card className="dark:border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Contratos Pendentes</CardTitle>
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
              <TableHead className="text-foreground">ID do Vendedor</TableHead>
              <TableHead className="text-foreground">Nome do Vendedor</TableHead>
              <TableHead className="text-foreground">Nome do Cliente</TableHead>
              <TableHead className="text-foreground">Contribuinte</TableHead>
              <TableHead className="text-foreground">Empresa</TableHead>
              <TableHead className="text-foreground">Estado</TableHead>
              <TableHead className="text-foreground">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts?.map((contract) => (
              <TableRow 
                key={contract.id}
                className="hover:bg-accent/50"
              >
                <TableCell className="font-medium text-foreground">
                  {contract.id.slice(0, 8)}
                </TableCell>
                <TableCell className="text-foreground">{contract.operator}</TableCell>
                <TableCell className="text-foreground">
                  {`${contract.client_first_name} ${contract.client_last_name}`}
                </TableCell>
                <TableCell className="text-foreground">
                  {contract.client_tax_id || "N/A"}
                </TableCell>
                <TableCell className="text-foreground">
                  {contract.company_name || "N/A"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={contract.status === "Pendente" ? "secondary" : "default"}
                    className="text-foreground"
                  >
                    {contract.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/pending-contracts?id=${contract.id}`)}
                    className="text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar Contrato
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
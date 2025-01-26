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
import { RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const getContracts = () => {
  // Simulated API call - replace with actual API
  console.log("Fetching contracts data");
  return [
    {
      id: 1,
      clientName: "João Silva",
      operator: "Maria Santos",
      status: "Pendente",
    },
    {
      id: 2,
      clientName: "António Costa",
      operator: "Pedro Oliveira",
      status: "Assinado",
    },
    {
      id: 3,
      clientName: "Ana Pereira",
      operator: "Sara Martins",
      status: "Pendente",
    },
  ];
};

export const PendingContracts = () => {
  const navigate = useNavigate();
  const { data: contracts, refetch } = useQuery({
    queryKey: ['contracts'],
    queryFn: getContracts,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <Card className="dark:border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Atualizações de Vendas</CardTitle>
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
              <TableHead className="text-foreground">Nome do Cliente</TableHead>
              <TableHead className="text-foreground">Vendedor</TableHead>
              <TableHead className="text-foreground">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts?.map((contract) => (
              <TableRow 
                key={contract.id}
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => navigate(`/pending-contracts?id=${contract.id}`)}
              >
                <TableCell className="font-medium text-foreground">
                  {contract.clientName}
                </TableCell>
                <TableCell className="text-foreground">{contract.operator}</TableCell>
                <TableCell>
                  <Badge
                    variant={contract.status === "Pendente" ? "secondary" : "default"}
                    className="text-foreground"
                  >
                    {contract.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
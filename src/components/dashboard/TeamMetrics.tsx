import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";

const getTeamData = () => {
  // Simulated API call - replace with actual API
  console.log("Fetching team metrics data");
  return [
    { name: "João", sales: Math.floor(Math.random() * 200), target: 150 },
    { name: "Maria", sales: Math.floor(Math.random() * 200), target: 150 },
    { name: "António", sales: Math.floor(Math.random() * 200), target: 150 },
    { name: "Ana", sales: Math.floor(Math.random() * 200), target: 150 },
    { name: "Pedro", sales: Math.floor(Math.random() * 200), target: 150 },
    { name: "Sara", sales: Math.floor(Math.random() * 200), target: 150 },
  ];
};

export const TeamMetrics = () => {
  const { data, refetch } = useQuery({
    queryKey: ['teamMetrics'],
    queryFn: getTeamData,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <Card className="dark:border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Métricas da Equipa</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => refetch()}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="text-foreground">
            <Download className="mr-2 h-4 w-4" /> Exportar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="name" 
                stroke="currentColor"
                className="text-muted-foreground"
              />
              <YAxis 
                domain={[0, 200]} 
                stroke="currentColor"
                className="text-muted-foreground"
              />
              <Tooltip />
              <Bar dataKey="sales" fill="hsl(var(--primary))" />
              <Bar dataKey="target" fill="hsl(var(--muted))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
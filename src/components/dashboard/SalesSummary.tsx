import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
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

const data = [
  { name: "Jan", sales: 4000 },
  { name: "Fev", sales: 3000 },
  { name: "Mar", sales: 2000 },
  { name: "Abr", sales: 2780 },
  { name: "Mai", sales: 1890 },
  { name: "Jun", sales: 2390 },
];

export const SalesSummary = () => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sumário de Vendas</CardTitle>
          <div className="flex gap-2 mt-4">
            <Select defaultValue="2024">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="1">Janeiro</SelectItem>
                <SelectItem value="2">Fevereiro</SelectItem>
                <SelectItem value="3">Março</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Semana" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="1">Semana 1</SelectItem>
                <SelectItem value="2">Semana 2</SelectItem>
                <SelectItem value="3">Semana 3</SelectItem>
                <SelectItem value="4">Semana 4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Ver Todas as Vendas
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Registar Venda
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">€245,890</div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#4CAF50"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
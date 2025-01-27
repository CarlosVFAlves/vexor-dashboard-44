import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Plus, Trash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const getTeamConfigurations = async () => {
  console.log("Fetching team configurations");
  const { data, error } = await supabase
    .from('team_configurations')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const TeamConfiguration = () => {
  const { toast } = useToast();
  const [newTeamName, setNewTeamName] = useState("");
  const { data: teams, refetch } = useQuery({
    queryKey: ['teamConfigurations'],
    queryFn: getTeamConfigurations
  });

  const handleAddTeam = async () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um nome para a equipa.",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('team_configurations')
      .insert([{ team_name: newTeamName.trim() }]);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a equipa.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Equipa adicionada com sucesso!"
    });
    setNewTeamName("");
    refetch();
  };

  const handleDeleteTeam = async (id: string) => {
    const { error } = await supabase
      .from('team_configurations')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível eliminar a equipa.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Equipa eliminada com sucesso!"
    });
    refetch();
  };

  return (
    <Card className="dark:border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuração de Equipas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="teamName">Nome da Equipa</Label>
              <Input
                id="teamName"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Digite o nome da equipa"
              />
            </div>
            <Button 
              onClick={handleAddTeam}
              className="mt-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-2">
            {teams?.map((team) => (
              <div 
                key={team.id}
                className="flex items-center justify-between p-2 rounded-md bg-accent/50"
              >
                <span className="text-foreground">{team.team_name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTeam(team.id)}
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
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

const TeamConfig = () => {
  const { toast } = useToast();
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamLeader, setNewTeamLeader] = useState("");
  const { data: teams, refetch } = useQuery({
    queryKey: ['teamConfigurations'],
    queryFn: getTeamConfigurations
  });

  const handleAddTeam = async () => {
    if (!newTeamName.trim() || !newTeamLeader.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('team_configurations')
      .insert([{ 
        team_name: newTeamName.trim(),
        team_leader_name: newTeamLeader.trim()
      }]);

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
    setNewTeamLeader("");
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-white">
        <DashboardSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4">
            <Card className="dark:border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuração de Equipas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="teamName">Nome da Equipa</Label>
                      <Input
                        id="teamName"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder="Digite o nome da equipa"
                      />
                    </div>
                    <div>
                      <Label htmlFor="teamLeader">Chefe de Equipa</Label>
                      <Input
                        id="teamLeader"
                        value={newTeamLeader}
                        onChange={(e) => setNewTeamLeader(e.target.value)}
                        placeholder="Digite o nome do chefe de equipa"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleAddTeam}
                    className="w-full md:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Equipa
                  </Button>

                  <div className="space-y-2 mt-6">
                    {teams?.map((team) => (
                      <div 
                        key={team.id}
                        className="flex items-center justify-between p-4 rounded-md bg-accent/50"
                      >
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">ID: {team.id}</div>
                          <div className="font-medium">{team.team_name}</div>
                          <div className="text-sm">Chefe: {team.team_leader_name}</div>
                        </div>
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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeamConfig;
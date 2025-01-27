import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Plus, Trash, UserPlus, Copy } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const generateTeamCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const generateInvitationCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

const getTeamConfigurations = async () => {
  console.log("Fetching team configurations");
  const { data, error } = await supabase
    .from('team_configurations')
    .select('*, team_invitations(*)');

  if (error) throw error;
  return data;
};

export const TeamConfiguration = () => {
  const { toast } = useToast();
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamLeader, setNewTeamLeader] = useState("");
  const { data: teams, refetch } = useQuery({
    queryKey: ['teamConfigurations'],
    queryFn: getTeamConfigurations
  });

  const createInvitationMutation = useMutation({
    mutationFn: async (teamId: string) => {
      const { data, error } = await supabase
        .from('team_invitations')
        .insert([{
          team_id: teamId,
          invitation_code: generateInvitationCode()
        }]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Sucesso",
        description: "Código de convite gerado com sucesso!"
      });
    },
    onError: (error) => {
      console.error('Error creating invitation:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o código de convite.",
        variant: "destructive"
      });
    }
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

    const teamCode = generateTeamCode();

    const { error } = await supabase
      .from('team_configurations')
      .insert([{ 
        team_name: newTeamName.trim(),
        team_leader_name: newTeamLeader.trim(),
        team_code: teamCode
      }]);

    if (error) {
      console.error('Error creating team:', error);
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
      console.error('Error deleting team:', error);
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

  const handleCopyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Sucesso",
      description: "Código copiado para a área de transferência!"
    });
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

          <div className="space-y-2">
            {teams?.map((team) => (
              <div 
                key={team.id}
                className="flex flex-col space-y-3 p-4 rounded-md bg-accent/50"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Código da Equipa: {team.team_code}</div>
                    <div className="font-medium">{team.team_name}</div>
                    <div className="text-sm">Chefe: {team.team_leader_name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => createInvitationMutation.mutate(team.id)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Gerar Convite
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTeam(team.id)}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {team.team_invitations && team.team_invitations.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <Label>Códigos de Convite Ativos</Label>
                    <div className="space-y-2">
                      {team.team_invitations
                        .filter(invite => !invite.used_at)
                        .map((invite) => (
                          <div 
                            key={invite.id}
                            className="flex items-center justify-between p-2 bg-background rounded"
                          >
                            <code className="text-sm">{invite.invitation_code}</code>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopyInviteCode(invite.invitation_code)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
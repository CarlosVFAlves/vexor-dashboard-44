import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Settings, UserPlus, Copy, User } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const generateInvitationCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

type TeamMember = {
  id: string;
  name: string;
  tax_id: string | null;
  commercial_code: string | null;
  sales_target: number;
};

export const TeamConfiguration = () => {
  const { toast } = useToast();

  const { data: team, refetch } = useQuery({
    queryKey: ['teamConfiguration'],
    queryFn: async () => {
      // First, get the team configuration and its invitations
      const { data: teamData, error: teamError } = await supabase
        .from('team_configurations')
        .select(`
          *,
          team_invitations(
            *,
            used_by(*)
          )
        `)
        .single();

      if (teamError) throw teamError;

      // Get all team members who have used invitations for this team
      const { data: teamMembers, error: membersError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamData.id);

      if (membersError) throw membersError;

      return {
        ...teamData,
        team_members: teamMembers || []
      };
    }
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

  const handleCopyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Sucesso",
      description: "Código copiado para a área de transferência!"
    });
  };

  if (!team) {
    return (
      <Card className="dark:border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Carregando configurações...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="dark:border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuração da Minha Equipa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Equipa: {team.team_name}</h3>
                <p className="text-sm text-muted-foreground">Código da Equipa: {team.team_code}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => createInvitationMutation.mutate(team.id)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Convidar Membros
              </Button>
            </div>

            {team.team_invitations && team.team_invitations.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label>Códigos de Convite Ativos</Label>
                <div className="space-y-2">
                  {team.team_invitations
                    .filter(invite => !invite.used_at)
                    .map((invite) => (
                      <div 
                        key={invite.id}
                        className="flex items-center justify-between p-2 bg-accent/50 rounded"
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

          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Membros Ativos
            </h3>
            <div className="grid gap-4">
              {team.team_members?.map((member: TeamMember) => (
                <div 
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-accent/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.tax_id && `NIF: ${member.tax_id}`}
                      {member.commercial_code && ` | Código: ${member.commercial_code}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Ver Estatísticas
                    </Button>
                    <Button variant="outline" size="sm">
                      Ver Perfil
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
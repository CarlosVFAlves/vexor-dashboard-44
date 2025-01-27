import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, UserPlus, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type TeamMember = {
  id: string;
  name: string;
  tax_id: string | null;
  commercial_code: string | null;
};

export const TeamDashboard = () => {
  const { toast } = useToast();
  const { data: team } = useQuery({
    queryKey: ['teamConfiguration'],
    queryFn: async () => {
      const { data: teamData, error } = await supabase
        .from('team_configurations')
        .select(`
          *,
          team_invitations(
            *,
            used_by(*)
          ),
          team_members(*)
        `)
        .maybeSingle();

      if (error) throw error;
      return teamData;
    }
  });

  const handleCopyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Sucesso",
      description: "Código copiado para a área de transferência!"
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Minha Equipa
        </CardTitle>
        <Button
          variant="outline"
          onClick={() => {
            // Open operator config sidebar
            document.dispatchEvent(new CustomEvent('openOperatorConfig'));
          }}
        >
          Configurar Operadores
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {team && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Equipa: {team.team_name}</h3>
                  <p className="text-sm text-muted-foreground">Código da Equipa: {team.team_code}</p>
                </div>
                <Button variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Convidar Membros
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Membros Ativos
                </h3>
                {team.team_members?.length > 0 ? (
                  <div className="grid gap-4">
                    {team.team_members.map((member: TeamMember) => (
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
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Tente convidar alguns membros :(</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
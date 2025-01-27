import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamInfo } from "./TeamInfo";
import { TeamMembersList } from "./TeamMembersList";

export const TeamDashboard = () => {
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
            document.dispatchEvent(new CustomEvent('openOperatorConfig'));
          }}
        >
          Configurar Operadores
        </Button>
      </CardHeader>
      <CardContent>
        {team && (
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList>
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="members">Membros</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-6">
              <TeamInfo 
                teamName={team.team_name} 
                teamCode={team.team_code} 
              />
            </TabsContent>
            
            <TabsContent value="members">
              <TeamMembersList members={team.team_members || []} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
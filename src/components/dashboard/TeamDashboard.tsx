import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamInfo } from "./TeamInfo";
import { TeamOperators } from "./TeamOperators";
import { TeamMembersList } from "./TeamMembersList";
import { OperatorConfiguration } from "./OperatorConfiguration";

export const TeamDashboard = () => {
  const { data: team } = useQuery({
    queryKey: ['teamConfiguration'],
    queryFn: async () => {
      const { data: teamData, error } = await supabase
        .from('team_configurations')
        .select(`
          *,
          team_members(*)
        `)
        .maybeSingle();

      if (error) throw error;
      return teamData;
    }
  });

  if (!team) return null;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Definições
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <TeamInfo 
            teamName={team.team_name}
            teamLeaderName={team.team_leader_name}
            memberCount={team.team_members?.length || 0}
          />
          <TeamOperators teamId={team.id} />
          <TeamMembersList members={team.team_members || []} />
        </TabsContent>
        
        <TabsContent value="settings">
          <OperatorConfiguration teamId={team.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
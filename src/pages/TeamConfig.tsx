import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { TeamConfiguration } from "@/components/dashboard/TeamConfiguration";
import { OperatorConfiguration } from "@/components/dashboard/OperatorConfiguration";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TeamConfig = () => {
  const { data: teams } = useQuery({
    queryKey: ['teamConfigurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_configurations')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-white">
        <DashboardSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4">
            <TeamConfiguration />
            {teams?.map((team) => (
              <OperatorConfiguration key={team.id} teamId={team.id} />
            ))}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeamConfig;
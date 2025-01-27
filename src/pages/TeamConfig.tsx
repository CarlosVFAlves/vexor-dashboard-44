import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { TeamDashboard } from "@/components/dashboard/TeamDashboard";

const TeamConfig = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-white">
        <DashboardSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4">
            <TeamDashboard />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeamConfig;
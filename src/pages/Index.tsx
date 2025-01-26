import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { SalesSummary } from "@/components/dashboard/SalesSummary";
import { PendingContracts } from "@/components/dashboard/PendingContracts";
import { TeamMetrics } from "@/components/dashboard/TeamMetrics";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-white">
        <DashboardSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 space-y-4">
            <SalesSummary />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PendingContracts />
              <TeamMetrics />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
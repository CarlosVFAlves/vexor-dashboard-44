import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { SalesSummary } from "@/components/dashboard/SalesSummary";
import { PendingContracts } from "@/components/dashboard/PendingContracts";
import { TeamConfiguration } from "@/components/dashboard/TeamConfiguration";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-white">
        <DashboardSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 space-y-4">
            <SalesSummary />
            <div className="grid grid-cols-1 gap-4">
              <TeamConfiguration />
              <PendingContracts />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
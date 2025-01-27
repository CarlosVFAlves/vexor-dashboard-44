import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { PendingContracts as PendingContractsComponent } from "@/components/dashboard/PendingContracts";

const PendingContracts = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4">
            <PendingContractsComponent />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PendingContracts;
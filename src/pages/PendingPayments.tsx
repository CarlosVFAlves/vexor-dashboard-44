import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { TeamPayments } from "@/components/dashboard/TeamPayments";

const PendingPayments = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4">
            <TeamPayments />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PendingPayments;
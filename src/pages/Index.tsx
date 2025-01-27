import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { BlogPosts } from "@/components/dashboard/BlogPosts";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleHelpClick = () => {
    toast({
      title: "Ajuda VEXOR",
      description: "Entre em contato conosco pelo email: suporte@vexor.com",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 relative">
          <TopBar />
          <main className="p-4 space-y-4">
            <BlogPosts />
          </main>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 rounded-full"
            onClick={handleHelpClick}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
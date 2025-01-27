import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Products = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-white">
        <DashboardSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4">
            <Card>
              <CardHeader>
                <CardTitle>Listagem de Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Página em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Products;
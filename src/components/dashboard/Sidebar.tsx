import { BarChart3, FileText, Home, Users, LogOut, Plus, DollarSign, Settings, Grid, List, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const menuItems = [
  { icon: List, label: "Atualizações da Equipa", path: "/" },
  { icon: Grid, label: "Listagem de Produtos", path: "/products" },
  { icon: FileText, label: "Contratos Pendentes", path: "/pending-contracts" },
  { icon: DollarSign, label: "Pagamentos Pendentes", path: "/pending-payments" },
  { icon: BarChart3, label: "Métricas da Equipa", path: "/metrics" },
  { icon: Users, label: "Perfil", path: "/profile" },
  { icon: Palette, label: "Criativos", path: "/creative" },
];

const bottomMenuItems = [
  { icon: Settings, label: "Configuração da Minha Equipa", path: "/team-config" },
];

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleRegisterSale = () => {
    toast({
      title: "Registar Venda",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast({
      title: "Logout efetuado com sucesso",
      description: "Até breve!",
    });
  };

  return (
    <Sidebar>
      <div className="p-4">
        <img src="/vexor-logo.png" alt="Vexor" className="h-8 w-auto" />
        <div className="mt-1 text-xs text-muted-foreground">v0.01 Alpha</div>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "w-full text-foreground hover:bg-accent hover:text-accent-foreground",
                      location.pathname === item.path && "bg-primary/20 text-primary"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-4 px-4">
          <Button 
            variant="default" 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handleRegisterSale}
          >
            <Plus className="mr-2 h-4 w-4" />
            Registar Venda
          </Button>
        </div>

        <div className="mt-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {bottomMenuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "w-full text-foreground hover:bg-accent hover:text-accent-foreground",
                        location.pathname === item.path && "bg-primary/20 text-primary"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="p-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Terminar Sessão
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
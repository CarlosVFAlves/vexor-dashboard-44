import { BarChart3, FileText, Home, Users, LogOut, Plus, DollarSign, Settings, Grid, List, Palette, Ticket, ExternalLink, Shield } from "lucide-react";
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
import { useEffect, useState } from "react";

const menuItems = [
  { icon: List, label: "Atualizações da Equipa", path: "/" },
  { icon: Grid, label: "Listagem de Produtos", path: "/products" },
  { icon: FileText, label: "Contratos Pendentes", path: "/pending-contracts" },
  { icon: DollarSign, label: "Pagamentos Pendentes", path: "/pending-payments" },
  { icon: BarChart3, label: "Métricas da Equipa", path: "/metrics" },
  { icon: Users, label: "Perfil", path: "/profile" },
  { icon: Palette, label: "Criativos", path: "/creative" },
  { icon: Ticket, label: "Tickets", path: "/tickets" },
  { icon: ExternalLink, label: "Vendas Externas", path: "/external-sales" },
];

const bottomMenuItems = [
  { icon: Settings, label: "Configuração da Minha Equipa", path: "/team-config" },
];

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        setIsAdmin(profile?.role === 'ADMIN');
      }
    };

    checkAdminStatus();
  }, []);

  const handleRegisterSale = () => {
    toast({
      title: "Registar Venda",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleExternalSale = () => {
    navigate("/external-sales");
    toast({
      title: "Solicitar Venda Externa",
      description: "Redirecionando para vendas externas",
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
        <img src="/lovable-uploads/d4be44e3-cf29-4c0b-bf74-afcb58de6f3b.png" alt="Vexor" className="h-6 w-auto dark:hidden" />
        <img src="/lovable-uploads/e60e2354-1e06-4ff9-8ba7-cf325c11a432.png" alt="Vexor" className="h-6 w-auto hidden dark:block" />
        <div className="mt-1 text-xs text-muted-foreground">v0.01 Alpha</div>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => navigate("/admin")}
                    className={cn(
                      "w-full text-foreground hover:bg-accent hover:text-accent-foreground",
                      location.pathname === "/admin" && "bg-primary/20 text-primary"
                    )}
                  >
                    <Shield className="h-5 w-5" />
                    <span>Painel de Administração</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
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

        <div className="mt-4 px-4 space-y-2">
          <Button 
            variant="default" 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handleRegisterSale}
          >
            <Plus className="mr-2 h-4 w-4" />
            Registar Venda
          </Button>

          <Button 
            variant="outline" 
            className="w-full border-primary text-primary hover:bg-primary/10"
            onClick={handleExternalSale}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Solicitar Venda Externa
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
              className="w-full text-foreground hover:bg-destructive hover:text-destructive-foreground"
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
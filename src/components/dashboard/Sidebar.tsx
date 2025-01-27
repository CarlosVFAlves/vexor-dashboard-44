import { BarChart3, FileText, Home, Users } from "lucide-react";
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

const menuItems = [
  { icon: Home, label: "Sumário de Vendas", path: "/" },
  { icon: FileText, label: "Contratos Pendentes", path: "/pending-contracts" },
  { icon: BarChart3, label: "Métricas da Equipa", path: "/metrics" },
  { icon: Users, label: "Perfil", path: "/profile" },
];

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar>
      <div className="p-4">
        <img src="/vexor-logo.png" alt="Vexor" className="h-8 w-auto" />
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
      </SidebarContent>
    </Sidebar>
  );
};
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, FileText, Settings, Users, LogOut, Image, Grid } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("Guest");

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile && profile.email) {
          setUserName(profile.email.split('@')[0]);
        }
      }
    };

    getProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast({
      title: "Logout efetuado com sucesso",
      description: "Até breve!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">
            Seja bem-vindo, {userName}
          </h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-2" />
            Terminar Sessão
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Novidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/admin/news")}>
                Gerir Novidades
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Grid className="h-5 w-5 mr-2" />
                Produtos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/admin/products")}>
                Gerir Produtos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Equipas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/admin/teams")}>
                Gerir Equipas
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Regras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/admin/rules")}>
                Gerir Regras
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="h-5 w-5 mr-2" />
                Personalização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/admin/customization")}>
                Atualizar Logo/Favicon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/admin/settings")}>
                Configurações do Sistema
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
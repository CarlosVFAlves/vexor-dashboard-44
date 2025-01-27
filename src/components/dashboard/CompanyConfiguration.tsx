import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Settings, Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type Company = {
  id: string;
  name: string;
  category: 'telecommunications' | 'energy_gas';
  active: boolean;
};

type TeamCompany = {
  id: string;
  team_member_id: string;
  company_id: string;
};

export const CompanyConfiguration = () => {
  const { toast } = useToast();
  const [selectedTeamMember, setSelectedTeamMember] = useState<string | null>(null);

  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Company[];
    },
  });

  const { data: teamMembers = [], isLoading: isLoadingTeamMembers } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: teamCompanies = [], refetch: refetchTeamCompanies } = useQuery({
    queryKey: ['teamCompanies', selectedTeamMember],
    queryFn: async () => {
      if (!selectedTeamMember) return [];
      
      const { data, error } = await supabase
        .from('team_companies')
        .select('*')
        .eq('team_member_id', selectedTeamMember);
      
      if (error) throw error;
      return data as TeamCompany[];
    },
    enabled: !!selectedTeamMember,
  });

  const toggleCompanyAccess = async (companyId: string) => {
    if (!selectedTeamMember) return;

    const existingAccess = teamCompanies.find(tc => 
      tc.company_id === companyId && tc.team_member_id === selectedTeamMember
    );

    try {
      if (existingAccess) {
        // Remove access
        await supabase
          .from('team_companies')
          .delete()
          .eq('id', existingAccess.id);
      } else {
        // Grant access
        await supabase
          .from('team_companies')
          .insert({
            team_member_id: selectedTeamMember,
            company_id: companyId,
          });
      }

      await refetchTeamCompanies();
      toast({
        title: "Configuração atualizada",
        description: "As permissões da equipa foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Error toggling company access:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar as permissões.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingCompanies || isLoadingTeamMembers) {
    return <div>Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          Configuração de Empresas
        </CardTitle>
        <Settings className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            {teamMembers.map((member) => (
              <Button
                key={member.id}
                variant={selectedTeamMember === member.id ? "default" : "outline"}
                onClick={() => setSelectedTeamMember(member.id)}
              >
                {member.name}
              </Button>
            ))}
          </div>

          {selectedTeamMember && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Telecomunicações</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="text-right">Acesso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies
                    .filter(company => company.category === 'telecommunications')
                    .map((company) => {
                      const hasAccess = teamCompanies.some(
                        tc => tc.company_id === company.id
                      );
                      return (
                        <TableRow key={company.id}>
                          <TableCell>{company.name}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant={hasAccess ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleCompanyAccess(company.id)}
                            >
                              {hasAccess ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>

              <h3 className="text-lg font-semibold">Energia e Gás</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="text-right">Acesso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies
                    .filter(company => company.category === 'energy_gas')
                    .map((company) => {
                      const hasAccess = teamCompanies.some(
                        tc => tc.company_id === company.id
                      );
                      return (
                        <TableRow key={company.id}>
                          <TableCell>{company.name}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant={hasAccess ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleCompanyAccess(company.id)}
                            >
                              {hasAccess ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const TeamOperators = ({ teamId }: { teamId: string }) => {
  const { data: operators } = useQuery({
    queryKey: ['operatorConfigs', teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operator_configurations')
        .select('*')
        .eq('team_id', teamId)
        .eq('is_active', true);

      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Operadores</CardTitle>
      </CardHeader>
      <CardContent>
        {operators && operators.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {operators.map((op) => (
              <div key={op.id} className="p-3 bg-accent rounded-lg text-center">
                <span className="font-medium">{op.operator}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Operadores ainda não definidos. Configure nas definições.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
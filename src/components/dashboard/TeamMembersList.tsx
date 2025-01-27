import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  tax_id: string | null;
  commercial_code: string | null;
};

export const TeamMembersList = ({ members }: { members: TeamMember[] }) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Membros Ativos</CardTitle>
      </CardHeader>
      <CardContent>
        {members?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <div 
                key={member.id}
                className="flex items-center gap-3 p-4 bg-accent/50 rounded-lg"
              >
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.tax_id && `NIF: ${member.tax_id}`}
                    {member.commercial_code && ` | Código: ${member.commercial_code}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Tente convidar alguns membros :(</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
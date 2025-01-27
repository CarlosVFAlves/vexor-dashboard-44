import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  tax_id: string | null;
  commercial_code: string | null;
};

export const TeamMembersList = ({ members }: { members: TeamMember[] }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <User className="h-5 w-5" />
        Membros Ativos
      </h3>
      {members?.length > 0 ? (
        <div className="grid gap-4">
          {members.map((member) => (
            <div 
              key={member.id}
              className="flex items-center justify-between p-4 bg-accent/50 rounded-lg"
            >
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">
                  {member.tax_id && `NIF: ${member.tax_id}`}
                  {member.commercial_code && ` | Código: ${member.commercial_code}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Ver Estatísticas
                </Button>
                <Button variant="outline" size="sm">
                  Ver Perfil
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>Tente convidar alguns membros :(</p>
        </div>
      )}
    </div>
  );
};
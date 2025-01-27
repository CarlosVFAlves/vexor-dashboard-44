import { Card } from "@/components/ui/card";
import { Users, User, List } from "lucide-react";

type TeamInfoProps = {
  teamName: string;
  teamLeaderName: string | null;
  memberCount: number;
};

export const TeamInfo = ({ teamName, teamLeaderName, memberCount }: TeamInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Equipa</h3>
            <p className="text-muted-foreground">{teamName}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Líder</h3>
            <p className="text-muted-foreground">{teamLeaderName || "Não definido"}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Membros</h3>
            <p className="text-muted-foreground">{memberCount} ativos</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
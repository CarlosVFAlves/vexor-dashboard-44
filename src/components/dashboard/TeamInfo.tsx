import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

type TeamInfoProps = {
  teamName: string;
  teamCode: string;
};

export const TeamInfo = ({ teamName, teamCode }: TeamInfoProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">Equipa: {teamName}</h3>
        <p className="text-sm text-muted-foreground">Código da Equipa: {teamCode}</p>
      </div>
      <Button variant="outline">
        <UserPlus className="h-4 w-4 mr-2" />
        Convidar Membros
      </Button>
    </div>
  );
};
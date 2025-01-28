import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
        Epa! Esta página não existe.
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground text-center mb-8">
        Vamos te levar de volta para a página inicial da VEXOR.
      </p>
      <Button 
        size="lg"
        onClick={() => navigate("/")}
        className="text-lg"
      >
        Voltar para o início
      </Button>
    </div>
  );
};

export default NotFound;
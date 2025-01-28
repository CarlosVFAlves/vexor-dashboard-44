import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const UnauthorizedRedirect = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    toast.error("Acesso Negado", {
      description: "Você não tem permissão para acessar esta página. (Erro: AUTH_ADMIN_001)",
      duration: 5000,
    });

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
        Epa! Você não tem acesso a esta página.
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground text-center mb-8">
        Redirecionando em {countdown} segundos...
      </p>
    </div>
  );
};
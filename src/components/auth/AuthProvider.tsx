import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  isAdmin: boolean;
  loading: boolean;
  session: any;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  loading: true,
  session: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role, email')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            setIsAdmin(false);
            toast.error("Erro ao verificar permissões", {
              description: "Não foi possível verificar suas permissões de acesso.",
            });
          } else {
            setIsAdmin(profile?.role === 'ADMIN');
            toast.success("Bem-vindo!", {
              description: `Usuário: ${profile.email}\nRole: ${profile.role}`,
            });
          }
        } else {
          toast.error("Acesso Negado", {
            description: "Você precisa estar logado para acessar esta página.",
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAdmin(false);
        toast.error("Erro de Autenticação", {
          description: "Ocorreu um erro ao verificar sua sessão.",
        });
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, email')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setIsAdmin(profile.role === 'ADMIN');
          toast.success("Sessão Atualizada", {
            description: `Usuário: ${profile.email}\nRole: ${profile.role}`,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, loading, session }}>
      {children}
    </AuthContext.Provider>
  );
};
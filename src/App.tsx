import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import PendingContracts from "./pages/PendingContracts";
import PendingPayments from "./pages/PendingPayments";
import TeamConfig from "./pages/TeamConfig";
import Products from "./pages/Products";
import Creative from "./pages/Creative";
import ExternalSales from "./pages/ExternalSales";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Persistir sessão em localStorage
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    localStorage.setItem('supabase.auth.token', session.access_token);
  }
  if (event === 'SIGNED_OUT') {
    localStorage.removeItem('supabase.auth.token');
  }
});

const UnauthorizedRedirect = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      navigate(session ? "/" : "/auth");
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

const PrivateRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      // Tentar recuperar sessão do localStorage
      const storedToken = localStorage.getItem('supabase.auth.token');
      if (storedToken) {
        await supabase.auth.setSession({
          access_token: storedToken,
          refresh_token: '',
        });
      }

      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setIsAdmin(profile?.role === 'ADMIN');
      }
      
      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setIsAdmin(profile?.role === 'ADMIN');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <UnauthorizedRedirect />;
  }

  return <>{children}</>;
};

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/pending-contracts"
              element={
                <PrivateRoute>
                  <PendingContracts />
                </PrivateRoute>
              }
            />
            <Route
              path="/pending-payments"
              element={
                <PrivateRoute>
                  <PendingPayments />
                </PrivateRoute>
              }
            />
            <Route
              path="/team-config"
              element={
                <PrivateRoute>
                  <TeamConfig />
                </PrivateRoute>
              }
            />
            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <Products />
                </PrivateRoute>
              }
            />
            <Route
              path="/creative"
              element={
                <PrivateRoute>
                  <Creative />
                </PrivateRoute>
              }
            />
            <Route
              path="/external-sales"
              element={
                <PrivateRoute>
                  <ExternalSales />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
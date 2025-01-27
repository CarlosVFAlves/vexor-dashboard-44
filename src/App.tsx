import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PendingContracts from "./pages/PendingContracts";
import PendingPayments from "./pages/PendingPayments";
import TeamConfig from "./pages/TeamConfig";
import Products from "./pages/Products";
import Creative from "./pages/Creative";
import ExternalSales from "./pages/ExternalSales";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
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
              path="/"
              element={
                <PrivateRoute>
                  <Index />
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
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
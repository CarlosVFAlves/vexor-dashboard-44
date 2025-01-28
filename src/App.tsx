import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
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

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
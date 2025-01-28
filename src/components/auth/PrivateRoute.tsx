import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { UnauthorizedRedirect } from "./UnauthorizedRedirect";

interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const PrivateRoute = ({ children, adminOnly = false }: PrivateRouteProps) => {
  const { isAdmin, loading, session } = useAuth();

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
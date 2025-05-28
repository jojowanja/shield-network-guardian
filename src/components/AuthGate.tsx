
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthGateProps {
  children: ReactNode;
}

export const AuthGate = ({ children }: AuthGateProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = location.pathname === "/auth";
      const isWelcomePage = location.pathname === "/welcome";
      
      if (!user && !isAuthPage && !isWelcomePage) {
        // User not authenticated, redirect to auth
        navigate("/auth", { replace: true });
      } else if (user && isAuthPage) {
        // User authenticated but on auth page, redirect to welcome
        navigate("/welcome", { replace: true });
      }
    }
  }, [user, isLoading, location.pathname, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Shield...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated and not on auth/welcome pages, don't render children
  if (!user && location.pathname !== "/auth" && location.pathname !== "/welcome") {
    return null;
  }

  return <>{children}</>;
};

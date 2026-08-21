import { Navigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

function RootRedirect() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-600">
        Oturum doğrulanıyor...
      </div>
    );
  }

  return (
    <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
  );
}

export default RootRedirect;

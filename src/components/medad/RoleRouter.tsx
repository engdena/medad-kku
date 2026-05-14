import { Navigate } from "react-router-dom";
import { useAuth, type AppRole } from "@/hooks/useAuth";
import type { ReactNode } from "react";

export const RequireAuth = ({
  children,
  allow,
}: {
  children: ReactNode;
  allow?: AppRole[];
}) => {
  const { session, role, loading } = useAuth();
  if (loading) return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;
  if (!session) return <Navigate to="/auth" replace />;
  if (allow && role && !allow.includes(role)) {
    const fallback = role === "mentor" ? "/mentor" : role === "company" ? "/company" : "/";
    return <Navigate to={fallback} replace />;
  }
  return <>{children}</>;
};

export default RequireAuth;
import type { Role } from "@/types/user";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/stores/useAuth";

type Props = {
  roles?: Role[];
};

function ProtectedRoute({ roles }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user!.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;

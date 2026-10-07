import type { Role } from "@/types/user";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

type Props = {
  roles?: Role[];
};

function ProtectedRoute({ roles }: Props) {
  const { user, token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user!.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;

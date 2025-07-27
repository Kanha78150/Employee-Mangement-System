import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = ({ children, role }) => {
  const { token, user } = useAuth();

  if (!token) return <Navigate to="/" replace />;

  if (role && user?.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;

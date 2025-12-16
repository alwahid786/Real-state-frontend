import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children, user, redirectUrl = "/sign-in" }) => {
  if (!user) return <Navigate to={redirectUrl} replace />;

  return children ? children : <Outlet />;
};

export default ProtectedRoute;

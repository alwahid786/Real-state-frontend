import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({
  children,
  user,
  redirectUrl = "/sign-in",
  allowedRoles = [],
}) => {
  if (!user) return <Navigate to={redirectUrl} replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/create-new-comp" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;

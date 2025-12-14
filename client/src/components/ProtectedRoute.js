import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // OLD (existing)
  const isAdminFlag = localStorage.getItem("isAdmin") === "true";

  // NEW (future-proof)
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdminRole = token && user?.role === "admin";

  return isAdminFlag || isAdminRole
    ? children
    : <Navigate to="/admin-login" replace />;
};

export default ProtectedRoute;

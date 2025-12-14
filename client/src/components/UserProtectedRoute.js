import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {
  // OLD
  const oldToken = localStorage.getItem("userToken");

  // NEW
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isUserRole = token && user?.role === "user";

  return oldToken || isUserRole
    ? children
    : <Navigate to="/login" replace />;
};

export default UserProtectedRoute;

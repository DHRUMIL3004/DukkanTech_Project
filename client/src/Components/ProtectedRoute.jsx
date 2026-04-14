import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  let payload;
  try {
    payload = jwtDecode(token);
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return <Navigate to="/login" />;
  }

  if (payload?.exp && payload.exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return <Navigate to="/login" />;
  }

  const userRole = payload?.role;

  // Check role
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;

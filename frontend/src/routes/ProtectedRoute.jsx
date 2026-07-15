import { Navigate }
from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({
  children,
  role
}) => {

  const { user, token, loading } = useAuth();

  if (loading) {
    return null; // or loading spinner
  }

  if (!token || !user) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // Check role if specified
  if (
    role &&
    user?.role !== role
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // For employees, check approval status
  if (user?.role === "EMPLOYEE" && user?.status !== "APPROVED") {
    if (user?.status === "PENDING") {
      return <Navigate to="/waiting-for-approval" replace />;
    } else if (user?.status === "REJECTED") {
      return <Navigate to="/registration-rejected" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ token, children }: any) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
};
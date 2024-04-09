/**
 * Route protection based on user autentication
 */


import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ApiContext } from "../contexts/ApiContext";

export const ProtectedRoute = ({ children }: { children: any }) => {
  const user = useContext(ApiContext).user;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
